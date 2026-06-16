import { Injectable, inject } from '@angular/core';
import { ProprieteMedicinale, ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class ProprieteMedicinaleService {
  private readonly electronService = inject(ElectronService);

  getProprietesMedicinales(): Promise<ProprieteMedicinale[]> {
    return this.electronService.getApi().getProprietesMedicinales();
  }

  createProprieteMedicinale(propriete: ProprieteMedicinaleCreateInput): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().createProprieteMedicinale(propriete);
  }

  updateProprieteMedicinale(propriete: ProprieteMedicinaleUpdateInput): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().updateProprieteMedicinale(propriete);
  }

  deleteProprieteMedicinale(id: number): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().deleteProprieteMedicinale(id);
  }

  construireProprieteMedicinaleCreateInput( valeurFormulaire: {
    nom_propriete: string | null;
  }): ProprieteMedicinaleCreateInput {
    return {
      nom_propriete: valeurFormulaire.nom_propriete?.trim() ?? '',
    };
  }

  construireProprieteMedicinaleUpdateInput(idPropriete: number, valeurFormulaire: {
    nom_propriete: string | null;
  }): ProprieteMedicinaleUpdateInput {
    return {
      id_propriete: idPropriete,
      nom_propriete: valeurFormulaire.nom_propriete?.trim() ?? '',
    };
  }

  filtrerProprietesMedicinales(proprietes: ProprieteMedicinale[], recherche: string): ProprieteMedicinale[] {
    const rechercheNettoyee = recherche.toLowerCase().trim();

    return proprietes.filter(propriete => {
      return rechercheNettoyee === '' || propriete.nom_propriete.toLowerCase().includes(rechercheNettoyee);
    });
  }

  getNomProprieteNettoye( valeurFormulaire: {
    nom_propriete: string | null;
  }): string {
    return valeurFormulaire.nom_propriete?.trim() ?? '';
  }

  getMessageErreurEnregistrement(): string {
    return 'Erreur pendant l’enregistrement de la propriété médicinale.';
  }

  getMessageErreurSuppression(): string {
    return 'Erreur pendant la suppression de la propriété médicinale.';
  }

}