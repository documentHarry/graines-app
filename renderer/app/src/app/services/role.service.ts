import { Injectable, inject } from '@angular/core';
import { Role, UtilisateurRole, UtilisateurRoleUpdateInput, Utilisateur } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })

export class RoleService {
  private readonly electronService = inject(ElectronService);

  getRoles(): Promise<Role[]> {
    return this.electronService.getApi().getRoles();
  }

  getUtilisateurRoles(idUtilisateur: number): Promise<UtilisateurRole[]> {
    return this.electronService.getApi().getUtilisateurRoles(idUtilisateur);
  }

  updateUtilisateurRoles(donnees: UtilisateurRoleUpdateInput): Promise<Utilisateur> {
    return this.electronService.getApi().updateUtilisateurRoles(donnees);
  }
}