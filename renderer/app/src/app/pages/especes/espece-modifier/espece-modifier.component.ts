import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Espece, EspeceUpdateInput } from '../../../types/electron';
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
    catch {
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

    const valeurFormulaire = this.especeForm.getRawValue();

    const espece: EspeceUpdateInput = {
      id_espece: this.espece()!.id_espece,
      nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
      nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
    };

    try {
      await this.especeService.updateEspece(espece);
      await this.router.navigate(['/especes']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_ESPECE')) {
        this.message.set('Une espèce avec ce nom commun ou ce nom scientifique existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la modification de l’espèce.');
    }
  }
}