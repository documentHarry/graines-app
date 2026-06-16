import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Espece } from '../../../types/electron';
import { EspeceService } from '../../../services/espece.service';

@Component({
  selector: 'app-espece-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './espece-modifier.component.html',
  styleUrl: './espece-modifier.component.css',
})

export class EspeceModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly especeService = inject(EspeceService);
  private readonly router = inject(Router);

  id = input<string>();

  espece = signal<Espece | null>(null);
  isLoading = signal(true);
  message = signal('');

  especeForm = this.formBuilder.group({
    nom_commun: ['', Validators.required],
    nom_scientifique: ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerEspece();
  }

  async chargerEspece(): Promise<void> {
    const idEspece = Number(this.id());

    if (!idEspece) {
      this.message.set('Identifiant de l’espèce invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const espece = await this.especeService.getEspeceById(idEspece);

      if (!espece) {
        this.message.set('Espèce introuvable.');
        return;
      }

      this.espece.set(espece);

      this.especeForm.patchValue({
        nom_commun: espece.nom_commun,
        nom_scientifique: espece.nom_scientifique,
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement espèce', { error, idEspece });
      this.message.set('Erreur pendant le chargement de l’espèce.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.especeForm.invalid || !this.espece()) {
      this.especeForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const espece = this.especeService.construireEspeceUpdateInput(
      this.espece()!.id_espece,
      this.especeForm.getRawValue()
    );

    try {
      await this.especeService.updateEspece(espece);
      await this.router.navigate(['/especes']);
    }
    catch (error) {
      console.error('Erreur modification espèce', { error, formulaire: this.especeForm.getRawValue(), espece });
      this.message.set(this.especeService.getMessageErreurModification());
    }
  }
}