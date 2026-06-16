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
};

type EspeceUpdateInput = {
  id_espece: number;
  nom_scientifique: string;
  nom_commun: string;
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
  aromate: AromateInput | null;
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
  aromate: AromateInput | null;
};

type AromateInput = {
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  proprietes_ids: number[];
};

type AromateCreateInput = {
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  proprietes_ids: number[];
};

type AromateUpdateInput = {
  id_aromate: number;
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  proprietes_ids: number[];
};

type ProprieteMedicinaleCreateInput = {
  nom_propriete: string;
};

type ProprieteMedicinaleUpdateInput = {
  id_propriete: number;
  nom_propriete: string;
};

type ProduitCreateInput = {
  intitule: string;
  prix_unitaire: number;
  quantite: number;
  categorie_id: number;
  variete_id: number;
};

type ProduitUpdateInput = {
  id_produit: number;
  intitule: string;
  prix_unitaire: number;
  quantite: number;
  categorie_id: number;
  variete_id: number;
};

type LocaliteCreateInput = {
  code_postal: string;
  localite: string;
};

type LocaliteUpdateInput = {
  id_localite: number;
  code_postal: string;
  localite: string;
};

type AdresseLivraisonCreateInput = {
  rue: string;
  numero: string;
  par_defaut: number;
  utilisateur_id: number;
  localite_id: number;
};

type AdresseLivraisonUpdateInput = {
  id_adresse: number;
  rue: string;
  numero: string;
  par_defaut: number;
  localite_id: number;
};

type UtilisateurCreateInput = {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  actif: number;
};

type UtilisateurUpdateInput = {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  actif: number;
};

type UtilisateurRoleUpdateInput = {
  utilisateur_id: number;
  roles_ids: number[];
};

type RoleCreateInput = {
  nom_role: string;
};

type RoleUpdateInput = {
  id_role: number;
  nom_role: string;
};

contextBridge.exposeInMainWorld('api', {
  login: (email: string, motDePasse: string) => ipcRenderer.invoke(
    'auth:login', { email: email, mot_de_passe: motDePasse }
  ),
  getCategories: () => ipcRenderer.invoke('categories:get-all'),
  getCategorieById: (id: number) => ipcRenderer.invoke('categories:get-by-id', id),
  createCategorie: (categorie: CategorieCreateInput) => ipcRenderer.invoke('categories:create', categorie),
  updateCategorie: (categorie: CategorieUpdateInput) => ipcRenderer.invoke('categories:update', categorie),
  deleteCategorie: (id: number) => ipcRenderer.invoke('categories:delete', id),
    deleteCategorieWithReaffectation: (
      idCategorieASupprimer: number,
      idCategorieDestination: number
    ) => ipcRenderer.invoke('categories:delete-with-reaffectation', idCategorieASupprimer, idCategorieDestination),

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

  getAromates: () => ipcRenderer.invoke('aromates:get-all'),
  getAromateById: (id: number) => ipcRenderer.invoke('aromates:get-by-id', id),
  createAromate: (aromate: AromateCreateInput) => ipcRenderer.invoke('aromates:create', aromate),
  updateAromate: (aromate: AromateUpdateInput) => ipcRenderer.invoke('aromates:update', aromate),
  deleteAromate: (id: number) => ipcRenderer.invoke('aromates:delete', id),

  getProprietesMedicinales: () => ipcRenderer.invoke('proprietes-medicinales:get-all'),
  createProprieteMedicinale: (propriete: ProprieteMedicinaleCreateInput) =>  ipcRenderer.invoke('proprietes-medicinales:create', propriete),
  updateProprieteMedicinale: (propriete: ProprieteMedicinaleUpdateInput) =>  ipcRenderer.invoke('proprietes-medicinales:update', propriete),
  deleteProprieteMedicinale: (id: number) => ipcRenderer.invoke('proprietes-medicinales:delete', id),

  getProduits: () => ipcRenderer.invoke('produits:get-all'),
  getProduitById: (id: number) => ipcRenderer.invoke('produits:get-by-id', id),
  getProduitsByCategorie: (categorieId: number) => ipcRenderer.invoke('produits:get-by-categorie', categorieId),
  createProduit: (produit: ProduitCreateInput) => ipcRenderer.invoke('produits:create', produit),
  updateProduit: (produit: ProduitUpdateInput) => ipcRenderer.invoke('produits:update', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('produits:delete', id),

  getUtilisateurs: () => ipcRenderer.invoke('utilisateurs:get-all'),
  getUtilisateurById: (id: number) => ipcRenderer.invoke('utilisateurs:get-by-id', id),
  createUtilisateur: (utilisateur: UtilisateurCreateInput) => ipcRenderer.invoke('utilisateurs:create', utilisateur),
  updateUtilisateur: (utilisateur: UtilisateurUpdateInput) => ipcRenderer.invoke('utilisateurs:update', utilisateur),
  deleteUtilisateur: (id: number) => ipcRenderer.invoke('utilisateurs:delete', id),

  getLocalites: () => ipcRenderer.invoke('localites:get-all'),
  createLocalite: (localite: LocaliteCreateInput) => ipcRenderer.invoke('localites:create', localite),
  updateLocalite: (localite: LocaliteUpdateInput) => ipcRenderer.invoke('localites:update', localite),
  deleteLocalite: (id: number) => ipcRenderer.invoke('localites:delete', id),

  createAdresseLivraison: (adresse: AdresseLivraisonCreateInput) => ipcRenderer.invoke('adresses-livraison:create', adresse),
  updateAdresseLivraison: (adresse: AdresseLivraisonUpdateInput) => ipcRenderer.invoke('adresses-livraison:update', adresse),
  deleteAdresseLivraison: (id: number) => ipcRenderer.invoke('adresses-livraison:delete', id),

  getRoles: () => ipcRenderer.invoke('roles:get-all'),
  createRole: (role: RoleCreateInput) => ipcRenderer.invoke('roles:create', role),
  updateRole: (role: RoleUpdateInput) => ipcRenderer.invoke('roles:update', role),
  deleteRole: (id: number) => ipcRenderer.invoke('roles:delete', id),

  getUtilisateurRoles: (idUtilisateur: number) => ipcRenderer.invoke('utilisateur-roles:get-by-utilisateur', idUtilisateur),
  updateUtilisateurRoles: (donnees: UtilisateurRoleUpdateInput) => ipcRenderer.invoke('utilisateur-roles:update', donnees),

});