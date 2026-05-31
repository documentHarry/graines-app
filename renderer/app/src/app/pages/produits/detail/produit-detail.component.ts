import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Produit } from '../../../types/electron';
import { ProduitService } from '../../../services/produit.service';
import { ProduitAvisComponent } from '../avis/produit-avis.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterLink, ProduitAvisComponent],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.css',
})
export class ProduitDetailComponent {

  private readonly produitService = inject(ProduitService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  id = input<string>();

  produit = signal<Produit | null>(null);
  produitsSimilaires = signal<Produit[]>([]);
  isLoading = signal(true);
  message = signal('');

  constructor() {
    effect(() => {
      const idProduit = this.id();

      if (idProduit) {
        void this.chargerProduit();
      }
    });
  }

  async chargerProduit(): Promise<void> {
    this.isLoading.set(true);
    this.message.set('');
    this.produitsSimilaires.set([]);

    const idProduit = Number(this.id());

    if (!idProduit) {
      this.message.set('Identifiant du produit invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const result = await this.produitService.getProduitById(idProduit);

      if (!result) {
        this.message.set('Produit introuvable.');
        return;
      }

      const produitsSimilaires = await this.produitService.getProduitsSimilaires(idProduit);

      this.produit.set(result);
      this.produitsSimilaires.set(produitsSimilaires);
      this.message.set('');
    }
    catch(error) {
      console.error(error);
      this.message.set('Erreur pendant le chargement du produit.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getLabelBio(): string {
    if (this.produit()?.variete?.bio === 1) {
      return 'Oui';
    }

    return 'Non';
  }

  getImageProduit(): string | null {
    return this.produit()?.image_produit ?? null;
  }

  getStatutProduit(): string {
    if (this.produit()?.quantite && this.produit()!.quantite > 0) {
      return 'En stock';
    }

    return 'Rupture de stock';
  }

  getConseilsPlantation(): string[] {
    const conseil = this.produit()?.variete?.conseil_plantation;

    if (!conseil) {
      return [];
    }

    return conseil.split('.').map(phrase => phrase.trim())
      .filter(phrase => phrase.length > 0)
      .map(phrase => phrase + '.');
  }

  async supprimerProduit(): Promise<void> {
    const produit = this.produit();

    if (!produit) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer ce produit ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.produitService.deleteProduit(produit.id_produit);
      await this.router.navigate(['/produits']);
    }
    catch (error) {
      console.error(error);
      this.message.set('Une erreur est survenue pendant la suppression du produit.');
    }
  }

}