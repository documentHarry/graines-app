import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { EspeceRepository } from '../repository/espece.repository';
import { EspeceCreateInput, EspeceUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerEspeceIpc(especeRepository: EspeceRepository): void {
  ipcMain.handle('especes:get-all', async () => {
      return especeRepository.getAll();
    }
  );

  ipcMain.handle('especes:get-by-id', async (_event,
    id: number) => {
      return especeRepository.getById(id);
    }
  );

  ipcMain.handle('especes:create', async (_event,
    espece: EspeceCreateInput) => {
      try {
        const doublon = await especeRepository.getDoublonCreate(espece);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_ESPECE);
        }

        return especeRepository.create(espece);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_ESPECE], TECHNIQUES.ESPECE_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('especes:update', async (_event,
    espece: EspeceUpdateInput) => {
      try {
        const doublon = await especeRepository.getDoublonUpdate(espece);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_ESPECE);
        }

        return especeRepository.update(espece);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_ESPECE], TECHNIQUES.ESPECE_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('especes:delete', async (_event,
    id: number) => {
      try {
        const nombreVarietes = await especeRepository.countVarietes(id);

        if (nombreVarietes > 0) {
          throw new Error(METIER.ESPECE_HAS_VARIETES);
        }

        return especeRepository.delete(id);
      } catch (error) {
        gererErreurPrisma(error, [METIER.ESPECE_HAS_VARIETES], TECHNIQUES.ESPECE_DELETE_ERROR);
      }
    }
  );
}