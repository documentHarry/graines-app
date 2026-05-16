import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produit } from '../../types/electron';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-produits',
  imports: [RouterLink],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css',
})

export class ProduitsComponent {
  private readonly produitService = inject(ProduitService);

  produits = signal<Produit[]>([]);
  isLoading = signal(true);
  message = signal('');

  constructor() {
    this.chargerProduits();
  }

  async chargerProduits(): Promise<void> {
    try {
      const result = await this.produitService.getProduits();

      this.produits.set(result);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des produits.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getStatutProduit(produit: Produit): string {
    if (produit.quantite > 0) {
      return 'En stock';
    }

    return 'Rupture de stock';
  }
}