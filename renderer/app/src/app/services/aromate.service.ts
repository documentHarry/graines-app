import { Injectable, inject } from '@angular/core';
import { Aromate, AromateCreateInput, AromateUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class AromateService {
  private readonly electronService = inject(ElectronService);

  getAromates(): Promise<Aromate[]> {
    return this.electronService.getApi().getAromates();
  }

  getAromateById(id: number): Promise<Aromate | null> {
    return this.electronService.getApi().getAromateById(id);
  }

  createAromate(aromate: AromateCreateInput): Promise<Aromate> {
    return this.electronService.getApi().createAromate(aromate);
  }

  updateAromate(aromate: AromateUpdateInput): Promise<Aromate> {
    return this.electronService.getApi().updateAromate(aromate);
  }

  deleteAromate(id: number): Promise<Aromate> {
    return this.electronService.getApi().deleteAromate(id);
  }

  getProprietesMedicinales(aromate: Aromate): string[] {
    return aromate.aromate_propriete
      ?.map(item => item.propriete_medicinale.nom_propriete)
      ?? [];
  }

  filtrerAromates(
    aromates: Aromate[],
    rechercheNom: string,
    especeRecherche: string,
    partieUtiliseeRecherche: string,
    usageCulinaireRecherche: string
  ): Aromate[] {
    const recherche = rechercheNom.toLowerCase().trim();

    return aromates.filter(aromate => {
      const correspondNom = recherche === '' ||
        aromate.variete?.nom.toLowerCase().includes(recherche);

      const correspondEspece = especeRecherche === '' ||
        aromate.variete?.espece?.nom_commun === especeRecherche;

      const correspondPartieUtilisee = partieUtiliseeRecherche === '' ||
        aromate.partie_utilisee === partieUtiliseeRecherche;

      const correspondUsageCulinaire = usageCulinaireRecherche === '' ||
        aromate.usage_culinaire === usageCulinaireRecherche;

      return correspondNom && correspondEspece && correspondPartieUtilisee && correspondUsageCulinaire;
    });
  }

  getProprietesSelectionneesDepuisAromate(aromate: Aromate | null): number[] {
    return aromate?.aromate_propriete?.map(item => item.propriete_id) ?? [];
  }

  construireAromateCreateInput(
    valeurFormulaire: {
      variete_id: number | null;
      partie_utilisee: string | null;
      propriete: string | null;
      usage_culinaire: string | null;
    },
    proprietesIds: number[]
  ): AromateCreateInput {
    return {
      variete_id: Number(valeurFormulaire.variete_id),
      partie_utilisee: valeurFormulaire.partie_utilisee?.trim() || null,
      propriete: valeurFormulaire.propriete?.trim() || null,
      usage_culinaire: valeurFormulaire.usage_culinaire?.trim() || null,
      proprietes_ids: proprietesIds
    };
  }

  construireAromateUpdateInput(
    idAromate: number,
    valeurFormulaire: {
      variete_id: number | null;
      partie_utilisee: string | null;
      propriete: string | null;
      usage_culinaire: string | null;
    },
    proprietesIds: number[]
  ): AromateUpdateInput {
    return {
      id_aromate: idAromate,
      variete_id: Number(valeurFormulaire.variete_id),
      partie_utilisee: valeurFormulaire.partie_utilisee?.trim() || null,
      propriete: valeurFormulaire.propriete?.trim() || null,
      usage_culinaire: valeurFormulaire.usage_culinaire?.trim() || null,
      proprietes_ids: proprietesIds
    };
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création de l’aromate.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification de l’aromate.';
  }

  getMessageErreurSuppression(): string {
    return 'Une erreur est survenue pendant la suppression de l’aromate.';
  }
}