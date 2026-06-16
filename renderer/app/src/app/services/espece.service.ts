import { Injectable, inject } from '@angular/core';
import { Espece, EspeceCreateInput, EspeceUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class EspeceService {
  private readonly electronService = inject(ElectronService);

  getEspeces(): Promise<Espece[]> {
    return this.electronService.getApi().getEspeces();
  }

  getEspeceById(id: number): Promise<Espece | null> {
    return this.electronService.getApi().getEspeceById(id);
  }

  createEspece(espece: EspeceCreateInput): Promise<Espece> {
    return this.electronService.getApi().createEspece(espece);
  }

  updateEspece(espece: EspeceUpdateInput): Promise<Espece> {
    return this.electronService.getApi().updateEspece(espece);
  }

  deleteEspece(id: number): Promise<Espece> {
    return this.electronService.getApi().deleteEspece(id);
  }

  filtrerEspeces(especes: Espece[], rechercheNomCommun: string, rechercheNomScientifique: string): Espece[] {
    const nomCommun = rechercheNomCommun.toLowerCase().trim();
    const nomScientifique = rechercheNomScientifique.toLowerCase().trim();

    return especes.filter(espece => {
      const correspondNomCommun =
        nomCommun === '' || espece.nom_commun.toLowerCase().includes(nomCommun);

      const correspondNomScientifique =
        nomScientifique === '' || espece.nom_scientifique.toLowerCase().includes(nomScientifique);

      return correspondNomCommun && correspondNomScientifique;
    });
  }

  getNombreVarietes(espece: Espece | null): number {
    return espece?._count?.variete ?? 0;
  }

  construireEspeceCreateInput(valeurFormulaire: {
    nom_commun: string | null;
    nom_scientifique: string | null;
  }): EspeceCreateInput {
    return {
      nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
      nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
    };
  }

  construireEspeceUpdateInput(
    idEspece: number, valeurFormulaire: {
      nom_commun: string | null;
      nom_scientifique: string | null;
    }): EspeceUpdateInput {
    return {
      id_espece: idEspece,
      nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
      nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
    };
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création de l’espèce.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification de l’espèce.';
  }

  getMessageErreurSuppression(error: unknown): string {
    const message = String(error);

    if (message.includes('ESPECE_HAS_VARIETES')) {
      return 'Cette espèce possède des variétés associées. Elle ne peut pas être supprimée.';
    }

    return 'Une erreur est survenue pendant la suppression de l’espèce.';
  }

}