import { Injectable, inject } from '@angular/core';
import { ProprieteMedicinale, ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class ProprieteMedicinaleService {
  private readonly electronService = inject(ElectronService);

  getProprietesMedicinales(): Promise<ProprieteMedicinale[]> {
    return this.electronService.getApi().getProprietesMedicinales();
  }

  createProprieteMedicinale(propriete: ProprieteMedicinaleCreateInput): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().createProprieteMedicinale(propriete);
  }

  updateProprieteMedicinale(propriete: ProprieteMedicinaleUpdateInput): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().updateProprieteMedicinale(propriete);
  }

  deleteProprieteMedicinale(id: number): Promise<ProprieteMedicinale> {
    return this.electronService.getApi().deleteProprieteMedicinale(id);
  }

}