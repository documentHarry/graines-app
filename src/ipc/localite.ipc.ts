import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { LocaliteRepository } from '../repository/localite.repository';
import { LocaliteCreateInput, LocaliteUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerLocaliteIpc(localiteRepository: LocaliteRepository): void {
  ipcMain.handle('localites:get-all', async () => {
    return localiteRepository.getAll();
  });

  ipcMain.handle('localites:create', async (_event,
    localite: LocaliteCreateInput) => {
      try {
        const doublon = await localiteRepository.getDoublonCreate(localite);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_LOCALITE);
        }

        return localiteRepository.create(localite);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_LOCALITE], TECHNIQUES.LOCALITE_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('localites:update', async (_event,
    localite: LocaliteUpdateInput) => {
      try {
        const doublon = await localiteRepository.getDoublonUpdate(localite);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_LOCALITE);
        }

        return localiteRepository.update(localite);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_LOCALITE], TECHNIQUES.LOCALITE_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('localites:delete', async (_event,
    id: number) => {
      try {
        const nombreAdresses = await localiteRepository.countAdresses(id);

        if (nombreAdresses > 0) {
          throw new Error(METIER.LOCALITE_HAS_ADRESSES);
        }

        return localiteRepository.delete(id);
      } catch (error) {
        gererErreurPrisma(error, [METIER.LOCALITE_HAS_ADRESSES], TECHNIQUES.LOCALITE_DELETE_ERROR);
      }
    }
  );
}