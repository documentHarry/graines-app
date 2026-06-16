import { Injectable, inject } from '@angular/core';
import { Role, UtilisateurRole, UtilisateurRoleUpdateInput, Utilisateur } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class UtilisateurRoleService  {
  private readonly electronService = inject(ElectronService);

  getUtilisateurRoles(idUtilisateur: number): Promise<UtilisateurRole[]> {
    return this.electronService.getApi().getUtilisateurRoles(idUtilisateur);
  }

  updateUtilisateurRoles(donnees: UtilisateurRoleUpdateInput): Promise<Utilisateur> {
    return this.electronService.getApi().updateUtilisateurRoles(donnees);
  }

  getNomComplet(utilisateur: Utilisateur | null): string {
    if (!utilisateur) {
      return '';
    }

    return `${utilisateur.prenom} ${utilisateur.nom}`;
  }

  getRoleIdsDepuisUtilisateurRoles(utilisateurRoles: UtilisateurRole[]): number[] {
    return utilisateurRoles.map(utilisateurRole => utilisateurRole.role_id);
  }

  isRoleCoche(role: Role, rolesIds: number[]): boolean {
    return rolesIds.includes(role.id_role);
  }

  ajouterRoleId(rolesIds: number[], role: Role): number[] {
    if (rolesIds.includes(role.id_role)) {
      return rolesIds;
    }

    return [...rolesIds, role.id_role];
  }

  retirerRoleId(rolesIds: number[], role: Role): number[] {
    return rolesIds.filter(roleId => roleId !== role.id_role);
  }

  construireUtilisateurRoleUpdateInput(utilisateurId: number, rolesIds: number[]): UtilisateurRoleUpdateInput {
    return {
      utilisateur_id: utilisateurId,
      roles_ids: rolesIds,
    };
  }

  getMessageErreurAucunRole(): string {
    return 'Un utilisateur doit avoir au moins un rôle.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur technique est survenue pendant la modification des rôles.';
  }
}