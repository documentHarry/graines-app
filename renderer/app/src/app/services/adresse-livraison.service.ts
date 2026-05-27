import { Injectable, inject } from '@angular/core';
import {
  AdresseLivraison,
  AdresseLivraisonCreateInput,
  AdresseLivraisonUpdateInput
} from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class AdresseLivraisonService {
  private readonly electronService = inject(ElectronService);

  createAdresseLivraison(adresse: AdresseLivraisonCreateInput): Promise<AdresseLivraison> {
    return this.electronService.getApi().createAdresseLivraison(adresse);
  }

  updateAdresseLivraison(adresse: AdresseLivraisonUpdateInput): Promise<AdresseLivraison> {
    return this.electronService.getApi().updateAdresseLivraison(adresse);
  }

  deleteAdresseLivraison(id: number): Promise<AdresseLivraison> {
    return this.electronService.getApi().deleteAdresseLivraison(id);
  }

}