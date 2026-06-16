Finalise la configuration de lancement et la documentation

- Mise à jour du README avec une procédure d'installation unique et testée.
- Suppression de l'ancien guide d'installation séparé.
- Ajout d'une procédure de lancement simplifiée avec `npm start`.
- Adaptation du build Angular pour un chargement local dans Electron.
- Modification du `base href` Angular pour permettre le chargement depuis les fichiers générés.
- Mise à jour du chargement Electron vers le build Angular généré.
- Ajustement de la configuration Electron Forge pour inclure les dépendances nécessaires à SQLite, Prisma et better-sqlite3.
- Vérification de l'installation complète depuis une copie propre du projet.
- Validation de la génération Prisma, du build Angular et du lancement Electron.