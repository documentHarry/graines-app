import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categorie, Produit } from '../../types/electron';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';
import { ProduitFiltresComponent } from './produit-filtres/produit-filtres.component';

@Component({
  selector: 'app-produits',
  imports: [RouterLink, ProduitFiltresComponent],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css',
})

export class ProduitsComponent {
  private readonly produitService = inject(ProduitService);
  private readonly categorieService = inject(CategorieService);
  readonly authService = inject(AuthService);
  
  categorieId = input<string>();

  produits = signal<Produit[]>([]);
  categorie = signal<Categorie | null>(null);
  isLoading = signal(true);
  message = signal('');
  recherche = signal('');
  categorieRecherche = signal('');
  varieteRecherche = signal('');
  especeRecherche = signal('');
  stockRecherche = signal('');
  aromateRecherche = signal('');
  prixMinRecherche = signal('');
  prixMaxRecherche = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerProduits();
  }

  async chargerProduits(): Promise<void> {
    try {
      const idCategorie = Number(this.categorieId());

      if (idCategorie) {
        const categorie = await this.categorieService.getCategorieById(idCategorie);
        const produits = await this.produitService.getProduitsByCategorie(idCategorie);

        this.categorie.set(categorie);
        this.produits.set(produits);
      }
      else {
        const produits = await this.produitService.getProduits();

        this.categorie.set(null);
        this.produits.set(produits);
      }

      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des produits.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getTitrePage(): string {
    if (this.categorie()) {
      return `Produits - ${this.categorie()?.nom_categorie}`;
    }

    return 'Produits';
  }

  getStatutProduit(produit: Produit): string {
    if (produit.quantite > 0) {
      return 'En stock';
    }

    return 'Rupture de stock';
  }

  categoriesDisponibles = computed(() => {
    const categories = this.produits().map(produit => produit.categorie.nom_categorie);

    return [...new Set(categories)].sort();
  });

  varietesDisponibles = computed(() => {
    const varietes = this.produits().map(produit => produit.variete.nom);

    return [...new Set(varietes)].sort();
  });

  especesDisponibles = computed(() => {
    const especes = this.produits().map(produit => produit.variete.espece.nom_commun);

    return [...new Set(especes)].sort();
  });

  prixMinimumDisponible = computed(() => {
    const prix = this.produits().map(produit => produit.prix_unitaire);

    if (prix.length === 0) {
      return 0;
    }

    return Math.min(...prix);
  });

  prixMaximumDisponible = computed(() => {
    const prix = this.produits().map(produit => produit.prix_unitaire);

    if (prix.length === 0) {
      return 0;
    }

    return Math.max(...prix);
  });

  produitsFiltres = computed(() => {
    const recherche = this.recherche().toLowerCase().trim();
    const stockRecherche = this.stockRecherche();
    const aromateRecherche = this.aromateRecherche();
    const prixMinRecherche = this.prixMinRecherche();
    const prixMaxRecherche = this.prixMaxRecherche();
    const categorieRecherche = this.categorieRecherche();
    const varieteRecherche = this.varieteRecherche();
    const especeRecherche = this.especeRecherche();

    return this.produits().filter(produit => {
      const correspondRecherche =
        recherche === '' ||
        produit.intitule.toLowerCase().includes(recherche) ||
        produit.categorie.nom_categorie.toLowerCase().includes(recherche) ||
        produit.variete.nom.toLowerCase().includes(recherche) ||
        produit.variete.espece.nom_commun.toLowerCase().includes(recherche) ||
        produit.variete.espece.nom_scientifique.toLowerCase().includes(recherche);

      const correspondStock =
        stockRecherche === '' ||
        stockRecherche === 'en-stock' && produit.quantite > 0 ||
        stockRecherche === 'rupture' && produit.quantite === 0;

      const nombreAromates = produit.variete.aromate?.length ?? 0;

      const correspondAromate =
        aromateRecherche === '' ||
        aromateRecherche === 'oui' && nombreAromates > 0 ||
        aromateRecherche === 'non' && nombreAromates === 0;

      const prixMin = prixMinRecherche === '' ? null : Number(prixMinRecherche);
      const prixMax = prixMaxRecherche === '' ? null : Number(prixMaxRecherche);

      const correspondPrixMin = prixMin === null || produit.prix_unitaire >= prixMin;
      const correspondPrixMax = prixMax === null || produit.prix_unitaire <= prixMax;

      const correspondCategorie = categorieRecherche === '' || produit.categorie.nom_categorie === categorieRecherche;
      const correspondVariete = varieteRecherche === '' || produit.variete.nom === varieteRecherche;
      const correspondEspece = especeRecherche === '' || produit.variete.espece.nom_commun === especeRecherche;

      return  correspondRecherche && correspondStock && correspondAromate && correspondPrixMin &&
              correspondPrixMax && correspondCategorie && correspondVariete && correspondEspece;
    });
  });

}