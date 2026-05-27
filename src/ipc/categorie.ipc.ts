import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { CategorieRepository } from '../repository/categorie.repository';
import { CategorieCreateInput, CategorieUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerCategorieIpc(categorieRepository: CategorieRepository): void {
  ipcMain.handle('categories:get-all', async () => {
      return categorieRepository.getAll();
    }
  );

  ipcMain.handle('categories:get-by-id', async (_event, id: number) => {
      return categorieRepository.getById(id);
    }
  );

  ipcMain.handle('categories:create', async (_event,
    categorie: CategorieCreateInput) => {
      try {
        const doublon = await categorieRepository.getByNom(categorie.nom_categorie);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_CATEGORY);
        }

        return categorieRepository.create(categorie);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_CATEGORY], TECHNIQUES.CATEGORY_CREATE_ERROR);
      }
    }
  );

  ipcMain.handle('categories:update', async (_event,
    categorie: CategorieUpdateInput) => {
      try {
        const doublon = await categorieRepository.getDoublonUpdate(categorie);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_CATEGORY);
        }

        return categorieRepository.update(categorie);
      } catch (error) {
        gererErreurPrisma(error, [METIER.DUPLICATE_CATEGORY], TECHNIQUES.CATEGORY_UPDATE_ERROR);
      }
    }
  );

  ipcMain.handle('categories:delete', async (_event,
    id: number) => {
      try {
        const nombreProduits = await categorieRepository.countProduits(id);

        if (nombreProduits > 0) {
          throw new Error(METIER.CATEGORY_HAS_PRODUCTS);
        }

        return categorieRepository.delete(id);
      } catch (error) {
        gererErreurPrisma(error, [METIER.CATEGORY_HAS_PRODUCTS], TECHNIQUES.CATEGORY_DELETE_ERROR);
      }
    }
  );

  ipcMain.handle('categories:delete-with-reaffectation', async (_event,
    idCategorieASupprimer: number, idCategorieDestination: number ) => {

    try {
      if (idCategorieASupprimer === idCategorieDestination) {
        throw new Error(METIER.SAME_CATEGORY);
      }

      const categorieDestination = await categorieRepository.getCategorieDestination(idCategorieDestination);

      if (!categorieDestination) {
        throw new Error(METIER.DESTINATION_CATEGORY_NOT_FOUND);
      }

      await categorieRepository.reaffecterProduits(idCategorieASupprimer, idCategorieDestination);

      return categorieRepository.delete(idCategorieASupprimer);
    } catch (error) {
      gererErreurPrisma(
        error,
        [
          METIER.SAME_CATEGORY,
          METIER.DESTINATION_CATEGORY_NOT_FOUND
        ],
        TECHNIQUES.CATEGORY_DELETE_WITH_REAFFECTATION_ERROR
      );
    }

  });
}