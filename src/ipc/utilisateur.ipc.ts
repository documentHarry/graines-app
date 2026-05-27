import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { hacherMotDePasse } from '../security/password-utils';
import { UtilisateurRepository } from '../repository/utilisateur.repository';
import { UtilisateurCreateInput, UtilisateurUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerUtilisateurIpc(utilisateurRepository: UtilisateurRepository): void {
  ipcMain.handle('utilisateurs:get-all', async () => {
    return utilisateurRepository.getAll();
  });

  ipcMain.handle('utilisateurs:get-by-id', async (_event,
    id: number) => {
      return utilisateurRepository.getById(id);
    }
  );

  ipcMain.handle('utilisateurs:create', async (_event,
    utilisateur: UtilisateurCreateInput) => {
      try {
        const doublon = await utilisateurRepository.getByEmail(utilisateur.email);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_USER_EMAIL);
        }

        const motDePasse = hacherMotDePasse(utilisateur.mot_de_passe);
        return utilisateurRepository.create(utilisateur, motDePasse);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_USER_EMAIL], TECHNIQUES.USER_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('utilisateurs:update', async (_event,
    utilisateur: UtilisateurUpdateInput) => {
      try {
        const doublon = await utilisateurRepository.getDoublonUpdate(utilisateur);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_USER_EMAIL);
        }

        return utilisateurRepository.update(utilisateur);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_USER_EMAIL], TECHNIQUES.USER_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('utilisateurs:delete', async (_event,
    id: number) => {
      try {
        return utilisateurRepository.delete(id);
      } catch (error) {
        throw new Error(TECHNIQUES.USER_DELETE_ERROR);
      }
    }
  );
}