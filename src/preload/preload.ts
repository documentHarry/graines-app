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

type EspeceCreateInput = {
  nom_scientifique: string;
  nom_commun: string;
  type_plante: string;
};

type EspeceUpdateInput = {
  id_espece: number;
  nom_scientifique: string;
  nom_commun: string;
  type_plante: string;
};

type VarieteCreateInput = {
  espece_id: number;
  nom: string;
  descriptif: string | null;
  bio: number;
  cycle_jours: number | null;
  couleur_legume: string | null;
  taille_fixe_legume: number | null;
  taille_min_legume: number | null;
  taille_max_legume: number | null;
  espacement_entre_les_plants: number | null;
  espacement_entre_les_lignes: number | null;
  type_ensoleillement: string | null;
  type_feuillage: string | null;
  hauteur_adulte_min: number | null;
  hauteur_adulte_max: number | null;
  duree_de_germination: string | null;
  temperature_min_de_germination: number | null;
  cycle_de_vie: string | null;
  rusticite_plante: string | null;
  date_semis_min: string | null;
  date_semis_max: string | null;
  duree_avant_recolte: string | null;
  type_de_sol: string | null;
  conseil_plantation: string | null;
};

type VarieteUpdateInput = {
  id_variete: number;
  espece_id: number;
  nom: string;
  descriptif: string | null;
  bio: number;
  cycle_jours: number | null;
  couleur_legume: string | null;
  taille_fixe_legume: number | null;
  taille_min_legume: number | null;
  taille_max_legume: number | null;
  espacement_entre_les_plants: number | null;
  espacement_entre_les_lignes: number | null;
  type_ensoleillement: string | null;
  type_feuillage: string | null;
  hauteur_adulte_min: number | null;
  hauteur_adulte_max: number | null;
  duree_de_germination: string | null;
  temperature_min_de_germination: number | null;
  cycle_de_vie: string | null;
  rusticite_plante: string | null;
  date_semis_min: string | null;
  date_semis_max: string | null;
  duree_avant_recolte: string | null;
  type_de_sol: string | null;
  conseil_plantation: string | null;
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

  getEspeces: () => ipcRenderer.invoke('especes:get-all'),
  getEspeceById: (id: number) => ipcRenderer.invoke('especes:get-by-id', id),
  createEspece: (espece: EspeceCreateInput) => ipcRenderer.invoke('especes:create', espece),
  updateEspece: (espece: EspeceUpdateInput) => ipcRenderer.invoke('especes:update', espece),
  deleteEspece: (id: number) => ipcRenderer.invoke('especes:delete', id),
  
  getVarietes: () => ipcRenderer.invoke('varietes:get-all'),
  getVarieteById: (id: number) => ipcRenderer.invoke('varietes:get-by-id', id),
  createVariete: (variete: VarieteCreateInput) => ipcRenderer.invoke('varietes:create', variete),
  updateVariete: (variete: VarieteUpdateInput) => ipcRenderer.invoke('varietes:update', variete),
  deleteVariete: (id: number) => ipcRenderer.invoke('varietes:delete', id),

  getProduits: () => ipcRenderer.invoke('produits:get-all'),
  getProduitById: (id: number) => ipcRenderer.invoke('produits:get-by-id', id),
  getProduitsByCategorie: (categorieId: number) => ipcRenderer.invoke('produits:get-by-categorie', categorieId),
  getProduitsSimilaires: (id: number) => ipcRenderer.invoke('produits:get-similaires', id),
  createProduit: (produit: ProduitCreateInput) => ipcRenderer.invoke('produits:create', produit),
  updateProduit: (produit: ProduitUpdateInput) => ipcRenderer.invoke('produits:update', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('produits:delete', id)
});