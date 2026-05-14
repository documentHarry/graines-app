import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produit } from '../../types/electron';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterLink],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.css',
})
export class ProduitDetailComponent {
  private readonly produitService = inject(ProduitService);

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
    if (this.produit()?.actif === 1) {
      return 'Actif';
    }

    return 'Inactif';
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
}