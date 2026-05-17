import { contextBridge, ipcRenderer } from 'electron';

type CategorieCreateInput = {
  nom_categorie: string;
  descriptif: string | null;
};

type CategorieUpdateInput = {
  id_categorie: number;
  nom_categorie: string;
  descriptif: string | null;
};

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
  getCategorieById: (id: number) => ipcRenderer.invoke('categories:get-by-id', id),
  createCategorie: (categorie: CategorieCreateInput) => ipcRenderer.invoke('categories:create', categorie),
  updateCategorie: (categorie: CategorieUpdateInput) => ipcRenderer.invoke('categories:update', categorie),

  deleteCategorie: (id: number) => ipcRenderer.invoke('categories:delete', id),
    deleteCategorieWithReaffectation: (
      idCategorieASupprimer: number,
      idCategorieDestination: number
    ) => ipcRenderer.invoke('categories:delete-with-reaffectation',idCategorieASupprimer,idCategorieDestination),

  getVarietes: () => ipcRenderer.invoke('varietes:get-all'),
  getProduits: () => ipcRenderer.invoke('produits:get-all'),
  getProduitById: (id: number) => ipcRenderer.invoke('produits:get-by-id', id),
  getProduitsByCategorie: (categorieId: number) => ipcRenderer.invoke('produits:get-by-categorie', categorieId),
  createProduit: (produit: ProduitCreateInput) => ipcRenderer.invoke('produits:create', produit),
  updateProduit: (produit: ProduitUpdateInput) => ipcRenderer.invoke('produits:update', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('produits:delete', id)
});