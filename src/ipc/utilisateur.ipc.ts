import { ipcMain } from 'electron';
import { hacherMotDePasse } from '../security/password-utils';
import { UtilisateurRepository } from '../repository/utilisateur.repository';
import { UtilisateurCreateInput, UtilisateurUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerUtilisateurIpc(utilisateurRepository: UtilisateurRepository): void {
  ipcMain.handle('utilisateurs:get-all', async () => {
    return utilisateurRepository.getAll();
  });

  ipcMain.handle('utilisateurs:get-by-id', async (_event, id: number) => {
    return utilisateurRepository.getById(id);
  });

  ipcMain.handle('utilisateurs:create', async (_event, utilisateur: UtilisateurCreateInput) => {
    const motDePasse = hacherMotDePasse(utilisateur.mot_de_passe);
    return utilisateurRepository.create(utilisateur, motDePasse);
  });

  ipcMain.handle('utilisateurs:update', async (_event, utilisateur: UtilisateurUpdateInput) => {
    return utilisateurRepository.update(utilisateur);
  });

  ipcMain.handle('utilisateurs:delete', async (_event, id: number) => {
    return utilisateurRepository.delete(id);
  });
}