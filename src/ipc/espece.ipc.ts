import { ipcMain } from 'electron';
import { METIER } from '../errors/prisma-errors';
import { EspeceRepository } from '../repository/espece.repository';
import { EspeceCreateInput, EspeceUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerEspeceIpc(especeRepository: EspeceRepository): void {
  ipcMain.handle('especes:get-all', async () => {
    return especeRepository.getAll();
  });

  ipcMain.handle('especes:get-by-id', async (_event, id: number) => {
    return especeRepository.getById(id);
  });

  ipcMain.handle('especes:create', async (_event, espece: EspeceCreateInput) => {
    return especeRepository.create(espece);
  });

  ipcMain.handle('especes:update', async (_event, espece: EspeceUpdateInput) => {
    return especeRepository.update(espece);
  });

  ipcMain.handle('especes:delete', async (_event, id: number) => {
    const nombreVarietes = await especeRepository.countVarietes(id);

    if (nombreVarietes > 0) {
      throw new Error(METIER.ESPECE_HAS_VARIETES);
    }

    return especeRepository.delete(id);
  });
}