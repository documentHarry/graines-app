# Travaux réalisés

## Refactoring de l'architecture Angular

- Déplacement de la logique métier restante des composants vers les services.
- Centralisation des traitements de filtrage dans les services dédiés.
- Centralisation de la construction des objets CreateInput et UpdateInput dans les services.
- Réduction de la responsabilité des composants au chargement des données et à la gestion de l'interface utilisateur.
- Harmonisation de la structure des services de l'application.

## Simplification des types et du code TypeScript

- Suppression de plusieurs types intermédiaires de formulaires devenus inutiles.
- Utilisation de types inline cohérents avec le reste du projet.
- Nettoyage des méthodes de construction des objets utilisés par Prisma.
- Uniformisation du style de codage dans les repositories et services.

## Refonte de la gestion des droits d'accès

- Vérification de l'ensemble des pages de l'application.
- Protection des actions d'administration par rôle.
- Restriction des opérations de création, modification et suppression aux rôles autorisés.
- Validation de la cohérence entre les routes, les composants et les contrôles d'accès de l'interface.

## Simplification de la couche Prisma

- Réécriture et simplification de plusieurs repositories.
- Suppression de constantes intermédiaires inutiles dans les requêtes Prisma.
- Explicitation des champs transmis aux opérations create et update.
- Harmonisation des repositories selon une structure commune.

## Refonte de la gestion des aromates

- Simplification du repository Aromate.
- Suppression de la logique transactionnelle devenue inutile.
- Simplification des IPC liés aux aromates.
- Réorganisation de la gestion des propriétés médicinales associées aux aromates.
- Vérification complète des composants Angular liés aux aromates.

## Nettoyage fonctionnel

- Suppression de la fonctionnalité de produits similaires.
- Suppression de la table Avis et de ses éléments associés.
- Suppression du code devenu obsolète suite aux simplifications du modèle.
- Nettoyage général des composants, services et templates.

## Simplification de l'architecture

- Suppression progressive des mécanismes trop complexes ou peu pertinents pour le contexte du projet.
- Réduction du nombre de requêtes complexes.
- Suppression des fonctionnalités annexes apportant peu de valeur métier.
- Simplification des flux CRUD afin d'améliorer la lisibilité et la maintenabilité du code.
- Recherche systématique de solutions plus simples à expliquer et à maintenir dans le cadre de l'examen.

## Validation de l'interface utilisateur

- Vérification de la cohérence des pages de détail.
- Vérification des formulaires d'ajout, modification et suppression.
- Vérification des composants de filtres.
- Vérification des listes, cartes de détail et messages utilisateur.
- Harmonisation des comportements entre les différents modules de l'application.

## Gestion de l'authentification

- Migration du stockage utilisateur vers Session Storage.
- Préparation de la déconnexion automatique après inactivité.
- Préparation de la déconnexion lors de la fermeture de l'application.

## Stabilisation du projet

- Relecture complète de nombreux composants Angular.
- Vérification des relations Prisma.
- Vérification des flux CRUD principaux.
- Nettoyage du code avant livraison et préparation du commit final.
