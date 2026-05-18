import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Espece, VarieteCreateInput } from '../../../types/electron';
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
    await this.chargerEspeces();
  }

  async chargerEspeces(): Promise<void> {
    try {
      const especes = await this.especeService.getEspeces();

      this.especes.set(especes);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des espèces.');
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

    const valeurFormulaire = this.varieteForm.getRawValue();

    const variete: VarieteCreateInput = {
      espece_id: Number(valeurFormulaire.espece_id),
      nom: valeurFormulaire.nom?.trim() ?? '',
      descriptif: valeurFormulaire.descriptif?.trim() || null,
      bio: Number(valeurFormulaire.bio),
      cycle_jours: valeurFormulaire.cycle_jours,
      couleur_legume: valeurFormulaire.couleur_legume?.trim() || null,
      taille_fixe_legume: valeurFormulaire.taille_fixe_legume,
      taille_min_legume: valeurFormulaire.taille_min_legume,
      taille_max_legume: valeurFormulaire.taille_max_legume,
      espacement_entre_les_plants: valeurFormulaire.espacement_entre_les_plants,
      espacement_entre_les_lignes: valeurFormulaire.espacement_entre_les_lignes,
      type_ensoleillement: valeurFormulaire.type_ensoleillement?.trim() || null,
      type_feuillage: valeurFormulaire.type_feuillage?.trim() || null,
      hauteur_adulte_min: valeurFormulaire.hauteur_adulte_min,
      hauteur_adulte_max: valeurFormulaire.hauteur_adulte_max,
      duree_de_germination: valeurFormulaire.duree_de_germination?.trim() || null,
      temperature_min_de_germination: valeurFormulaire.temperature_min_de_germination,
      cycle_de_vie: valeurFormulaire.cycle_de_vie?.trim() || null,
      rusticite_plante: valeurFormulaire.rusticite_plante?.trim() || null,
      date_semis_min: valeurFormulaire.date_semis_min?.trim() || null,
      date_semis_max: valeurFormulaire.date_semis_max?.trim() || null,
      duree_avant_recolte: valeurFormulaire.duree_avant_recolte?.trim() || null,
      type_de_sol: valeurFormulaire.type_de_sol?.trim() || null,
      conseil_plantation: valeurFormulaire.conseil_plantation?.trim() || null,
    };

    try {
      await this.varieteService.createVariete(variete);
      await this.router.navigate(['/varietes']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_VARIETE')) {
        this.message.set('Une variété avec ce nom existe déjà pour cette espèce.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création de la variété.');
    }
  }
}