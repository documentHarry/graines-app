# Commit message

## Résumé

Ajout et amélioration de plusieurs fonctionnalités de gestion dans l’application : filtres multi-critères, gestion des adresses utilisateur, propriétés médicinales, rôles, dates, navigation et ajustements CSS.

## Détails des changements

### Produits

- Ajout d’un panneau latéral de filtres multi-critères pour la page produits.
- Ajout de filtres par recherche, stock, catégorie, variété, espèce, aromate et fourchette de prix.
- Ajout d’un bouton de réinitialisation des filtres.
- Maintien du panneau de filtres visible même lorsqu’aucun produit ne correspond aux critères.
- Ajout de sécurités sur les prix minimum et maximum selon les valeurs disponibles en base de données.
- Harmonisation du style de la page produits : titre, bouton d’ajout, alignements, couleurs et hauteur du panneau de filtres.
- Correction de l’affichage des avis sur la page détail produit.
- Ajout du chargement des avis liés au produit.
- Correction de l’intégration IPC/preload/service pour `getAvisByProduit`.
- Ajustement CSS des commentaires, likes et liens de détail.

### Catégories

- Ajout de recherches sur la page catégories.
- Ajout d’une recherche par nom de catégorie.
- Ajout d’une recherche par descriptif.
- Alignement du bouton d’ajout et des champs de recherche sur une même ligne.
- Harmonisation des couleurs des champs de recherche avec le style des cartes.
- Suppression du style avec labels inutiles au profit de placeholders dans les inputs.

### Espèces

- Ajout d’une recherche par nom commun.
- Ajout d’une recherche par nom scientifique.
- Alignement du titre, du bouton d’ajout et des champs de recherche.
- Harmonisation du style avec la page catégories.
- Ajustement des largeurs de champs et suppression des marges inutiles.

### Variétés

- Ajout d’un composant enfant pour les filtres de variétés.
- Ajout d’un panneau latéral gauche de filtres multi-critères.
- Ajout de filtres par nom, bio, type aromate/légume, espèce, ensoleillement et cycle de vie.
- Ajout d’un bouton de réinitialisation des filtres.
- Correction de la détection des aromates dans la liste des variétés.
- Remplacement de la condition incorrecte basée sur `aromate != null` par une vérification de longueur du tableau `aromate`.
- Harmonisation du CSS du panneau de filtres avec celui de la page produits.

### Utilisateurs

- Ajout de l’affichage des rôles dans la fiche détaillée utilisateur.
- Ajout de `utilisateur_role` dans le type `Utilisateur`.
- Ajout du chargement des rôles dans `UtilisateurRepository.getById`.
- Amélioration de la page de modification des rôles.
- Ajout d’un CSS dédié pour la page de modification des rôles.
- Ajout d’un bouton annuler stylisé.
- Réduction et simplification de la liste des rôles utilisés dans l’application.
- Suppression des rôles devenus inutiles après réduction du périmètre fonctionnel.
- Préparation d’un composant enfant pour les filtres utilisateurs.
- Ajout d’un panneau latéral de filtres utilisateurs.
- Ajout de filtres par nom, prénom, email, statut, rôle et présence d’adresse.
- Ajout du chargement des rôles dans `UtilisateurRepository.getAll` pour permettre le filtrage par rôle.
- Alignement du titre `Utilisateurs` et du bouton `Ajouter un utilisateur` sur une même ligne.
- Harmonisation du style de la page utilisateurs avec la page produits.

### Adresses de livraison

- Ajout de la création d’adresse de livraison depuis la fiche détaillée utilisateur.
- Ajout de la modification d’adresse de livraison depuis la fiche détaillée utilisateur.
- Conservation de la suppression d’adresse existante.
- Ajout d’un formulaire intégré pour l’ajout et la modification d’adresse.
- Ajout du chargement des localités pour sélectionner une localité dans le formulaire.
- Extraction de la gestion des adresses dans un composant enfant dédié.
- Réduction de la complexité du composant `utilisateur-detail`.
- Ajout d’un composant `utilisateur-adresses` / `utilisateur-adresse-livraison`.
- Déplacement du HTML, du TypeScript et du CSS liés aux adresses vers le composant enfant.
- Ajout d’événements pour notifier le parent après création, modification ou suppression d’adresse.
- Ajout d’un affichage d’erreur transmis au parent.
- Ajustements CSS : titre orange, espacement entre les boutons modifier/supprimer, bouton annuler stylisé.

### Propriétés médicinales

- Ajout d’une page dédiée à la gestion des propriétés médicinales.
- Ajout d’une liste des propriétés médicinales.
- Ajout de la création d’une propriété médicinale.
- Ajout de la modification d’une propriété médicinale.
- Ajout de la suppression d’une propriété médicinale.
- Ajout d’un formulaire intégré pour l’ajout et la modification.
- Ajout d’un champ de recherche en haut de page.
- Ajout du filtrage par nom de propriété médicinale.
- Ajout du service Angular `ProprieteMedicinaleService` avec `get`, `create`, `update` et `delete`.
- Ajout des méthodes correspondantes dans `ElectronAPI`.
- Ajout des appels correspondants dans `preload.ts`.
- Ajout des handlers IPC pour `create`, `update` et `delete`.
- Ajout des méthodes `create`, `update` et `delete` dans le repository.
- Ajout d’une route `/proprietes-medicinales`.
- Ajout du lien de navigation vers les propriétés médicinales.
- Ajout d’une confirmation avant suppression car la suppression retire aussi les liens avec les aromates associés.

### Avis

- Ajout de l’affichage des avis dans la page détail produit.
- Ajout du service et de l’appel permettant de récupérer les avis d’un produit.
- Correction de l’erreur liée à une méthode manquante dans le preload/API Electron.
- Ajout de l’affichage du titre, de la note, de l’auteur, du commentaire et du nombre de likes.
- Ajustements CSS pour améliorer la lisibilité des commentaires et des likes.

### Dates et SQLite/Prisma

- Correction du problème d’affichage littéral de `CURRENT_TIMESTAMP` dans les dates.
- Ajout d’une date explicite dans les repositories lors des créations via Prisma.
- Harmonisation du format de date au format SQLite `YYYY-MM-DD HH:mm:ss`.
- Application du format dans les créations utilisateur, produit et avis.
- Correction des anciennes données avec des formats de dates différents.
- Clarification de l’emplacement réel de la base SQLite Electron dans `AppData/Roaming/graines-app`.
- Régénération du schéma Prisma depuis la base SQLite réelle utilisée par l’application.
- Réduction du schéma aux tables réellement conservées dans l’application.

### Base de données et schéma

- Nettoyage du périmètre de la base de données.
- Conservation des tables utiles au périmètre actuel de l’application.
- Correction d’une erreur SQL potentielle dans la table `produit` concernant une virgule manquante entre deux clés étrangères.
- Vérification du comportement `ON DELETE CASCADE` sur `aromate_propriete` lors de la suppression d’une propriété médicinale.

### Navigation et accueil

- Suppression fonctionnelle de la page d’accueil inutile.
- Redirection de la route racine vers la page catégories.
- Suppression du lien `Accueil` de la navigation.
- Conservation de la page catégories comme point d’entrée principal de l’application.

### CSS et cohérence visuelle

- Harmonisation globale des couleurs entre les pages.
- Réutilisation des couleurs principales : orange, beige clair, brun et rouge pour les actions destructives.
- Alignement des titres et boutons d’ajout sur plusieurs pages.
- Ajout de styles cohérents pour les formulaires, boutons, cartes, champs de recherche et panneaux de filtres.
- Amélioration de la lisibilité des titres, labels, placeholders et liens d’action.
- Ajout d’espacements entre boutons d’action.
- Stylisation des boutons annuler, supprimer, modifier et enregistrer.

## Impact technique

- Ajout de plusieurs composants enfants pour alléger les composants principaux.
- Meilleure séparation des responsabilités entre affichage principal et formulaires/filtres.
- Extension des types partagés Electron/Angular.
- Extension du preload Electron.
- Extension des handlers IPC.
- Extension des repositories Prisma.
- Extension des services Angular.
- Amélioration de la cohérence entre frontend, IPC, preload, services et repositories.

## Notes

- Après modification du preload, des repositories ou du main process Electron, l’application doit être relancée complètement.
- Le filtre par rôle utilisateur nécessite que `UtilisateurRepository.getAll()` charge aussi `utilisateur_role` avec `role`.
- Les suppressions de propriétés médicinales retirent automatiquement les associations avec les aromates grâce au `ON DELETE CASCADE`.
