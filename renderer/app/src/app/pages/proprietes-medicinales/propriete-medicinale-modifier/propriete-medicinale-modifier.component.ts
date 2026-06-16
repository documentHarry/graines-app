import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProprieteMedicinale } from '../../../types/electron';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

@Component({
  selector: 'app-propriete-medicinale-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './propriete-medicinale-modifier.component.html',
  styleUrl: './propriete-medicinale-modifier.component.css',
})

export class ProprieteMedicinaleModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly router = inject(Router);

  id = input<string>();

  propriete = signal<ProprieteMedicinale | null>(null);
  proprietes = signal<ProprieteMedicinale[]>([]);
  isLoading = signal(true);
  message = signal('');

  proprieteForm = this.formBuilder.group({
    nom_propriete: ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerPropriete();
  }

  async chargerPropriete(): Promise<void> {
    const idPropriete = Number(this.id());

    if (!idPropriete) {
      this.message.set('Identifiant de la propriété médicinale invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const proprietes = await this.proprieteMedicinaleService.getProprietesMedicinales();
      const propriete = proprietes.find(item => item.id_propriete === idPropriete) ?? null;

      if (!propriete) {
        this.message.set('Propriété médicinale introuvable.');
        return;
      }

      this.proprietes.set(proprietes);
      this.propriete.set(propriete);
      this.proprieteForm.patchValue({
        nom_propriete: propriete.nom_propriete,
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement propriété médicinale', { error, idPropriete });
      this.message.set('Erreur pendant le chargement de la propriété médicinale.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const proprieteActuelle = this.propriete();

    if (this.proprieteForm.invalid || !proprieteActuelle) {
      this.proprieteForm.markAllAsTouched();
      this.message.set('Veuillez saisir un nom de propriété médicinale.');
      return;
    }

    const propriete = this.proprieteMedicinaleService.construireProprieteMedicinaleUpdateInput(
      proprieteActuelle.id_propriete,
      this.proprieteForm.getRawValue()
    );

    try {
      await this.proprieteMedicinaleService.updateProprieteMedicinale(propriete);
      await this.router.navigate(['/proprietes-medicinales']);
    }
    catch (error) {
      console.error('Erreur modification propriété médicinale', { error, formulaire: this.proprieteForm.getRawValue(), propriete });
      this.message.set(this.proprieteMedicinaleService.getMessageErreurEnregistrement());
    }
  }
}