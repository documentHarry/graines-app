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

  construireCategorieCreateInput(  valeurFormulaire: {
    nom_categorie: string | null;
    descriptif: string | null;
  }): CategorieCreateInput {
    return {
      nom_categorie: valeurFormulaire.nom_categorie?.trim() ?? '',
      descriptif: valeurFormulaire.descriptif?.trim() || null,
    };
  }

  construireCategorieUpdateInput(idCategorie: number,   valeurFormulaire: {
    nom_categorie: string | null;
    descriptif: string | null;
  }): CategorieUpdateInput {
    return {
      id_categorie: idCategorie,
      nom_categorie: valeurFormulaire.nom_categorie?.trim() ?? '',
      descriptif: valeurFormulaire.descriptif?.trim() || null,
    };
  }

  filtrerCategories(categories: Categorie[], rechercheNom: string, rechercheDescriptif: string): Categorie[] {
    const nom = rechercheNom.toLowerCase().trim();
    const descriptif = rechercheDescriptif.toLowerCase().trim();

    return categories.filter(categorie => {
      const correspondNom =
        nom === '' || categorie.nom_categorie.toLowerCase().includes(nom);

      const correspondDescriptif =
        descriptif === '' || (categorie.descriptif ?? '').toLowerCase().includes(descriptif);

      return correspondNom && correspondDescriptif;
    });
  }

  getNombreProduits(categorie: Categorie | null): number {
    return categorie?._count?.produit ?? 0;
  }

  exclureCategorie(categories: Categorie[], categorieAExclure: Categorie): Categorie[] {
    return categories.filter(categorie => {
      return categorie.id_categorie !== categorieAExclure.id_categorie;
    });
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création de la catégorie.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification de la catégorie.';
  }

  getMessageErreurSuppression(error: unknown): string {
    const message = String(error);

    if (message.includes('CATEGORY_HAS_PRODUCTS')) {
      return 'Cette catégorie contient des produits. Veuillez choisir une catégorie de réaffectation.';
    }

    return 'Une erreur est survenue pendant la suppression de la catégorie.';
  }

  getMessageErreurReaffectation(error: unknown): string {
    const message = String(error);

    if (message.includes('SAME_CATEGORY')) {
      return 'La catégorie de destination doit être différente.';
    }

    if (message.includes('DESTINATION_CATEGORY_NOT_FOUND')) {
      return 'La catégorie de destination est introuvable.';
    }

    return 'Une erreur est survenue pendant la réaffectation.';
  }

}