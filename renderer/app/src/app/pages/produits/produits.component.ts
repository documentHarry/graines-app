import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produit } from '../../types/electron';
import { ProduitService } from '../../services/produit.service';
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
  readonly authService = inject(AuthService);

  categorieId = input<string>();

  produits = signal<Produit[]>([]);
  isLoading = signal(true);
  message = signal('');

  recherche = signal('');
  varieteRecherche = signal('');
  especeRecherche = signal('');
  stockRecherche = signal('');
  prixMinRecherche = signal('');
  prixMaxRecherche = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerProduits();
  }

  async chargerProduits(): Promise<void> {
    try {
      const idCategorie = Number(this.categorieId());

      if (idCategorie) {
        const produits = await this.produitService.getProduitsByCategorie(idCategorie);
        this.produits.set(produits);
      }
      else {
        const produits = await this.produitService.getProduits();
        this.produits.set(produits);
      }

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement produits', { error, categorieId: this.categorieId() });
      this.message.set('Erreur pendant le chargement des produits.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getStatutProduit(produit: Produit): string {
    return this.produitService.getStatutProduit(produit);
  }

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
    return this.produitService.filtrerProduits(
      this.produits(),
      this.recherche(),
      this.stockRecherche(),
      this.prixMinRecherche(),
      this.prixMaxRecherche(),
      this.varieteRecherche(),
      this.especeRecherche()
    );
  });

}