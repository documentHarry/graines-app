import { Injectable, inject } from '@angular/core';
import { Variete, VarieteCreateInput, VarieteUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class VarieteService {
  private readonly electronService = inject(ElectronService);

  getVarietes(): Promise<Variete[]> {
    return this.electronService.getApi().getVarietes();
  }

  filtrerVarietes(varietes: Variete[], rechercheNom: string, bioRecherche: string,
    especeRecherche: string, ensoleillementRecherche: string, cycleVieRecherche: string): Variete[] {
    const nom = rechercheNom.toLowerCase().trim();

    return varietes.filter(variete => {
      const correspondNom = nom === '' || variete.nom.toLowerCase().includes(nom);

      const correspondBio =
        bioRecherche === '' ||
        bioRecherche === 'bio' && variete.bio === 1 ||
        bioRecherche === 'non-bio' && variete.bio !== 1;

      const correspondEspece = especeRecherche === '' || variete.espece.nom_commun === especeRecherche;

      const correspondEnsoleillement = ensoleillementRecherche === '' || variete.type_ensoleillement === ensoleillementRecherche;

      const correspondCycleVie = cycleVieRecherche === '' || variete.cycle_de_vie === cycleVieRecherche;

      return correspondNom && correspondBio && correspondEspece && correspondEnsoleillement && correspondCycleVie;
    });
  }

  getVarieteById(id: number): Promise<Variete | null> {
    return this.electronService.getApi().getVarieteById(id);
  }

  createVariete(variete: VarieteCreateInput): Promise<Variete> {
    return this.electronService.getApi().createVariete(variete);
  }

  updateVariete(variete: VarieteUpdateInput): Promise<Variete> {
    return this.electronService.getApi().updateVariete(variete);
  }

  deleteVariete(id: number): Promise<Variete> {
    return this.electronService.getApi().deleteVariete(id);
  }

  getNombreProduits(variete: Variete | null): number {
    return variete?._count?.produit ?? 0;
  }

  getLabelBio(variete: Variete | null): string {
    return variete?.bio === 1 ? 'Bio' : 'Non bio';
  }

  construireVarieteCreateInput(valeurFormulaire: any): VarieteCreateInput {
    return {
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
  }

  construireVarieteUpdateInput(
    idVariete: number,
    valeurFormulaire: any
  ): VarieteUpdateInput {
    return {
      id_variete: idVariete,
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
  }

  getConseilsPlantation(variete: Variete | null): string[] {
    const conseil = variete?.conseil_plantation;

    if (!conseil) {
      return [];
    }

    return conseil
      .split('.')
      .map(phrase => phrase.trim())
      .filter(phrase => phrase.length > 0)
      .map(phrase => phrase + '.');
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création de la variété.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification de la variété.';
  }

  getMessageErreurSuppression(error: unknown): string {
    const message = String(error);

    if (message.includes('VARIETE_HAS_PRODUCTS')) {
      return 'Cette variété possède des produits associés. Elle ne peut pas être supprimée.';
    }

    return 'Une erreur est survenue pendant la suppression de la variété.';
  }
}