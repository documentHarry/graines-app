import { contextBridge, ipcRenderer } from 'electron';

type ProduitCreateInput = {
  intitule: string;
  prix_unitaire: number;
  categorie_id: number;
  variete_id: number;
};

type ProduitUpdateInput = {
  id_produit: number;
  intitule: string;
  prix_unitaire: number;
  categorie_id: number;
  variete_id: number;
};

contextBridge.exposeInMainWorld('api', {
  getCategories: () => ipcRenderer.invoke('categories:get-all'),
  getVarietes: () => ipcRenderer.invoke('varietes:get-all'),
  getProduits: () => ipcRenderer.invoke('produits:get-all'),
  getProduitById: (id: number) => ipcRenderer.invoke('produits:get-by-id', id),
  createProduit: (produit: ProduitCreateInput) => ipcRenderer.invoke('produits:create', produit),
  updateProduit: (produit: ProduitUpdateInput) => ipcRenderer.invoke('produits:update', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('produits:delete', id)
});