import { Injectable, inject } from '@angular/core';
import { Variete, VarieteCreateInput, VarieteUpdateInput  } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class VarieteService {
  private readonly electronService = inject(ElectronService);

  getVarietes(): Promise<Variete[]> {
    return this.electronService.getApi().getVarietes();
  }

  getVarieteById(id: number): Promise<Variete | null> {
    return this.electronService.getApi().getVarieteById(id);
  }

  createVariete(variete: VarieteCreateInput): Promise<Variete> {
    return this.electronService.getApi().createVariete(variete);
  }

  updateVariete(variete: VarieteUpdateInput): Promise<Variete> {
    return this.electronService.getApi().updateVariete(variete);
  }

  deleteVariete(id: number): Promise<Variete> {
    return this.electronService.getApi().deleteVariete(id);
  }

}