import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

@Component({
  selector: 'app-propriete-medicinale-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './propriete-medicinale-ajouter.component.html',
  styleUrl: './propriete-medicinale-ajouter.component.css',
})

export class ProprieteMedicinaleAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly router = inject(Router);

  message = signal('');

  proprieteForm = this.formBuilder.group({
    nom_propriete: ['', Validators.required],
  });

  async enregistrer(): Promise<void> {
    if (this.proprieteForm.invalid) {
      this.proprieteForm.markAllAsTouched();
      this.message.set('Veuillez saisir un nom de propriété médicinale.');
      return;
    }

    const propriete = this.proprieteMedicinaleService.construireProprieteMedicinaleCreateInput(
      this.proprieteForm.getRawValue()
    );

    try {
      await this.proprieteMedicinaleService.createProprieteMedicinale(propriete);
      await this.router.navigate(['/proprietes-medicinales']);
    }
    catch (error) {
      console.error('Erreur création propriété médicinale', { error, formulaire: this.proprieteForm.getRawValue(), propriete });
      this.message.set(this.proprieteMedicinaleService.getMessageErreurEnregistrement());
    }
  }
}