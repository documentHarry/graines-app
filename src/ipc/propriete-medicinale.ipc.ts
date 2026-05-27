import { ipcMain } from 'electron';
import { ProprieteMedicinaleRepository } from '../repository/propriete-medicinale.repository';

export function enregistrerProprieteMedicinaleIpc(proprieteMedicinaleRepository: ProprieteMedicinaleRepository): void {
  ipcMain.handle('proprietes-medicinales:get-all', async () => {
      return proprieteMedicinaleRepository.getAll();
    }
  );
}