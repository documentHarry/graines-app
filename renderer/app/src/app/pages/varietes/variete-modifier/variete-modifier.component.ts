import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Espece, Variete } from '../../../types/electron';
import { EspeceService } from '../../../services/espece.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-variete-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './variete-modifier.component.html',
  styleUrl: './variete-modifier.component.css',
})

export class VarieteModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly especeService = inject(EspeceService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  id = input<string>();

  variete = signal<Variete | null>(null);
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
    const idVariete = Number(this.id());

    if (!idVariete) {
      this.message.set('Identifiant de la variété invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const variete = await this.varieteService.getVarieteById(idVariete);
      const especes = await this.especeService.getEspeces();

      if (!variete) {
        this.message.set('Variété introuvable.');
        return;
      }

      this.variete.set(variete);
      this.especes.set(especes);

      this.varieteForm.patchValue({
        espece_id: variete.espece_id,
        nom: variete.nom,
        descriptif: variete.descriptif ?? '',
        bio: variete.bio ?? 0,
        cycle_jours: variete.cycle_jours,
        couleur_legume: variete.couleur_legume ?? '',
        taille_fixe_legume: variete.taille_fixe_legume,
        taille_min_legume: variete.taille_min_legume,
        taille_max_legume: variete.taille_max_legume,
        espacement_entre_les_plants: variete.espacement_entre_les_plants,
        espacement_entre_les_lignes: variete.espacement_entre_les_lignes,
        type_ensoleillement: variete.type_ensoleillement ?? '',
        type_feuillage: variete.type_feuillage ?? '',
        hauteur_adulte_min: variete.hauteur_adulte_min,
        hauteur_adulte_max: variete.hauteur_adulte_max,
        duree_de_germination: variete.duree_de_germination ?? '',
        temperature_min_de_germination: variete.temperature_min_de_germination,
        cycle_de_vie: variete.cycle_de_vie ?? '',
        rusticite_plante: variete.rusticite_plante ?? '',
        date_semis_min: variete.date_semis_min ?? '',
        date_semis_max: variete.date_semis_max ?? '',
        duree_avant_recolte: variete.duree_avant_recolte ?? '',
        type_de_sol: variete.type_de_sol ?? '',
        conseil_plantation: variete.conseil_plantation ?? '',
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement variété', { error, idVariete });
      this.message.set('Erreur pendant le chargement de la variété.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const varieteActuelle = this.variete();

    if (this.varieteForm.invalid || !varieteActuelle) {
      this.varieteForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const variete = this.varieteService.construireVarieteUpdateInput(
      varieteActuelle.id_variete,
      this.varieteForm.getRawValue()
    );

    try {
      await this.varieteService.updateVariete(variete);
      await this.router.navigate(['/varietes', variete.id_variete]);
    }
    catch (error) {
      console.error('Erreur modification variété', { error, formulaire: this.varieteForm.getRawValue(), variete });
      this.message.set(this.varieteService.getMessageErreurModification());
    }
  }
}