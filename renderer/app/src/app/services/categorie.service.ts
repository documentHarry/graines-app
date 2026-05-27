import { Injectable, inject } from '@angular/core';
import { Categorie, CategorieCreateInput, CategorieUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class CategorieService {
  private readonly electronService = inject(ElectronService);

  getCategories(): Promise<Categorie[]> {
    return this.electronService.getApi().getCategories();
  }

  getCategorieById(id: number): Promise<Categorie | null> {
    return this.electronService.getApi().getCategorieById(id);
  }

  createCategorie(categorie: CategorieCreateInput): Promise<Categorie> {
    return this.electronService.getApi().createCategorie(categorie);
  }

  updateCategorie(categorie: CategorieUpdateInput): Promise<Categorie> {
    return this.electronService.getApi().updateCategorie(categorie);
  }

  deleteCategorie(id: number): Promise<Categorie> {
    return this.electronService.getApi().deleteCategorie(id);
  }

  deleteCategorieWithReaffectation(idCategorieASupprimer: number, 
    idCategorieDestination: number): Promise<Categorie> {

    return this.electronService.getApi().deleteCategorieWithReaffectation(
      idCategorieASupprimer, idCategorieDestination
    );
  }

}