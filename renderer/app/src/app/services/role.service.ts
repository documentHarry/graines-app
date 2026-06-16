import { Injectable, inject } from '@angular/core';
import { Role, RoleCreateInput, RoleUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly electronService = inject(ElectronService);

  getRoles(): Promise<Role[]> {
    return this.electronService.getApi().getRoles();
  }

  createRole(role: RoleCreateInput): Promise<Role> {
    return this.electronService.getApi().createRole(role);
  }

  updateRole(role: RoleUpdateInput): Promise<Role> {
    return this.electronService.getApi().updateRole(role);
  }

  deleteRole(id: number): Promise<Role> {
    return this.electronService.getApi().deleteRole(id);
  }

  construireRoleCreateInput(valeurFormulaire: { nom_role: string | null }): RoleCreateInput {
    return {
      nom_role: valeurFormulaire.nom_role?.trim() ?? '',
    };
  }

  construireRoleUpdateInput(idRole: number, valeurFormulaire: { nom_role: string | null }): RoleUpdateInput {
    return {
      id_role: idRole,
      nom_role: valeurFormulaire.nom_role?.trim() ?? '',
    };
  }

  filtrerRoles(roles: Role[], recherche: string): Role[] {
    const rechercheNettoyee = recherche.toLowerCase().trim();

    return roles.filter(role => {
      return rechercheNettoyee === '' || role.nom_role.toLowerCase().includes(rechercheNettoyee);
    });
  }

  getMessageErreurCreationRole(): string {
    return 'Une erreur est survenue pendant la création du rôle.';
  }

  getMessageErreurModificationRole(): string {
    return 'Une erreur est survenue pendant la modification du rôle.';
  }

  getMessageErreurSuppressionRole(): string {
    return 'Une erreur est survenue pendant la suppression du rôle.';
  }
}