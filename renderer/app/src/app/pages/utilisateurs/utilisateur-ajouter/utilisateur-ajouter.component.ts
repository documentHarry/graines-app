import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurCreateInput } from '../../../types/electron';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-ajouter.component.html',
  styleUrl: './utilisateur-ajouter.component.css',
})

export class UtilisateurAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  message = signal('');

  utilisateurForm = this.formBuilder.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', Validators.required]
  });

  async enregistrer(): Promise<void> {
    if (this.utilisateurForm.invalid) {
      this.utilisateurForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.utilisateurForm.getRawValue();

    const utilisateur: UtilisateurCreateInput = {
      nom: valeurFormulaire.nom?.trim() ?? '',
      prenom: valeurFormulaire.prenom?.trim() ?? '',
      email: valeurFormulaire.email?.trim() ?? '',
      mot_de_passe: valeurFormulaire.mot_de_passe ?? ''
    };

    try {
      await this.utilisateurService.createUtilisateur(utilisateur);
      await this.router.navigate(['/utilisateurs']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_USER_EMAIL')) {
        this.message.set('Un utilisateur avec cet email existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création de l’utilisateur.');
    }
  }

}