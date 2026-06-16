import { ipcMain } from 'electron';
import { UtilisateurRoleRepository } from '../repository/utilisateur-role.repository';

export function enregistrerUtilisateurRoleIpc(utilisateurRoleRepository: UtilisateurRoleRepository): void {
  ipcMain.handle('utilisateur-roles:get-by-utilisateur', async (_event, idUtilisateur: number) => {
      return utilisateurRoleRepository.getByUtilisateur(idUtilisateur);
    }
  );

  ipcMain.handle('utilisateur-roles:update', async (_event, donnees: {
      utilisateur_id: number;
      roles_ids: number[];
    }) => {
      return utilisateurRoleRepository.updateRolesUtilisateur(
        donnees.utilisateur_id,
        donnees.roles_ids
      );
    }
  );
}