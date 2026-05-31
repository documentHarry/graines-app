## Résumé

Ajout de la documentation projet, des diagrammes de base de données et correction de la protection des boutons selon les rôles.

## Changements principaux

- Ajout du fichier `README.md`.
- Ajout du fichier `GUIDE_INSTALLATION.md`.
- Ajout de deux diagrammes de base de données dans `database/diagram/` :
  - `graine-app-erd-diagram.png`
  - `graine-app-erd-diagram.svg`
- Documentation de l'installation du projet :
  - installation des dépendances Electron ;
  - installation des dépendances Angular ;
  - génération Prisma ;
  - lancement avec Electron Forge ;
  - création automatique de la base SQLite ;
  - comptes de test par rôle.
- Documentation du fonctionnement général de l'application :
  - application interne Angular + Electron ;
  - base locale SQLite ;
  - absence de commande et de paiement ;
  - gestion du catalogue, des utilisateurs, des rôles, des produits et des avis.
- Ajout des liens vers les diagrammes ERD dans le `README.md`.
- Correction de la visibilité des boutons selon les rôles utilisateur.
- Masquage du bouton `Ajouter un produit` pour les utilisateurs ayant uniquement le rôle `CLIENT`.
- Masquage des boutons `Modifier` et `Supprimer` sur le détail produit pour les utilisateurs non autorisés.
- Restriction visuelle des actions de gestion produit aux rôles :
  - `ADMIN`
  - `GESTIONNAIRE_CATALOGUE`

## Sécurité et rôles

Les boutons liés à la gestion du catalogue produit sont maintenant cohérents avec les droits applicatifs.

Un utilisateur `CLIENT` peut consulter les produits et les détails, mais ne voit plus les actions réservées à la gestion du catalogue.

Les rôles `ADMIN` et `GESTIONNAIRE_CATALOGUE` conservent l'accès aux actions de création, modification et suppression des produits.

## Documentation

Le guide d'installation explique comment lancer l'application à partir d'un dépôt GitHub ou d'une archive ZIP.

Le README présente l'application et contient les liens vers les diagrammes de base de données.
