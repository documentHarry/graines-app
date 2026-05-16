import { Injectable, inject } from '@angular/core';
import { Variete } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class VarieteService {
  private readonly electronService = inject(ElectronService);

  getVarietes(): Promise<Variete[]> {
    return this.electronService.getApi().getVarietes();
  }
}