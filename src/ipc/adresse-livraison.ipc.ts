import { ipcMain } from 'electron';
import { TECHNIQUES } from '../errors/prisma-errors';
import { AdresseLivraisonRepository } from '../repository/adresse-livraison.repository';
import { AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerAdresseLivraisonIpc(adresseLivraisonRepository: AdresseLivraisonRepository): void {
  ipcMain.handle('adresses-livraison:create', async (_event,
    adresse: AdresseLivraisonCreateInput) => {
      try {
        return adresseLivraisonRepository.create(adresse);
      } catch (error) {
        throw new Error(TECHNIQUES.ADRESSE_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('adresses-livraison:update', async (_event,
    adresse: AdresseLivraisonUpdateInput) => {
      try {
        return adresseLivraisonRepository.update(adresse);
      } catch (error) {
        throw new Error(TECHNIQUES.ADRESSE_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('adresses-livraison:delete', async (_event,
    id: number) => {
      try {
        return adresseLivraisonRepository.delete(id);
      } catch (error) {
        throw new Error(TECHNIQUES.ADRESSE_DELETE_ERROR);
      }
    }
  );
}