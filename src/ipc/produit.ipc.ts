import { ipcMain } from 'electron';
import { ProduitRepository } from '../repository/produit.repository';
import { ProduitCreateInput, ProduitUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerProduitIpc(produitRepository: ProduitRepository): void {
  ipcMain.handle('produits:get-all', async () => {
    return produitRepository.getAll();
  });

  ipcMain.handle('produits:get-by-categorie', async (_event, categorieId: number) => {
    return produitRepository.getByCategorie(categorieId);
  });

  ipcMain.handle('produits:get-by-id', async (_event, id: number) => {
    return produitRepository.getById(id);
  });

  ipcMain.handle('produits:create', async (_event, produit: ProduitCreateInput) => {
    return produitRepository.create(produit);
  });

  ipcMain.handle('produits:update', async (_event, produit: ProduitUpdateInput) => {
    return produitRepository.update(produit);
  });

  ipcMain.handle('produits:delete', async (_event, id: number) => {
    return produitRepository.delete(id);
  });

}