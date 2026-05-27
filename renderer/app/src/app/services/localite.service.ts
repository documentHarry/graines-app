import { Injectable, inject } from '@angular/core';
import { Localite, LocaliteCreateInput, LocaliteUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class LocaliteService {
  private readonly electronService = inject(ElectronService);

  getLocalites(): Promise<Localite[]> {
    return this.electronService.getApi().getLocalites();
  }

  createLocalite(localite: LocaliteCreateInput): Promise<Localite> {
    return this.electronService.getApi().createLocalite(localite);
  }

  updateLocalite(localite: LocaliteUpdateInput): Promise<Localite> {
    return this.electronService.getApi().updateLocalite(localite);
  }

  deleteLocalite(id: number): Promise<Localite> {
    return this.electronService.getApi().deleteLocalite(id);
  }

}