import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { ProduitRepository } from '../repository/produit.repository';
import { ProduitCreateInput, ProduitUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerProduitIpc(produitRepository: ProduitRepository): void {
  ipcMain.handle('produits:get-all', async () => {
    return produitRepository.getAll();
  });

  ipcMain.handle('produits:get-by-categorie', async (_event,
    categorieId: number) => {
      return produitRepository.getByCategorie(categorieId);
    }
  );

  ipcMain.handle('produits:get-by-id', async (_event,
    id: number) => {
      return produitRepository.getById(id);
    }
  );

  ipcMain.handle('produits:create', async (_event,
    produit: ProduitCreateInput) => {
      try {
        const doublon = await produitRepository.getDoublonCreate(produit);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_PRODUCT);
        }

        return produitRepository.create(produit);
      } catch (error) {
        gererErreurPrisma( error, [METIER.DUPLICATE_PRODUCT], TECHNIQUES.PRODUCT_CREATE_ERROR );
      }
    }
  );

  ipcMain.handle('produits:update', async (_event,
    produit: ProduitUpdateInput) => {
      try {
        const doublon = await produitRepository.getDoublonUpdate(produit);

        if (doublon) {
          throw new Error(METIER.DUPLICATE_PRODUCT);
        }

        return produitRepository.update(produit);
      } catch (error) {
        gererErreurPrisma( error, [METIER.DUPLICATE_PRODUCT], TECHNIQUES.PRODUCT_UPDATE_ERROR );
      }
    }
  );

  ipcMain.handle('produits:delete', async (_event,
    id: number) => {
      try {
        return produitRepository.delete(id);
      } catch (error) {
        throw new Error(TECHNIQUES.PRODUCT_DELETE_ERROR);
      }
    }
  );

  ipcMain.handle('produits:get-similaires', async (_event,
    id: number) => {
      return produitRepository.getSimilaires(id);
    }
  );
}