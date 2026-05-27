# Bilan des changements depuis le dernier commit

## 1. Authentification

### Ajout du login réel

Mise en place d’un flux de connexion complet entre Angular, Electron et Prisma.

Flux actuel :

    ConnexionComponent
    → AuthService
    → preload.ts
    → auth.ipc.ts
    → AuthRepository
    → Prisma / SQLite

La connexion utilise maintenant :

- l’email saisi ;
- le mot de passe saisi ;
- le hash stocké en base ;
- le salt stocké en base ;
- les rôles associés à l’utilisateur.

### Vérification du mot de passe

La vérification du mot de passe utilise PBKDF2 avec SHA-512.

Le mot de passe n’est plus comparé en clair.

Fichier concerné :

    src/security/password-utils.ts

Fonctions principales :

    hacherMotDePasse
    verifierMotDePasse

### Conservation de l’utilisateur connecté

L’utilisateur connecté est stocké dans le service d’authentification et dans `localStorage`.

Cela permet de conserver la session pendant l’utilisation de l’application.

### Déconnexion

Ajout de la logique de déconnexion.

Le logout supprime l’utilisateur courant du service et du `localStorage`.

---

## 2. Gestion des rôles

### Création des rôles

Ajout des rôles applicatifs :

    CLIENT
    SUPPORT_CLIENT
    GESTIONNAIRE_RETOURS
    MODERATEUR
    LOGISTICIEN
    GESTIONNAIRE_CATALOGUE
    ADMIN

### Attribution initiale des rôles

Tous les utilisateurs reçoivent le rôle `CLIENT`.

Des comptes de test reçoivent également des rôles spécifiques :

    jthomas@example.org            → ADMIN
    marie82@example.net            → SUPPORT_CLIENT
    mariannesimon@example.org      → GESTIONNAIRE_RETOURS
    inge37@example.net             → MODERATEUR
    jadotjoelle@example.net        → LOGISTICIEN
    daan27@example.org             → GESTIONNAIRE_CATALOGUE

### Tables concernées

    role
    utilisateur_role

### Fichiers ajoutés

    src/repository/role.repository.ts
    src/repository/utilisateur-role.repository.ts
    src/ipc/role.ipc.ts
    src/ipc/utilisateur-role.ipc.ts
    role.service.ts

### Canaux IPC ajoutés

    roles:get-all
    utilisateur-roles:get-by-utilisateur
    utilisateur-roles:update

---

## 3. Guards et protection des routes

### Guards utilisés

    authGuard
    roleGuard

`authGuard` vérifie que l’utilisateur est connecté.

`roleGuard` vérifie que l’utilisateur possède au moins un des rôles autorisés sur la route.

### Protection des routes

Les routes sensibles utilisent maintenant :

    canActivate: [authGuard, roleGuard]
    data: { roles: [...] }

### Routes protégées

Les routes de gestion catalogue sont accessibles aux rôles :

    GESTIONNAIRE_CATALOGUE
    ADMIN

Les routes de gestion utilisateurs sont principalement accessibles à :

    ADMIN

Certaines routes de détail utilisateur sont aussi accessibles à :

    SUPPORT_CLIENT

Les routes de gestion des avis sont protégées selon les rôles :

    CLIENT
    MODERATEUR
    ADMIN

---

## 4. Page de connexion

Ajout d’une page permettant à l’utilisateur de s’authentifier.

La page permet :

- de saisir un email ;
- de saisir un mot de passe ;
- d’appeler le vrai flux de connexion ;
- d’afficher un message d’erreur si la connexion échoue ;
- de rediriger vers l’URL initialement demandée après connexion.

La redirection utilise `returnUrl`.

---

## 5. Navigation

La barre de navigation a été enrichie avec :

- affichage conditionnel selon l’état connecté ;
- bouton de déconnexion ;
- badge utilisateur avec les initiales du prénom et du nom.

---

## 6. Gestion des utilisateurs

### Pages utilisateurs stabilisées

    liste utilisateurs
    détail utilisateur
    ajout utilisateur
    modification utilisateur
    suppression / désactivation utilisateur

La suppression logique désactive l’utilisateur avec :

    actif = 0

### Hash du mot de passe à la création

Lors de la création d’un utilisateur, le mot de passe est hashé avant insertion en base.

### Page de gestion des rôles

Ajout d’une page dédiée :

    /utilisateurs/roles/:id

Cette page permet :

- de charger un utilisateur ;
- de charger tous les rôles disponibles ;
- de charger les rôles déjà attribués ;
- de cocher / décocher les rôles ;
- d’enregistrer les rôles.

La route est protégée par le rôle `ADMIN`.

---

## 7. Gestion des avis

### Table avis

Ajout de la gestion métier des avis avec les champs :

    id_avis
    note
    titre
    commentaire
    date_depot
    statut
    nombre_jaime
    utilisateur_id
    produit_id

### Statuts des avis

    nouveau
    modifié
    supprimé

La suppression d’un avis est logique avec :

    statut = 'supprimé'

### Opérations ajoutées

    lister les avis
    récupérer un avis par ID
    récupérer les avis d’un produit
    créer un avis
    modifier un avis
    supprimer logiquement un avis
    ajouter un j’aime

### Fichiers créés

    src/repository/avis.repository.ts
    src/ipc/avis.ipc.ts
    avis.service.ts
    avis.component.ts
    avis-ajouter.component.ts
    avis-modifier.component.ts
    avis-supprimer.component.ts

### Seed avis

Création d’un script d’insertion pour les avis.

Objectif :

    entre 0 et 3 avis par produit

Les avis sont liés à :

    utilisateur
    produit

### Export / bulk insert

Travail effectué pour transformer les avis existants en un gros script :

    INSERT INTO avis (...) VALUES
    (...),
    (...),
    (...);

---

## 8. Produits et intégration future des avis

Préparation de l’intégration des avis dans la page détail produit.

Décision d’architecture :

    un composant enfant affichera les avis d’un produit

Principe prévu :

    ProduitDetailComponent
    → AvisProduitComponent
    → getAvisByProduit(produitId)

L’objectif est de garder une page produit centralisée tout en réutilisant les composants avis.

---

## 9. Refactorisation Repository / IPC

### Objectif

Réduire fortement la taille de `main.ts`.

Avant, `main.ts` contenait :

- les requêtes Prisma ;
- les handlers IPC ;
- les règles métier ;
- la logique d’authentification ;
- la logique de création / update / delete de tous les domaines.

Après refactorisation :

    main.ts
    → démarre Electron
    → initialise la base
    → crée Prisma
    → instancie les repositories
    → enregistre les IPC

### Repositories créés

    auth.repository.ts
    categorie.repository.ts
    espece.repository.ts
    variete.repository.ts
    aromate.repository.ts
    propriete-medicinale.repository.ts
    produit.repository.ts
    avis.repository.ts
    utilisateur.repository.ts
    localite.repository.ts
    adresse-livraison.repository.ts
    role.repository.ts
    utilisateur-role.repository.ts

### IPC créés

    auth.ipc.ts
    categorie.ipc.ts
    espece.ipc.ts
    variete.ipc.ts
    propriete-medicinale.ipc.ts
    produit.ipc.ts
    avis.ipc.ts
    utilisateur.ipc.ts
    localite.ipc.ts
    adresse-livraison.ipc.ts
    role.ipc.ts
    utilisateur-role.ipc.ts

### Séparation des responsabilités

    repository
    → accès aux données Prisma

    ipc
    → communication Electron / renderer

    main.ts
    → initialisation et câblage

---

## 10. Variétés et aromates

La logique variété / aromate a été séparée côté repository.

Raison métier :

- une variété peut être un aromate ;
- un aromate dépend toujours d’une variété ;
- toutes les variétés ne sont pas des aromates.

Repositories concernés :

    variete.repository.ts
    aromate.repository.ts

`variete.repository.ts` gère la table `variete`.

`aromate.repository.ts` gère :

    aromate
    aromate_propriete

La table N-N `aromate_propriete` est gérée dans `AromateRepository`, car elle sert uniquement à lier un aromate à ses propriétés médicinales.

Aucune page indépendante `aromates` n’a été créée.

L’aromate reste géré depuis les pages :

    variete-ajouter
    variete-modifier
    variete-detail

---

## 11. Propriétés médicinales

Ajout d’un repository et d’un IPC dédié :

    propriete-medicinale.repository.ts
    propriete-medicinale.ipc.ts

Canal IPC :

    proprietes-medicinales:get-all

---

## 12. Catégories, espèces, produits, localités, adresses

Ces domaines ont été migrés vers le pattern Repository / IPC.

### Catégories

    categorie.repository.ts
    categorie.ipc.ts

### Espèces

    espece.repository.ts
    espece.ipc.ts

### Produits

    produit.repository.ts
    produit.ipc.ts

### Localités

    localite.repository.ts
    localite.ipc.ts

### Adresses de livraison

    adresse-livraison.repository.ts
    adresse-livraison.ipc.ts

---

## 13. Initialisation de la base de données

Les fichiers liés à l’initialisation de la base ont été déplacés dans :

    src/database/

Fichiers concernés :

    init-database.ts
    generer-utilisateurs-hashes.ts

`init-database.ts` :

- crée le dossier de base de données si nécessaire ;
- vérifie si la base existe déjà ;
- exécute les scripts de schéma ;
- exécute les scripts de seed ;
- ignore le fichier source `07_insert_utilisateurs.sql` pour éviter d’insérer les mots de passe en clair.

`generer-utilisateurs-hashes.ts` :

- lit le fichier SQL source des utilisateurs ;
- détecte les mots de passe en clair ;
- génère un salt ;
- génère un hash PBKDF2 ;
- écrit un nouveau fichier SQL avec les hashes ;
- utilise la syntaxe SQLite `X'...'` pour stocker le salt en BLOB.

---

## 14. Sécurité

`password-utils.ts` a été déplacé dans :

    src/security/

Il contient :

    hacherMotDePasse
    verifierMotDePasse

Les logs de debug affichant le hash et le salt ont été retirés une fois le login fonctionnel.

---

## 15. Gestion des erreurs

`prisma-errors.ts` a été déplacé dans :

    src/errors/

Il contient :

    METIER
    TECHNIQUES
    gererErreurPrisma

Erreurs métier ajoutées notamment :

    LOGIN_INCORRECT
    DUPLICATE_AVIS
    AVIS_NOT_FOUND

Erreurs techniques ajoutées notamment :

    AUTH_LOGIN_ERROR
    AVIS_CREATE_ERROR
    AVIS_UPDATE_ERROR
    AVIS_DELETE_ERROR
    AVIS_LIKE_ERROR

---

## 16. Tests

Les tests de routes ont été enrichis pour vérifier :

- les routes publiques ;
- les routes protégées catalogue ;
- les routes protégées utilisateurs ;
- les routes protégées avis ;
- la position du wildcard ;
- l’ordre des routes spécifiques avant les routes génériques `:id`.

Ajout du test :

    verifierRouteProtegee('utilisateurs/roles/:id', rolesAdmin);

Ajout du test d’ordre :

    expect(paths.indexOf('utilisateurs/roles/:id')).toBeLessThan(paths.indexOf('utilisateurs/:id'));

Tests composants ajoutés ou adaptés :

    avis
    avis-ajouter
    avis-modifier
    avis-supprimer
    utilisateur-roles

Tests services ajoutés ou adaptés :

    avis.service
    role.service

Tous les tests passent après correction de l’ordre des routes.

---

## 17. Corrections importantes

### Correction preload / main pour login

Correction du passage des identifiants entre `preload.ts` et le handler IPC.

Le handler attendait :

    email
    mot_de_passe

Le preload envoie maintenant correctement :

    email
    mot_de_passe

### Correction des rôles

Correction du problème :

    No handler registered for 'roles:get-all'

Le problème venait du fait que l’IPC des rôles n’était pas encore enregistré dans `main.ts`.

Ajout de :

    enregistrerRoleIpc(roleRepository)
    enregistrerUtilisateurRoleIpc(utilisateurRoleRepository)

### Correction ordre des routes

Correction du problème où `utilisateurs/:id` était déclaré avant `utilisateurs/roles/:id`.

La route spécifique est maintenant placée avant la route générique.

---

## 18. État actuel

À ce stade :

- l’application démarre correctement ;
- la base SQLite est initialisée automatiquement ;
- les utilisateurs sont insérés avec mots de passe hashés ;
- le login fonctionne ;
- les rôles sont chargés et modifiables ;
- les guards fonctionnent ;
- les avis sont gérés ;
- les principaux domaines sont migrés vers repositories + IPC ;
- les fichiers utilitaires sont dans des dossiers cohérents ;
- les tests passent.

---

## Proposition de message de commit

    refactor: reorganize Electron main process, add role management and reviews