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
  aromate?: Aromate[];
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
  aromate: AromateInput | null;
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
  aromate: AromateInput | null;
}

//#endregion

export interface ProprieteMedicinale {
  id_propriete: number;
  nom_propriete: string;
}

export interface AromatePropriete {
  aromate_id: number;
  propriete_id: number;
  propriete_medicinale: ProprieteMedicinale;
}

//#region Aromate

export interface Aromate {
  id_aromate: number;
  partie_utilisee: string | null;
  propriete: string | null;
  usage_culinaire: string | null;
  variete_id: number;
  aromate_propriete?: AromatePropriete[];
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
  categorie: Categorie;
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

//#region Role

export interface Role {
  id_role: number;
  nom_role: string;
}

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

//#region Avis

export interface AvisUtilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface Avis {
  id_avis: number;
  note: number | null;
  titre: string | null;
  commentaire: string | null;
  date_depot: string | null;
  statut: string | null;
  nombre_jaime: number | null;
  utilisateur_id: number;
  produit_id: number;
  utilisateur: AvisUtilisateur;
  produit: Produit;
}

export interface AvisCreateInput {
  note: number;
  titre: string | null;
  commentaire: string | null;
  utilisateur_id: number;
  produit_id: number;
}

export interface AvisUpdateInput {
  id_avis: number;
  note: number;
  titre: string | null;
  commentaire: string | null;
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
  getProprietesMedicinales: () => Promise<ProprieteMedicinale[]>;
  createVariete: (variete: VarieteCreateInput) => Promise<Variete>;
  updateVariete: (variete: VarieteUpdateInput) => Promise<Variete>;
  deleteVariete: (id: number) => Promise<Variete>;

  getProduits: () => Promise<Produit[]>;
  getProduitById: (id: number) => Promise<Produit | null>;
  getProduitsByCategorie: (categorieId: number) => Promise<Produit[]>;
  getProduitsSimilaires: (id: number) => Promise<Produit[]>;
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
  getUtilisateurRoles: (idUtilisateur: number) => Promise<UtilisateurRole[]>;
  updateUtilisateurRoles: (donnees: UtilisateurRoleUpdateInput) => Promise<Utilisateur>;

  getAvis: () => Promise<Avis[]>;
  getAvisById: (id: number) => Promise<Avis | null>;
  getAvisByProduit: (produitId: number) => Promise<Avis[]>;
  createAvis: (avis: AvisCreateInput) => Promise<Avis>;
  updateAvis: (avis: AvisUpdateInput) => Promise<Avis>;
  deleteAvis: (id: number) => Promise<Avis>;
  likeAvis: (id: number) => Promise<Avis>;
}

declare global {
  interface Window { api: ElectronAPI; }
}