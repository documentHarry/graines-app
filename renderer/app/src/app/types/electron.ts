export interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  descriptif: string | null;
}

export interface Espece {
  id_espece: number;
  nom_scientifique: string;
  nom_commun: string;
  type_plante: string;
}

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
}

export interface Produit {
  id_produit: number;
  intitule: string;
  prix_unitaire: number;
  image_produit: string | null;
  actif: number | null;
  date_ajout: string | null;
  variete_id: number;
  categorie_id: number;
  categorie: Categorie;
  variete: Variete;
}

export interface ElectronAPI {
  getCategories: () => Promise<Categorie[]>;
  getProduits: () => Promise<Produit[]>;
  getProduitById: (id: number) => Promise<Produit | null>;
}

declare global {
  interface Window { api: ElectronAPI; }
}