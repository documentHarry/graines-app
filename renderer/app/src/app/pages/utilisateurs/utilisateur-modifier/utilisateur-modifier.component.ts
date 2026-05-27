import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Utilisateur, UtilisateurUpdateInput } from '../../../types/electron';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-modifier.component.html',
  styleUrl: './utilisateur-modifier.component.css',
})

export class UtilisateurModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  id = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  isLoading = signal(true);
  message = signal('');

  utilisateurForm = this.formBuilder.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    actif: [1, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerUtilisateur();
  }

  async chargerUtilisateur(): Promise<void> {
    const idUtilisateur = Number(this.id());

    if (!idUtilisateur) {
      this.message.set('Identifiant de l’utilisateur invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const utilisateur = await this.utilisateurService.getUtilisateurById(idUtilisateur);

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);

      this.utilisateurForm.patchValue({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        actif: utilisateur.actif ?? 1,
      });

      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de l’utilisateur.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.utilisateurForm.invalid || !this.utilisateur()) {
      this.utilisateurForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.utilisateurForm.getRawValue();

    const utilisateur: UtilisateurUpdateInput = {
      id_utilisateur: this.utilisateur()!.id_utilisateur,
      nom: valeurFormulaire.nom?.trim() ?? '',
      prenom: valeurFormulaire.prenom?.trim() ?? '',
      email: valeurFormulaire.email?.trim() ?? ''
    };

    try {
      await this.utilisateurService.updateUtilisateur(utilisateur);
      await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_USER_EMAIL')) {
        this.message.set('Un utilisateur avec cet email existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la modification de l’utilisateur.');
    }
  }

}