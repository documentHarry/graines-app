import { ipcMain } from 'electron';
import { METIER } from '../errors/prisma-errors';
import { CategorieRepository } from '../repository/categorie.repository';
import { CategorieCreateInput, CategorieUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerCategorieIpc(categorieRepository: CategorieRepository): void {
  ipcMain.handle('categories:get-all', async () => {
    return categorieRepository.getAll();
  });

  ipcMain.handle('categories:get-by-id', async (_event, id: number) => {
    return categorieRepository.getById(id);
  });

  ipcMain.handle('categories:create', async (_event, categorie: CategorieCreateInput) => {
    return categorieRepository.create(categorie);
  });

  ipcMain.handle('categories:update', async (_event, categorie: CategorieUpdateInput) => {
    return categorieRepository.update(categorie);
  });

  ipcMain.handle('categories:delete', async (_event, id: number) => {
    const nombreProduits = await categorieRepository.countProduits(id);

    if (nombreProduits > 0) {
      throw new Error(METIER.CATEGORY_HAS_PRODUCTS);
    }

    return categorieRepository.delete(id);
  });

  ipcMain.handle('categories:delete-with-reaffectation', async (_event,
    idCategorieASupprimer: number, idCategorieDestination: number ) => {

      if (idCategorieASupprimer === idCategorieDestination) {
        throw new Error(METIER.SAME_CATEGORY);
      }

      const categorieDestination = await categorieRepository.getCategorieDestination(idCategorieDestination);

      if (!categorieDestination) {
        throw new Error(METIER.DESTINATION_CATEGORY_NOT_FOUND);
      }

      await categorieRepository.reaffecterProduits(idCategorieASupprimer, idCategorieDestination);

      return categorieRepository.delete(idCategorieASupprimer);
  });
}