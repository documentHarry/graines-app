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

  createProduit(produit: ProduitCreateInput): Promise<Produit> {
    return this.electronService.getApi().createProduit(produit);
  }

  updateProduit(produit: ProduitUpdateInput): Promise<Produit> {
    return this.electronService.getApi().updateProduit(produit);
  }

  deleteProduit(id: number): Promise<Produit> {
    return this.electronService.getApi().deleteProduit(id);
  }

}