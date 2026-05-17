import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categorie, Produit } from '../../types/electron';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-produits',
  imports: [RouterLink],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css',
})

export class ProduitsComponent {
  private readonly produitService = inject(ProduitService);
  private readonly categorieService = inject(CategorieService);

  categorieId = input<string>();

  produits = signal<Produit[]>([]);
  categorie = signal<Categorie | null>(null);
  isLoading = signal(true);
  message = signal('');

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
}