# Description de l'application

Graines App est une application de gestion interne développée avec Angular et Electron. Elle utilise une base de données locale SQLite afin de permettre la gestion d'un catalogue de graines, de variétés végétales, de produits et d'avis utilisateurs.

L'application est destinée à un usage interne. Elle ne propose pas de système de commande, de panier ou de paiement en ligne. Les prix et les quantités des produits sont uniquement utilisés à des fins de gestion du catalogue et de consultation interne.

## Objectif de l'application

L'objectif de Graines App est de fournir une application de bureau simple et structurée pour gérer un catalogue interne de graines et de produits associés. L'application centralise les informations botaniques, commerciales et utilisateurs dans une base SQLite locale, tout en proposant une interface Angular organisée par pages, formulaires et filtres multicritères.


## Technologies utilisées

L'application repose sur les technologies suivantes :

* Angular pour l'interface utilisateur
* Electron pour l'exécution de l'application sous forme d'application de bureau
* SQLite pour la base de données locale
* better-sqlite3 pour l'accès à la base de données
* Prisma pour la couche d'accès aux données
* Electron Forge pour le lancement et le packaging de l'application

## Fonctionnement général

Au premier lancement, l'application crée automatiquement sa base de données SQLite si celle-ci n'existe pas encore. Les scripts SQL de création et d'initialisation sont stockés dans les dossiers `database/schema` et `database/seed`.

L'application permet de gérer plusieurs grands ensembles de données :

* les utilisateurs
* les rôles
* les localités et adresses de livraison
* les catégories de produits
* les espèces végétales
* les variétés
* les aromates et leurs propriétés médicinales
* les produits
* les avis déposés sur les produits

## Gestion des utilisateurs et des rôles

L'application utilise un système de rôles afin de protéger certaines pages et certaines actions.

Les rôles utilisés sont :

* `ADMIN`
* `GESTIONNAIRE_CATALOGUE`
* `MODERATEUR`
* `CLIENT`

Un administrateur peut gérer les utilisateurs et leurs rôles. Les utilisateurs peuvent être actifs ou inactifs. Chaque utilisateur peut également posséder une ou plusieurs adresses de livraison. Ces adresses servent à gérer les informations associées à l'utilisateur, mais elles ne sont pas utilisées pour passer une commande dans l'application.

## Gestion du catalogue

Le catalogue est structuré autour de plusieurs entités :

* les catégories
* les espèces
* les variétés
* les produits

## Diagrammes de base de données

- [Diagramme ERD au format PNG](database/diagram/graine-app-erd-diagram.png)
- [Diagramme ERD au format SVG](database/diagram/graine-app-erd-diagram.svg)

### Organisation des tables

Une catégorie permet de regrouper les produits. Une espèce représente une plante au sens botanique, avec un nom commun et un nom scientifique. Une variété est rattachée à une espèce et contient des informations détaillées comme le caractère bio, le cycle de vie, les conseils de plantation, le type de sol, l'ensoleillement, les espacements de plantation ou encore les périodes de semis.

Les produits sont rattachés à une catégorie et à une variété. Ils possèdent un intitulé, un prix unitaire, une quantité disponible et éventuellement une image. Ces informations permettent de présenter et gérer le catalogue, sans fonctionnalité de vente ou de paiement.

## Gestion des aromates et propriétés médicinales

Certaines variétés peuvent être associées à des informations aromatiques. Une variété peut donc être décrite comme aromate grâce à des informations telles que :

* la partie utilisée
* les propriétés
* l'usage culinaire
* les propriétés médicinales associées

Les propriétés médicinales sont gérées séparément afin de pouvoir être associées à différents aromates.

## Gestion des avis

Les utilisateurs peuvent déposer des avis sur les produits. Un avis contient une note, un titre, un commentaire, une date de dépôt, un statut et un nombre de mentions "J'aime".

Les statuts possibles d'un avis sont :

* `nouveau`
* `modifié`
* `supprimé`

La page de détail d'un produit affiche les avis liés à ce produit. Les clients peuvent ajouter un avis, modifier leur propre avis et supprimer leur propre avis selon les droits prévus. Les administrateurs disposent également de droits étendus.

Une page générale de modération permet aux modérateurs et aux administrateurs de consulter les avis et de supprimer ceux qui doivent être retirés. Cette page est protégée par les rôles.

## Protection des pages

La navigation et les routes sont protégées selon les rôles de l'utilisateur connecté. Les pages publiques permettent la consultation du catalogue, tandis que les pages de gestion sont réservées aux rôles autorisés.

Le gestionnaire catalogue intervient principalement sur les données du catalogue : catégories, espèces, variétés, produits et propriétés médicinales.

Le modérateur intervient principalement sur la modération des avis.

L'administrateur dispose des droits les plus larges, notamment sur la gestion des utilisateurs et des rôles.

