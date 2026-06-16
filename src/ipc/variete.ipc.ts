import { ipcMain } from 'electron';
import { METIER } from '../errors/prisma-errors';
import { VarieteRepository } from '../repository/variete.repository';
import { VarieteCreateInput, VarieteUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerVarieteIpc(varieteRepository: VarieteRepository): void {
  ipcMain.handle('varietes:get-all', async () => {
    return varieteRepository.getAll();
  });

  ipcMain.handle('varietes:get-by-id', async (_event, id: number) => {
    return varieteRepository.getById(id);
  });

  ipcMain.handle('varietes:create', async (_event, variete: VarieteCreateInput) => {
    return varieteRepository.create(variete);
  });

  ipcMain.handle('varietes:update', async (_event, variete: VarieteUpdateInput) => {
    return varieteRepository.update(variete);
  });

  ipcMain.handle('varietes:delete', async (_event, id: number) => {
    const nombreProduits = await varieteRepository.countProduits(id);

    if (nombreProduits > 0) {
      throw new Error(METIER.VARIETE_HAS_PRODUCTS);
    }

    return varieteRepository.delete(id);
  });
}