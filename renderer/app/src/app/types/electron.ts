//#region Categorie

export interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  descriptif: string | null;
  _count?: { produit: number; };
}

export interface CategorieCreateInput {
  nom_categorie: string;
  descriptif: string | null;
}

export interface CategorieUpdateInput {
  id_categorie: number;
  nom_categorie: string;
  descriptif: string | null;
}

//#endregion

//#region Espece

export interface Espece {
  id_espece: number;
  nom_scientifique: string;
  nom_commun: string;
  _count?: { variete: number; };
}

export interface EspeceCreateInput {
  nom_scientifique: string;
  nom_commun: string;
}

export interface EspeceUpdateInput {
  id_espece: number;
  nom_scientifique: string;
  nom_commun: string;
}

//#endregion

//#region Variete

export interface Variete {
  id_variete: number;
  nom: string;
  descriptif: string | null;
  bio: number | null;
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
  espece_id: number;
  espece: Espece;
  _count?: { produit: number; };
}

export interface VarieteCreateInput {
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
}

export interface VarieteUpdateInput {
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
}

//#endregion

//#region AromatePropriete

export interface AromatePropriete {
  aromate_id: number;
  propriete_id: number;
  propriete_medicinale: ProprieteMedicinale;
}

export interface ProprieteMedicinale {
  id_propriete: number;
  nom_propriete: string;
}

export interface ProprieteMedicinaleCreateInput {
  nom_propriete: string;
}

export interface ProprieteMedicinaleUpdateInput {
  id_propriete: number;
  nom_propriete: string;
}

//#endregion

//#region Aromate

export interface Aromate {
  id_aromate: number;
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  variete?: Variete;
  aromate_propriete?: AromatePropriete[];
}

export interface AromateCreateInput {
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  proprietes_ids: number[];
}

export interface AromateUpdateInput {
  id_aromate: number;
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  proprietes_ids: number[];
}

export interface AromateInput {
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  proprietes_ids: number[];
}

//#endregion

//#region Produit

export interface Produit {
  id_produit: number;
  intitule: string;
  prix_unitaire: number;
  image_produit: string | null;
  quantite: number;
  date_ajout: string | null;
  variete_id: number;
  categorie_id: number;
  categorie?: Categorie;
  variete: Variete;
}

export interface ProduitCreateInput {
  intitule: string;
  prix_unitaire: number;
  quantite: number;
  categorie_id: number;
  variete_id: number;
}

export interface ProduitUpdateInput {
  id_produit: number;
  intitule: string;
  prix_unitaire: number;
  quantite: number;
  categorie_id: number;
  variete_id: number;
}

//#endregion

//#region Localite

export interface Localite {
  id_localite: number;
  code_postal: string;
  localite: string;
}

export interface LocaliteCreateInput {
  code_postal: string;
  localite: string;
}

export interface LocaliteUpdateInput {
  id_localite: number;
  code_postal: string;
  localite: string;
}

//#endregion

//#region AdresseLivraison

export interface AdresseLivraison {
  id_adresse: number;
  rue: string;
  numero: string;
  par_defaut: number | null;
  utilisateur_id: number;
  localite_id: number;
  localite: Localite;
}

export interface AdresseLivraisonCreateInput {
  rue: string;
  numero: string;
  par_defaut: number;
  utilisateur_id: number;
  localite_id: number;
}

export interface AdresseLivraisonUpdateInput {
  id_adresse: number;
  rue: string;
  numero: string;
  par_defaut: number;
  localite_id: number;
}

//#endregion

//#region Utilisateur

export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  date_inscription: string | null;
  actif: number | null;
  adresse_livraison: AdresseLivraison[];
  utilisateur_role?: UtilisateurRole[];
}

export interface UtilisateurCreateInput {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
}

export interface UtilisateurUpdateInput {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
}

//#endregion

//#region UtilisateurRole

export interface UtilisateurRole {
  utilisateur_id: number;
  role_id: number;
  role: Role;
}

export interface UtilisateurRoleUpdateInput {
  utilisateur_id: number;
  roles_ids: number[];
}

//#endregion

//#region Role

export interface Role {
  id_role: number;
  nom_role: string;
}

export interface RoleCreateInput {
  nom_role: string;
}

export interface RoleUpdateInput {
  id_role: number;
  nom_role: string;
}

//#endregion

export interface ElectronAPI {
  getCategories: () => Promise<Categorie[]>;
  getCategorieById: (id: number) => Promise<Categorie | null>;
  createCategorie: (categorie: CategorieCreateInput) => Promise<Categorie>;
  updateCategorie: (categorie: CategorieUpdateInput) => Promise<Categorie>;
  deleteCategorie: (id: number) => Promise<Categorie>;
    deleteCategorieWithReaffectation: (
      idCategorieASupprimer: number,
      idCategorieDestination: number) => Promise<Categorie>;

  getEspeces: () => Promise<Espece[]>;
  getEspeceById: (id: number) => Promise<Espece | null>;
  createEspece: (espece: EspeceCreateInput) => Promise<Espece>;
  updateEspece: (espece: EspeceUpdateInput) => Promise<Espece>;
  deleteEspece: (id: number) => Promise<Espece>;

  getVarietes: () => Promise<Variete[]>;
  getVarieteById: (id: number) => Promise<Variete | null>;
  createVariete: (variete: VarieteCreateInput) => Promise<Variete>;
  updateVariete: (variete: VarieteUpdateInput) => Promise<Variete>;
  deleteVariete: (id: number) => Promise<Variete>;

  getAromates: () => Promise<Aromate[]>;
  getAromateById: (id: number) => Promise<Aromate | null>;
  createAromate: (aromate: AromateCreateInput) => Promise<Aromate>;
  updateAromate: (aromate: AromateUpdateInput) => Promise<Aromate>;
  deleteAromate: (id: number) => Promise<Aromate>;

  getProprietesMedicinales: () => Promise<ProprieteMedicinale[]>;
  createProprieteMedicinale: (propriete: ProprieteMedicinaleCreateInput) => Promise<ProprieteMedicinale>;
  updateProprieteMedicinale: (propriete: ProprieteMedicinaleUpdateInput) => Promise<ProprieteMedicinale>;
  deleteProprieteMedicinale: (id: number) => Promise<ProprieteMedicinale>;

  getProduits: () => Promise<Produit[]>;
  getProduitById: (id: number) => Promise<Produit | null>;
  getProduitsByCategorie: (categorieId: number) => Promise<Produit[]>;
  createProduit: (produit: ProduitCreateInput) => Promise<Produit>;
  updateProduit: (produit: ProduitUpdateInput) => Promise<Produit>;
  deleteProduit: (id: number) => Promise<Produit>;

  getUtilisateurs: () => Promise<Utilisateur[]>;
  getUtilisateurById: (id: number) => Promise<Utilisateur | null>;
  createUtilisateur: (utilisateur: UtilisateurCreateInput) => Promise<Utilisateur>;
  updateUtilisateur: (utilisateur: UtilisateurUpdateInput) => Promise<Utilisateur>;
  deleteUtilisateur: (id: number) => Promise<Utilisateur>;

  getLocalites: () => Promise<Localite[]>;
  createLocalite: (localite: LocaliteCreateInput) => Promise<Localite>;
  updateLocalite: (localite: LocaliteUpdateInput) => Promise<Localite>;
  deleteLocalite: (id: number) => Promise<Localite>;

  createAdresseLivraison: (adresse: AdresseLivraisonCreateInput) => Promise<AdresseLivraison>;
  updateAdresseLivraison: (adresse: AdresseLivraisonUpdateInput) => Promise<AdresseLivraison>;
  deleteAdresseLivraison: (id: number) => Promise<AdresseLivraison>;

  getRoles: () => Promise<Role[]>;
  createRole: (role: RoleCreateInput) => Promise<Role>;
  updateRole: (role: RoleUpdateInput) => Promise<Role>;
  deleteRole: (id: number) => Promise<Role>;

  getUtilisateurRoles: (idUtilisateur: number) => Promise<UtilisateurRole[]>;
  updateUtilisateurRoles: (donnees: UtilisateurRoleUpdateInput) => Promise<Utilisateur>;

}

declare global {
  interface Window { api: ElectronAPI; }
}