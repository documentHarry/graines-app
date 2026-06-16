import { ipcMain } from 'electron';
import { AdresseLivraisonRepository } from '../repository/adresse-livraison.repository';
import { AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerAdresseLivraisonIpc(adresseLivraisonRepository: AdresseLivraisonRepository): void {
  ipcMain.handle('adresses-livraison:create', async (_event, adresse: AdresseLivraisonCreateInput) => {
    return adresseLivraisonRepository.create(adresse);
  });

  ipcMain.handle('adresses-livraison:update', async (_event, adresse: AdresseLivraisonUpdateInput) => {
    return adresseLivraisonRepository.update(adresse);
  });

  ipcMain.handle('adresses-livraison:delete', async (_event, id: number) => {
    return adresseLivraisonRepository.delete(id);
  });
}