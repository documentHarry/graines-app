import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { AvisRepository } from '../repository/avis.repository';
import { AvisCreateInput, AvisUpdateInput } from '../../renderer/app/src/app/types/electron'

export function enregistrerAvisIpc(avisRepository: AvisRepository): void {
  ipcMain.handle('avis:get-all', async () => {
    return avisRepository.getAll();
  });

  ipcMain.handle('avis:get-by-id', async (_event,
    id: number) => {
      return avisRepository.getById(id);
    }
  );

  ipcMain.handle('avis:get-by-produit', async (_event,
    produitId: number) => {
      return avisRepository.getByProduit(produitId);
    }
  );

  ipcMain.handle('avis:create', async (_event,
    avis: AvisCreateInput) => {
      try {
        const doublon = await avisRepository.existeAvisUtilisateurProduit(
          avis.utilisateur_id,
          avis.produit_id
        );

        if (doublon) {
          throw new Error(METIER.DUPLICATE_AVIS);
        }

        return avisRepository.create(avis);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_AVIS], TECHNIQUES.AVIS_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('avis:update', async (_event,
    avis: AvisUpdateInput) => {
      try {
        const avisExiste = await avisRepository.existeAvisActif(avis.id_avis);

        if (!avisExiste) {
          throw new Error(METIER.AVIS_NOT_FOUND);
        }

        return avisRepository.update(avis);
      } catch (error) {
        gererErreurPrisma(error, [METIER.AVIS_NOT_FOUND], TECHNIQUES.AVIS_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('avis:delete', async (_event,
    id: number) => {
      try {
        const avisExiste = await avisRepository.existeAvisActif(id);

        if (!avisExiste) {
          throw new Error(METIER.AVIS_NOT_FOUND);
        }

        return avisRepository.delete(id);
      } catch (error) {
        gererErreurPrisma(error, [METIER.AVIS_NOT_FOUND], TECHNIQUES.AVIS_DELETE_ERROR);
      }
    }
  );

  ipcMain.handle('avis:like', async (_event,
    id: number) => {
      try {
        const avisExiste = await avisRepository.existeAvisActif(id);

        if (!avisExiste) {
          throw new Error(METIER.AVIS_NOT_FOUND);
        }

        return avisRepository.like(id);
      } catch (error) {
        gererErreurPrisma(error, [METIER.AVIS_NOT_FOUND], TECHNIQUES.AVIS_LIKE_ERROR);
      }
    }
  );
}