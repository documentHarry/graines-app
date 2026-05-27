import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Aromate, AromateInput, ProprieteMedicinale, Espece, Variete, VarieteUpdateInput } from '../../../types/electron';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
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
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly especeService = inject(EspeceService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  id = input<string>();

  proprietesMedicinales = signal<ProprieteMedicinale[]>([]);
  proprietesSelectionnees = signal<number[]>([]);
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
    partie_utilisee: [''],
    propriete_aromate: [''],
    usage_culinaire: [''],
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
      const proprietesMedicinales = await this.proprieteMedicinaleService.getProprietesMedicinales();

      if (!variete) {
        this.message.set('Variété introuvable.');
        return;
      }

      this.variete.set(variete);
      this.especes.set(especes);
      this.proprietesMedicinales.set(proprietesMedicinales);

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

      const aromate = this.getPremierAromate(variete);

      if (aromate) {
        this.varieteForm.patchValue({
          partie_utilisee: aromate.partie_utilisee ?? '',
          propriete_aromate: aromate.propriete ?? '',
          usage_culinaire: aromate.usage_culinaire ?? '',
        });

      this.proprietesSelectionnees.set(
        aromate.aromate_propriete?.map(item => item.propriete_id) ?? []
      );
    }

      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de la variété.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getPremierAromate(variete: Variete): Aromate | null {
    return variete.aromate?.[0] ?? null;
  }

  estProprieteSelectionnee(proprieteId: number): boolean {
    return this.proprietesSelectionnees().includes(proprieteId);
  }

  changerPropriete(event: Event, proprieteId: number): void {
    const input = event.target as HTMLInputElement;
    const proprietes = this.proprietesSelectionnees();

    if (input.checked) {
      this.proprietesSelectionnees.set([...proprietes, proprieteId]);
      return;
    }

    this.proprietesSelectionnees.set(
      proprietes.filter(id => id !== proprieteId)
    );
  }

  getAromateInput(): AromateInput | null {
    const valeurFormulaire = this.varieteForm.getRawValue();

    const partieUtilisee = valeurFormulaire.partie_utilisee?.trim() || null;
    const propriete = valeurFormulaire.propriete_aromate?.trim() || null;
    const usageCulinaire = valeurFormulaire.usage_culinaire?.trim() || null;
    const proprietesIds = this.proprietesSelectionnees();

    if (!partieUtilisee && !propriete && !usageCulinaire && proprietesIds.length === 0) {
      return null;
    }

    return {
      partie_utilisee: partieUtilisee,
      propriete: propriete,
      usage_culinaire: usageCulinaire,
      proprietes_ids: proprietesIds,
    };
  }

  supprimerAromate(): void {
    this.varieteForm.patchValue({
      partie_utilisee: '',
      propriete_aromate: '',
      usage_culinaire: '',
    });

    this.proprietesSelectionnees.set([]);
  }

  async enregistrer(): Promise<void> {
    if (this.varieteForm.invalid || !this.variete()) {
      this.varieteForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.varieteForm.getRawValue();

    const variete: VarieteUpdateInput = {
      id_variete: this.variete()!.id_variete,
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
      aromate: this.getAromateInput(),
    };

    try {
      await this.varieteService.updateVariete(variete);
      await this.router.navigate(['/varietes', variete.id_variete]);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_VARIETE')) {
        this.message.set('Une variété avec ce nom existe déjà pour cette espèce.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la modification de la variété.');
    }
  }
}