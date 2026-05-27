import { Injectable, inject } from '@angular/core';
import { ProprieteMedicinale } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class ProprieteMedicinaleService {
  private readonly electronService = inject(ElectronService);

  getProprietesMedicinales(): Promise<ProprieteMedicinale[]> {
    return this.electronService.getApi().getProprietesMedicinales();
  }
}