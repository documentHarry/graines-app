# Commit message

## Résumé

Finalisation des tests renderer Angular, stabilisation des dépendances Electron/Prisma, et ajout de la documentation d'installation.

## Changements principaux

- Ajout et mise à jour des tests unitaires du renderer Angular.
- Couverture des composants de navigation, connexion, avis, produits, catégories, espèces, variétés, utilisateurs et propriétés médicinales.
- Mise à jour des tests des services Angular utilisant `ElectronService`.
- Vérification des routes protégées, des rôles, des formulaires, des filtres et des messages d'erreur.
- Suppression de l'idée de tests backend/repository/ipc pour éviter une configuration Vitest séparée non prévue dans le main process Electron.
- Stabilisation des dépendances critiques dans `package.json`.
- Fixation des versions sensibles pour éviter les incompatibilités :
  - Electron
  - Electron Forge
  - Prisma
  - better-sqlite3
- Mise à jour de la logique autour du packaging Electron Forge.
- Conservation et clarification du rôle de `forge.config.ts`.
- Copie explicite des dossiers et dépendances nécessaires au packaging :
  - `database/`
  - `better-sqlite3`
  - `bindings`
  - `file-uri-to-path`
  - `@prisma`
- Vérification de la création automatique de la base SQLite au premier lancement.
- Documentation du rôle des scripts SQL présents dans :
  - `database/schema/`
  - `database/seed/`
- Mise à jour du `.gitignore` pour exclure les fichiers générés tout en conservant les fichiers nécessaires au lancement.
- Ajout d'un guide d'installation Markdown pour expliquer l'installation, le lancement, Prisma, SQLite et Electron Forge.

## Tests

- Tests unitaires du renderer Angular mis à jour.
- Tests des composants principaux ajoutés ou corrigés.
- Tests des services Angular ajoutés avec mocks de `ElectronService`.
- Tests backend/repository/ipc non ajoutés volontairement, car ils nécessitent une configuration dédiée au main process Electron.

## Notes

La base de données SQLite est créée automatiquement au premier lancement de l'application si elle n'existe pas encore.

Les versions des dépendances importantes sont fixées afin d'éviter les problèmes de compatibilité rencontrés avec des versions plus récentes.

Le projet doit être installé avec `npm install` à partir des fichiers `package.json` et `package-lock.json` fournis.
