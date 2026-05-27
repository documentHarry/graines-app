import { Injectable, inject } from '@angular/core';
import { Utilisateur, UtilisateurCreateInput, UtilisateurUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class UtilisateurService {
  private readonly electronService = inject(ElectronService);

  getUtilisateurs(): Promise<Utilisateur[]> {
    return this.electronService.getApi().getUtilisateurs();
  }

  getUtilisateurById(id: number): Promise<Utilisateur | null> {
    return this.electronService.getApi().getUtilisateurById(id);
  }

  createUtilisateur(utilisateur: UtilisateurCreateInput): Promise<Utilisateur> {
    return this.electronService.getApi().createUtilisateur(utilisateur);
  }

  updateUtilisateur(utilisateur: UtilisateurUpdateInput): Promise<Utilisateur> {
    return this.electronService.getApi().updateUtilisateur(utilisateur);
  }

  deleteUtilisateur(id: number): Promise<Utilisateur> {
    return this.electronService.getApi().deleteUtilisateur(id);
  }

}