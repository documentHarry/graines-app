import { Injectable, inject } from '@angular/core';
import { AdresseLivraison, AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class AdresseLivraisonService {
  private readonly electronService = inject(ElectronService);

  createAdresseLivraison(adresse: AdresseLivraisonCreateInput): Promise<AdresseLivraison> {
    return this.electronService.getApi().createAdresseLivraison(adresse);
  }

  updateAdresseLivraison(adresse: AdresseLivraisonUpdateInput): Promise<AdresseLivraison> {
    return this.electronService.getApi().updateAdresseLivraison(adresse);
  }

  deleteAdresseLivraison(id: number): Promise<AdresseLivraison> {
    return this.electronService.getApi().deleteAdresseLivraison(id);
  }

  getAdresseComplete(adresse: AdresseLivraison): string {
    return `${adresse.rue} ${adresse.numero}, ${adresse.localite.code_postal} ${adresse.localite.localite}`;
  }

  getLabelAdresseParDefaut(adresse: AdresseLivraison): string {
    if (adresse.par_defaut === 1) {
      return 'Adresse par défaut';
    }

    return 'Adresse secondaire';
  }

  construireAdresseLivraisonCreateInput(
    utilisateurId: number,
    valeurFormulaire: {
      rue: string | null;
      numero: string | null;
      par_defaut: number | null;
      localite_id: number | null;
    }
  ): AdresseLivraisonCreateInput {
    return {
      rue: valeurFormulaire.rue?.trim() ?? '',
      numero: valeurFormulaire.numero?.trim() ?? '',
      par_defaut: valeurFormulaire.par_defaut ?? 0,
      utilisateur_id: utilisateurId,
      localite_id: valeurFormulaire.localite_id!,
    };
  }

  construireAdresseLivraisonUpdateInput(
    idAdresse: number,
    valeurFormulaire: {
      rue: string | null;
      numero: string | null;
      par_defaut: number | null;
      localite_id: number | null;
    }
  ): AdresseLivraisonUpdateInput {
    return {
      id_adresse: idAdresse,
      rue: valeurFormulaire.rue?.trim() ?? '',
      numero: valeurFormulaire.numero?.trim() ?? '',
      par_defaut: valeurFormulaire.par_defaut ?? 0,
      localite_id: valeurFormulaire.localite_id!,
    };
  }

  getMessageErreurChampsObligatoires(): string {
    return 'Veuillez remplir les champs obligatoires de l’adresse.';
  }

  getMessageErreurLocalite(): string {
    return 'Veuillez sélectionner une localité.';
  }

  getMessageErreurEnregistrement(): string {
    return 'Une erreur est survenue pendant l’enregistrement de l’adresse.';
  }

  getMessageErreurSuppression(): string {
    return 'Une erreur est survenue pendant la suppression de l’adresse.';
  }

}