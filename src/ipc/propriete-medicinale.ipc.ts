import { ipcMain } from 'electron';
import { ProprieteMedicinaleRepository } from '../repository/propriete-medicinale.repository';
import { ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerProprieteMedicinaleIpc(proprieteMedicinaleRepository: ProprieteMedicinaleRepository): void {
  ipcMain.handle('proprietes-medicinales:get-all', async () => {
    return proprieteMedicinaleRepository.getAll();
  });

  ipcMain.handle('proprietes-medicinales:create', async (_event, propriete: ProprieteMedicinaleCreateInput) => {
    return proprieteMedicinaleRepository.create(propriete);
  });

  ipcMain.handle('proprietes-medicinales:update', async (_event, propriete: ProprieteMedicinaleUpdateInput) => {
    return proprieteMedicinaleRepository.update(propriete);
  });

  ipcMain.handle('proprietes-medicinales:delete', async (_event, id: number) => {
    return proprieteMedicinaleRepository.delete(id);
  });

}