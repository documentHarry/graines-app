import { Injectable, inject } from '@angular/core';
import { Avis, AvisCreateInput, AvisUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class AvisService {
  private readonly electronService = inject(ElectronService);

  getAvis(): Promise<Avis[]> {
    return this.electronService.getApi().getAvis();
  }

  getAvisById(id: number): Promise<Avis | null> {
    return this.electronService.getApi().getAvisById(id);
  }

  getAvisByProduit(produitId: number): Promise<Avis[]> {
    return this.electronService.getApi().getAvisByProduit(produitId);
  }

  createAvis(avis: AvisCreateInput): Promise<Avis> {
    return this.electronService.getApi().createAvis(avis);
  }

  updateAvis(avis: AvisUpdateInput): Promise<Avis> {
    return this.electronService.getApi().updateAvis(avis);
  }

  deleteAvis(id: number): Promise<Avis> {
    return this.electronService.getApi().deleteAvis(id);
  }

  likeAvis(id: number): Promise<Avis> {
    return this.electronService.getApi().likeAvis(id);
  }
}