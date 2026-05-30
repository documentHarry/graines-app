BEGIN TRANSACTION;

-- Tous les utilisateurs existants reçoivent le rôle CLIENT.
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT
    utilisateur.id_utilisateur,
    role.id_role
FROM utilisateur
JOIN role ON role.nom_role = 'CLIENT';

-- Compte de test : ADMIN.
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT
    utilisateur.id_utilisateur,
    role.id_role
FROM utilisateur
JOIN role ON role.nom_role = 'ADMIN'
WHERE utilisateur.email = 'jthomas@example.org';

-- Compte de test : MODERATEUR.
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT
    utilisateur.id_utilisateur,
    role.id_role
FROM utilisateur
JOIN role ON role.nom_role = 'MODERATEUR'
WHERE utilisateur.email = 'inge37@example.net';

-- Compte de test : GESTIONNAIRE_CATALOGUE.
INSERT INTO utilisateur_role (utilisateur_id, role_id)
SELECT
    utilisateur.id_utilisateur,
    role.id_role
FROM utilisateur
JOIN role ON role.nom_role = 'GESTIONNAIRE_CATALOGUE'
WHERE utilisateur.email = 'daan27@example.org';

COMMIT;