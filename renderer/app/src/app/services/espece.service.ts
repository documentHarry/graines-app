import { Injectable, inject } from '@angular/core';
import { Espece, EspeceCreateInput, EspeceUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class EspeceService {
  private readonly electronService = inject(ElectronService);

  getEspeces(): Promise<Espece[]> {
    return this.electronService.getApi().getEspeces();
  }

  getEspeceById(id: number): Promise<Espece | null> {
    return this.electronService
      .getApi()
      .getEspeceById(id);
  }

  createEspece(espece: EspeceCreateInput): Promise<Espece> {
    return this.electronService.getApi().createEspece(espece);
  }

  updateEspece(espece: EspeceUpdateInput): Promise<Espece> {
    return this.electronService.getApi().updateEspece(espece);
  }

  deleteEspece(id: number): Promise<Espece> {
    return this.electronService.getApi().deleteEspece(id);
  }

}