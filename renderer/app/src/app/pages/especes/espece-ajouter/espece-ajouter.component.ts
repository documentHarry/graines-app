import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

    const espece = this.especeService.construireEspeceCreateInput(
      this.especeForm.getRawValue()
    );

    try {
      await this.especeService.createEspece(espece);
      await this.router.navigate(['/especes']);
    }
    catch (error) {
      console.error('Erreur création espèce', { error, formulaire: this.especeForm.getRawValue(), espece });
      this.message.set(this.especeService.getMessageErreurCreation());
    }
  }
}