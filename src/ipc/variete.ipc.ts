import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { AromateRepository } from '../repository/aromate.repository';
import { VarieteRepository } from '../repository/variete.repository';
import { VarieteCreateInput, VarieteUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerVarieteIpc(varieteRepository: VarieteRepository, aromateRepository: AromateRepository): void {
  ipcMain.handle('varietes:get-all', async () => {
      return varieteRepository.getAll();
    }
  );

  ipcMain.handle('varietes:get-by-id', async (_event,
    id: number) => {
      return varieteRepository.getById(id);
    }
  );

  ipcMain.handle('varietes:create', async (_event,
    variete: VarieteCreateInput) => {
      try {
        return varieteRepository.transaction(async (transact) => {
          const doublon = await varieteRepository.getDoublonCreate(transact, variete);

          if (doublon) {
            throw new Error(METIER.DUPLICATE_VARIETE);
          }

          const nouvelleVariete = await varieteRepository.create(transact, variete);

          if (variete.aromate) {
            const nouvelAromate = await aromateRepository.create(
              transact, nouvelleVariete.id_variete, variete.aromate
            );

            await aromateRepository.createProprietes(
              transact, nouvelAromate.id_aromate, variete.aromate.proprietes_ids
            );
          }

          return varieteRepository.getByIdTransaction(transact, nouvelleVariete.id_variete);
        });
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_VARIETE], TECHNIQUES.VARIETE_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('varietes:update', async (_event,
    variete: VarieteUpdateInput) => {
      try {
        return varieteRepository.transaction(async (transact) => {
          const doublon = await varieteRepository.getDoublonUpdate(transact, variete);

          if (doublon) {
            throw new Error(METIER.DUPLICATE_VARIETE);
          }

          await varieteRepository.update(transact, variete);
          await aromateRepository.deleteProprietesByVariete(transact, variete.id_variete);
          await aromateRepository.deleteByVariete(transact, variete.id_variete);

          if (variete.aromate) {
            const nouvelAromate = await aromateRepository.create(
                transact, variete.id_variete, variete.aromate
            );

            await aromateRepository.createProprietes(
              transact, nouvelAromate.id_aromate, variete.aromate.proprietes_ids
            );
          }

          return varieteRepository.getByIdTransaction(transact, variete.id_variete);
        });
      } catch (error) {
        gererErreurPrisma( error, [METIER.DUPLICATE_VARIETE], TECHNIQUES.VARIETE_UPDATE_ERROR );
      }
    }
  );

  ipcMain.handle('varietes:delete', async (_event,
    id: number) => {
      try {
        const nombreProduits = await varieteRepository.countProduits(id);

        if (nombreProduits > 0) {
          throw new Error(METIER.VARIETE_HAS_PRODUCTS);
        }

        return varieteRepository.delete(id);
      } catch (error) {
        gererErreurPrisma( error, [METIER.VARIETE_HAS_PRODUCTS], TECHNIQUES.VARIETE_DELETE_ERROR);
      }
    }
  );
}