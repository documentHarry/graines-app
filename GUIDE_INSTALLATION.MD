# Guide d'installation - Graines App

## Prérequis

Installer :

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
cd graines-app
```

Installer les dépendances du projet Electron :

```bash
npm install
```

Installer les dépendances du renderer Angular :

```bash
cd renderer/app
npm install
cd ../..
```

Générer Prisma :

```bash
npx prisma generate
```

Lancer l'application :

```bash
npm start
```

## Base de données

L'application utilise SQLite avec `better-sqlite3`.

La base de données est créée automatiquement au premier lancement si elle n'existe pas encore.

Les scripts nécessaires sont dans :

```txt
database/schema/
database/seed/
```

Ces dossiers doivent rester présents dans le projet.

## Versions

Les versions importantes sont fixées dans `package.json` et `package-lock.json`.

Il ne faut pas mettre à jour manuellement :

- Electron
- Electron Forge
- Prisma
- better-sqlite3

L'application a été testée avec ces versions.

## Electron Forge

Le projet utilise Electron Forge.

Le fichier de configuration est :

```txt
forge.config.ts
```

Ce fichier est nécessaire pour copier les éléments utilisés par SQLite, Prisma et `better-sqlite3` lors du packaging.

## Packaging

Pour générer une version packagée :

```bash
npm run package
```

Le résultat est créé dans le dossier :

```txt
out/
```

## Comptes de test

Tous les utilisateurs disposent du rôle `CLIENT`.

Les comptes suivants permettent de tester les rôles principaux de l'application :

| Rôle principal | Nom | Email | Mot de passe |
|---|---|---|---|
| ADMIN | Thomas Huys | jthomas@example.org | `&o)FpKqbK0` |
| GESTIONNAIRE_CATALOGUE | Hilde Roosen | daan27@example.org | `iFVsP9Ma(6` |
| MODERATEUR | Eric De Muynck | inge37@example.net | `%d6Sj*8g&y` |
| CLIENT | Ludivine Duchesne | mariannesimon@example.org | `r%K4Ncv1x(` |

Le compte `ADMIN` permet de tester la gestion des utilisateurs et des rôles.

Le compte `GESTIONNAIRE_CATALOGUE` permet de tester les pages de gestion du catalogue : catégories, espèces, variétés, produits et propriétés médicinales.

Le compte `MODERATEUR` permet de tester la page de modération des avis.

Le compte `CLIENT` permet de tester la consultation du catalogue et les fonctionnalités liées aux avis produits.