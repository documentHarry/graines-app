import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Produit } from '../../../types/electron';
import { ProduitService } from '../../../services/produit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterLink],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.css',
})

export class ProduitDetailComponent {

  private readonly produitService = inject(ProduitService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  id = input<string>();

  produit = signal<Produit | null>(null);
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

    const idProduit = Number(this.id());

    if (!idProduit) {
      this.message.set('Identifiant du produit invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const produit = await this.produitService.getProduitById(idProduit);

      if (!produit) {
        this.message.set('Produit introuvable.');
        return;
      }

      this.produit.set(produit);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement produit', { error, idProduit });
      this.message.set('Erreur pendant le chargement du produit.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getLabelBio(): string {
    return this.produitService.getLabelBio(this.produit());
  }

  getImageProduit(): string | null {
    return this.produitService.getImageProduit(this.produit());
  }

  getStatutProduit(): string {
    return this.produitService.getStatutProduit(this.produit());
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
      console.error('Erreur suppression produit', { error, produit });
      this.message.set(this.produitService.getMessageErreurSuppression());
    }
  }

}