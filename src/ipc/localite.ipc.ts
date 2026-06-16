import { ipcMain } from 'electron';
import { METIER } from '../errors/prisma-errors';
import { LocaliteRepository } from '../repository/localite.repository';
import { LocaliteCreateInput, LocaliteUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerLocaliteIpc(localiteRepository: LocaliteRepository): void {
  ipcMain.handle('localites:get-all', async () => {
    return localiteRepository.getAll();
  });

  ipcMain.handle('localites:create', async (_event, localite: LocaliteCreateInput) => {
    return localiteRepository.create(localite);
  });

  ipcMain.handle('localites:update', async (_event, localite: LocaliteUpdateInput) => {
    return localiteRepository.update(localite);
  });

  ipcMain.handle('localites:delete', async (_event, id: number) => {
    const nombreAdresses = await localiteRepository.countAdresses(id);

    if (nombreAdresses > 0) {
      throw new Error(METIER.LOCALITE_HAS_ADRESSES);
    }

    return localiteRepository.delete(id);
  });
}