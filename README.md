# Graines App

## Description

Graines App est une application de bureau développée avec Angular et Electron. Elle utilise une base de données SQLite locale afin de gérer un catalogue de graines, de variétés végétales, d'aromates, de propriétés médicinales, de produits et d'utilisateurs.

L'application est destinée à un usage interne. Elle ne propose ni système de commande, ni panier, ni paiement en ligne. Les informations relatives aux produits servent uniquement à la gestion et à la consultation du catalogue.

## Objectif de l'application

L'objectif de Graines App est de fournir une application de gestion permettant de centraliser les informations botaniques, commerciales et utilisateurs dans une base de données locale SQLite.

L'application permet notamment :

- la gestion des utilisateurs et de leurs rôles
- la gestion des catégories de produits
- la gestion des espèces végétales
- la gestion des variétés
- la gestion des aromates
- la gestion des propriétés médicinales
- la gestion des produits
- la gestion des localités et adresses associées aux utilisateurs

## Technologies utilisées

- Angular
- Electron
- SQLite
- better-sqlite3
- Prisma
- Electron Forge
- TypeScript

## Prérequis

Installer les logiciels suivants :

- Node.js
- npm
- Git

Vérifier l'installation :

```bash
node -v
npm -v
git --version
```

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/documentHarry/graines-app.git
cd graines-app-main
```

Installer les dépendances du projet Electron :

```bash
npm install
```

Installer les dépendances Angular :

```bash
cd renderer/app
npm install
cd ../..
```

Générer le client Prisma :

```bash
npx prisma generate
```

## Lancement de l'application

Depuis la racine du projet :

```bash
npm start
```

Cette commande construit automatiquement l'application Angular puis lance l'application Electron.

## Electron Forge

Le projet utilise Electron Forge pour le lancement de l'application.

La configuration est définie dans :

```txt
forge.config.ts
```

Cette configuration permet notamment d'inclure les dépendances nécessaires à Prisma, SQLite et better-sqlite3.

## Base de données

L'application utilise SQLite avec Prisma et better-sqlite3.

La base de données est créée automatiquement au premier lancement si elle n'existe pas encore.

Les scripts SQL nécessaires sont stockés dans les dossiers :

```txt
database/schema
database/seed
```

Ces dossiers doivent rester présents dans le projet.

## Diagrammes de base de données

Les diagrammes sont disponibles dans :

```txt
database/diagram/
```

- graine-app-erd-diagram.png
- graine-app-erd-diagram.svg

## Comptes de test

| Rôle | Email | Mot de passe |
|--------|--------|--------|
| ADMIN | jthomas@example.org | &o)FpKqbK0 |
| GESTIONNAIRE_CATALOGUE | daan27@example.org | iFVsP9Ma(6 |
| CLIENT | mariannesimon@example.org | r%K4Ncv1x( |

Le compte administrateur permet de tester l'ensemble des fonctionnalités de l'application.

## Gestion des utilisateurs et des rôles

L'application utilise un système d'authentification avec gestion des rôles.

Les rôles disponibles sont :

- ADMIN
- GESTIONNAIRE_CATALOGUE
- CLIENT

Les routes Angular ainsi que les actions de gestion sont protégées selon les rôles de l'utilisateur connecté.

### ADMIN

L'administrateur dispose de tous les droits sur l'application, notamment :

- gestion des utilisateurs
- gestion des rôles
- gestion du catalogue

### GESTIONNAIRE_CATALOGUE

Le gestionnaire catalogue peut gérer :

- les catégories
- les espèces
- les variétés
- les aromates
- les propriétés médicinales
- les produits

### CLIENT

Le client dispose uniquement des fonctionnalités de consultation autorisées.

## Gestion du catalogue

Le catalogue est organisé autour des entités suivantes :

- catégories
- espèces
- variétés
- aromates
- propriétés médicinales
- produits

### Catégories

Les catégories permettent de regrouper les produits.

### Espèces

Les espèces contiennent notamment :

- un nom commun
- un nom scientifique

### Variétés

Chaque variété est associée à une espèce et possède de nombreuses informations descriptives :

- caractère biologique
- cycle de vie
- durée de germination
- périodes de semis
- type de sol
- type d'ensoleillement
- espacements
- conseils de plantation
- informations de récolte

### Aromates

Certaines variétés peuvent être associées à des informations aromatiques :

- partie utilisée
- propriété
- usage culinaire
- propriétés médicinales associées

### Produits

Les produits sont associés à une catégorie et à une variété.

Ils possèdent notamment :

- un intitulé
- un prix
- une quantité disponible
- une description
- une image éventuelle
