import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EspeceCreateInput } from '../../../types/electron';
import { EspeceService } from '../../../services/espece.service';

@Component({
  selector: 'app-espece-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './espece-ajouter.component.html',
  styleUrl: './espece-ajouter.component.css',
})
export class EspeceAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly especeService = inject(EspeceService);
  private readonly router = inject(Router);

  message = signal('');

  especeForm = this.formBuilder.group({
    nom_commun: ['', Validators.required],
    nom_scientifique: ['', Validators.required],
  });

  async enregistrer(): Promise<void> {
    if (this.especeForm.invalid) {
      this.especeForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.especeForm.getRawValue();

    const espece: EspeceCreateInput = {
      nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
      nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
    };

    try {
      await this.especeService.createEspece(espece);
      await this.router.navigate(['/especes']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_ESPECE')) {
        this.message.set('Une espèce avec ce nom commun ou ce nom scientifique existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création de l’espèce.');
    }
  }
}