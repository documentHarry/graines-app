-- database: ./graines.db

-- ============================================================
-- SCHÉMA DE BASE DE DONNÉES - SQLITE
-- ============================================================

CREATE TABLE IF NOT EXISTS localite (
    id_localite INTEGER PRIMARY KEY AUTOINCREMENT,
    code_postal TEXT NOT NULL,
    localite TEXT NOT NULL,
    UNIQUE (code_postal, localite)
);

CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe_hash TEXT NOT NULL,
    mot_de_passe_salt BLOB NOT NULL,
    date_inscription TEXT DEFAULT CURRENT_TIMESTAMP,
    actif INTEGER DEFAULT 1 CHECK(actif IN (0,1))
);

CREATE TABLE IF NOT EXISTS adresse_livraison (
    id_adresse INTEGER PRIMARY KEY AUTOINCREMENT,
    rue TEXT NOT NULL,
    numero TEXT NOT NULL,
    par_defaut INTEGER DEFAULT 0 CHECK(par_defaut IN (0,1)),
    utilisateur_id INTEGER NOT NULL,
    localite_id INTEGER NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (localite_id) REFERENCES localite(id_localite) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS role (
    id_role INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_role TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS utilisateur_role (
    utilisateur_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (utilisateur_id, role_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id_role) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorie (
    id_categorie INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_categorie TEXT NOT NULL UNIQUE,
    descriptif TEXT
);

CREATE TABLE IF NOT EXISTS espece (
    id_espece INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_scientifique TEXT NOT NULL,
    nom_commun TEXT NOT NULL,
    UNIQUE (nom_scientifique, nom_commun)
);

CREATE TABLE IF NOT EXISTS variete (
    id_variete INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    descriptif TEXT,
    bio INTEGER DEFAULT 1,
    cycle_jours INTEGER,
    couleur_legume TEXT,
    taille_fixe_legume REAL,
    taille_min_legume REAL,
    taille_max_legume REAL,
    espacement_entre_les_plants INTEGER
    CHECK (
        espacement_entre_les_plants IS NULL OR
        espacement_entre_les_plants IN (5,8,10,15,20,25,30,40,50,60,75,80,100,200)
    ),
    espacement_entre_les_lignes INTEGER
    CHECK (
        espacement_entre_les_lignes IS NULL OR
        espacement_entre_les_lignes IN (5,8,15,20,25,30,35,40,45,50,60,70,75,80,100,120)
    ),
    type_ensoleillement TEXT,
    type_feuillage TEXT,
    hauteur_adulte_min INTEGER,
    hauteur_adulte_max INTEGER,
    duree_de_germination TEXT,
    temperature_min_de_germination INTEGER,
    cycle_de_vie TEXT CHECK(cycle_de_vie IN ('annuelle','bisannuelle','vivace')),
    rusticite_plante TEXT,
    date_semis_min TEXT,
    date_semis_max TEXT,
    duree_avant_recolte TEXT,
    type_de_sol TEXT,
    conseil_plantation TEXT,
    espece_id INTEGER NOT NULL,
    FOREIGN KEY (espece_id) REFERENCES espece(id_espece) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS aromate (
    id_aromate INTEGER PRIMARY KEY AUTOINCREMENT,
    partie_utilisee TEXT,
    propriete TEXT,
    usage_culinaire TEXT,
    variete_id INTEGER NOT NULL,
    FOREIGN KEY (variete_id) REFERENCES variete(id_variete) 
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS propriete_medicinale (
    id_propriete INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_propriete TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS aromate_propriete (
    aromate_id INTEGER NOT NULL,
    propriete_id INTEGER NOT NULL,
    PRIMARY KEY (aromate_id, propriete_id),
    FOREIGN KEY (aromate_id) REFERENCES aromate(id_aromate) ON DELETE CASCADE,
    FOREIGN KEY (propriete_id) REFERENCES propriete_medicinale(id_propriete) 
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS produit (
    id_produit INTEGER PRIMARY KEY AUTOINCREMENT,
    intitule TEXT NOT NULL,
    prix_unitaire REAL NOT NULL CHECK(prix_unitaire > 0),
    quantite INTEGER NOT NULL DEFAULT 0 CHECK(quantite >= 0),
    image_produit TEXT,
    date_ajout TEXT DEFAULT CURRENT_TIMESTAMP,
    variete_id INTEGER NOT NULL,
    categorie_id INTEGER NOT NULL,
    FOREIGN KEY (variete_id) REFERENCES variete(id_variete) 
        ON DELETE RESTRICT
        ON UPDATE NO ACTION,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id_categorie) 
        ON DELETE RESTRICT
        ON UPDATE NO ACTION
);