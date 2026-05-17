Gestion complète des catégories de produits

## Objectif

Finalisation de la fonctionnalité de gestion des catégories de produits dans l'application Electron / Angular.

Cette fonctionnalité permet de consulter, créer, modifier et supprimer des catégories, tout en respectant les contraintes de la base de données.

## Fonctionnalités ajoutées

- Affichage des catégories sous forme de cartes
- Affichage du nombre de produits associés à chaque catégorie
- Création d'une catégorie
- Modification d'une catégorie
- Suppression d'une catégorie sans produit associé
- Suppression d'une catégorie avec réaffectation des produits
- Annulation de la suppression
- Accès aux produits d'une catégorie depuis la liste des catégories

## Contraintes métier respectées

La table produit impose qu'un produit appartienne toujours à une catégorie.

La suppression d'une catégorie utilisée par des produits nécessite donc une réaffectation préalable vers une autre catégorie.

Cette règle évite d'avoir des produits sans catégorie dans le catalogue.

## Communication Electron / Angular

La communication suit toujours l'architecture du projet :

Angular
→ Services Angular
→ window.api
→ Preload Electron
→ IPC
→ Main process Electron
→ Prisma
→ SQLite

Les opérations catégories passent par IPC :

- récupération des catégories
- récupération d'une catégorie par identifiant
- création d'une catégorie
- modification d'une catégorie
- suppression d'une catégorie
- suppression avec réaffectation des produits

## Gestion des erreurs

Des contrôles ont été ajoutés pour gérer les cas suivants :

- catégorie introuvable
- nom de catégorie déjà existant
- suppression impossible si des produits sont associés
- catégorie de réaffectation obligatoire
- annulation de la suppression

## Interface utilisateur

La page catégories a été retravaillée avec :

- cartes responsives
- compteur de produits par catégorie
- badge grisé si aucun produit n'est associé
- actions de consultation, modification et suppression
- navigation vers les produits filtrés par catégorie

## Tests

Les tests Angular liés à la fonctionnalité catégories ont été exécutés avec succès.

Les tests couvrent notamment :

- création des composants
- validation des formulaires
- chargement des catégories
- modification de catégorie
- suppression de catégorie
- navigation principale liée aux catégories

Les tests ont été exécutés avec :

- npm test

Le build Angular a été vérifié avec :

- npx ng build