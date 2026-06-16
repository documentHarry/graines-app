import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Espece } from '../../../types/electron';
import { EspeceService } from '../../../services/espece.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-variete-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './variete-ajouter.component.html',
  styleUrl: './variete-ajouter.component.css',
})

export class VarieteAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly especeService = inject(EspeceService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  especes = signal<Espece[]>([]);
  isLoading = signal(true);
  message = signal('');

  varieteForm = this.formBuilder.group({
    espece_id: [0, [Validators.required, Validators.min(1)]],
    nom: ['', Validators.required],
    descriptif: [''],
    bio: [0, Validators.required],
    cycle_jours: [null as number | null],
    couleur_legume: [''],
    taille_fixe_legume: [null as number | null],
    taille_min_legume: [null as number | null],
    taille_max_legume: [null as number | null],
    espacement_entre_les_plants: [null as number | null],
    espacement_entre_les_lignes: [null as number | null],
    type_ensoleillement: [''],
    type_feuillage: [''],
    hauteur_adulte_min: [null as number | null],
    hauteur_adulte_max: [null as number | null],
    duree_de_germination: [''],
    temperature_min_de_germination: [null as number | null],
    cycle_de_vie: [''],
    rusticite_plante: [''],
    date_semis_min: [''],
    date_semis_max: [''],
    duree_avant_recolte: [''],
    type_de_sol: [''],
    conseil_plantation: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    try {
      const especes = await this.especeService.getEspeces();

      this.especes.set(especes);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement données variété', { error });
      this.message.set('Erreur pendant le chargement des données.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.varieteForm.invalid) {
      this.varieteForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const variete = this.varieteService.construireVarieteCreateInput(
      this.varieteForm.getRawValue()
    );

    try {
      await this.varieteService.createVariete(variete);
      await this.router.navigate(['/varietes']);
    }
    catch (error) {
      console.error('Erreur création variété', { error, formulaire: this.varieteForm.getRawValue(), variete });
      this.message.set(this.varieteService.getMessageErreurCreation());
    }
  }

}