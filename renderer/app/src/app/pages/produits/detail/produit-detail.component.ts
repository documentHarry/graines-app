import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Produit } from '../../../types/electron';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterLink],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.css',
})
export class ProduitDetailComponent {

  private readonly produitService = inject(ProduitService);
  private readonly router = inject(Router);
  id = input<string>();

  produit = signal<Produit | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerProduit();
  }

  async chargerProduit(): Promise<void> {
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
      }

      this.produit.set(result);
    }
    catch {
      this.message.set('Erreur pendant le chargement du produit.');
    }
    finally {
      this.isLoading.set(false);
    }
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