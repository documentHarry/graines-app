import { Injectable, inject } from '@angular/core';
import { Produit, ProduitCreateInput, ProduitUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private readonly electronService = inject(ElectronService);

  getProduits(): Promise<Produit[]> {
    return this.electronService.getApi().getProduits();
  }

  getProduitById(id: number): Promise<Produit | null> {
    return this.electronService.getApi().getProduitById(id);
  }

  getProduitsByCategorie(categorieId: number): Promise<Produit[]> {
    return this.electronService.getApi().getProduitsByCategorie(categorieId);
  }

  createProduit(produit: ProduitCreateInput): Promise<Produit> {
    return this.electronService.getApi().createProduit(produit);
  }

  updateProduit(produit: ProduitUpdateInput): Promise<Produit> {
    return this.electronService.getApi().updateProduit(produit);
  }

  deleteProduit(id: number): Promise<Produit> {
    return this.electronService.getApi().deleteProduit(id);
  }

  filtrerProduits(
    produits: Produit[],
    rechercheTexte: string,
    stockRecherche: string,
    prixMinRecherche: string,
    prixMaxRecherche: string,
    varieteRecherche: string,
    especeRecherche: string
  ): Produit[] {
    const recherche = rechercheTexte.toLowerCase().trim();

    return produits.filter(produit => {
      const correspondRecherche =
        recherche === '' ||
        produit.intitule.toLowerCase().includes(recherche) ||
        produit.variete.nom.toLowerCase().includes(recherche) ||
        produit.variete.espece.nom_commun.toLowerCase().includes(recherche) ||
        produit.variete.espece.nom_scientifique.toLowerCase().includes(recherche);

      const correspondStock =
        stockRecherche === '' ||
        stockRecherche === 'en-stock' && produit.quantite > 0 ||
        stockRecherche === 'rupture' && produit.quantite === 0;

      const prixMin = prixMinRecherche === '' ? null : Number(prixMinRecherche);
      const prixMax = prixMaxRecherche === '' ? null : Number(prixMaxRecherche);

      const correspondPrixMin = prixMin === null || produit.prix_unitaire >= prixMin;
      const correspondPrixMax = prixMax === null || produit.prix_unitaire <= prixMax;

      const correspondVariete = varieteRecherche === '' || produit.variete.nom === varieteRecherche;

      const correspondEspece = especeRecherche === '' || produit.variete.espece.nom_commun === especeRecherche;

      return correspondRecherche  && correspondStock  && correspondPrixMin && correspondPrixMax
        && correspondVariete && correspondEspece;
    });
  }

  getStatutProduit(produit: Produit | null): string {
    if (produit?.quantite && produit.quantite > 0) {
      return 'En stock';
    }

    return 'Rupture de stock';
  }

  getLabelBio(produit: Produit | null): string {
    if (produit?.variete?.bio === 1) {
      return 'Oui';
    }

    return 'Non';
  }

  getImageProduit(produit: Produit | null): string | null {
    return produit?.image_produit ?? null;
  }

  construireProduitCreateInput(valeurFormulaire: {
    intitule: string | null;
    prix_unitaire: number | null;
    quantite: number | null;
    categorie_id: number | null;
    variete_id: number | null;
  }): ProduitCreateInput {
    return {
      intitule: valeurFormulaire.intitule?.trim() ?? '',
      prix_unitaire: Number(valeurFormulaire.prix_unitaire),
      quantite: Number(valeurFormulaire.quantite),
      categorie_id: Number(valeurFormulaire.categorie_id),
      variete_id: Number(valeurFormulaire.variete_id),
    };
  }

  construireProduitUpdateInput(
    idProduit: number,
    valeurFormulaire: {
      intitule: string | null;
      prix_unitaire: number | null;
      quantite: number | null;
      categorie_id: number | null;
      variete_id: number | null;
    }
  ): ProduitUpdateInput {
    return {
      id_produit: idProduit,
      intitule: valeurFormulaire.intitule?.trim() ?? '',
      prix_unitaire: Number(valeurFormulaire.prix_unitaire),
      quantite: Number(valeurFormulaire.quantite),
      categorie_id: Number(valeurFormulaire.categorie_id),
      variete_id: Number(valeurFormulaire.variete_id),
    };
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création du produit.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification du produit.';
  }

  getMessageErreurSuppression(): string {
    return 'Une erreur est survenue pendant la suppression du produit.';
  }

}