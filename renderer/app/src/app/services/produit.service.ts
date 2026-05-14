import { Injectable, inject } from '@angular/core';
import { Produit } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})

export class ProduitService {
  private readonly electronService = inject(ElectronService);

  getProduits(): Promise<Produit[]> {
    return this.electronService.getApi().getProduits();
  }

  getProduitById(id: number): Promise<Produit | null> {
    return this.electronService.getApi().getProduitById(id);
  }
}