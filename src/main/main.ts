import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/client.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const dbPath = path.join( __dirname, '..', '..', 'database', 'graines.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the Angular app.
  mainWindow.loadURL('http://localhost:4200');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Fermeture propre de Prisma.
app.on('before-quit', async () => {
  await prisma.$disconnect();
});

ipcMain.handle('categories:get-all', async () => {
    return prisma.categorie.findMany({
      include: { _count: { select: { produit: true } } },
      orderBy: { nom_categorie: 'asc' }
    });
  }
);

ipcMain.handle('categories:get-by-id', async (_event, id: number) => {
    return prisma.categorie.findUnique({
      where: { id_categorie: id },
      include: { _count: { select: { produit: true } } }
    });
  }
);

ipcMain.handle('especes:get-all', async () => {
    return prisma.espece.findMany({
      include: { _count: { select: { variete: true } } },
      orderBy: { nom_commun: 'asc' },
    });
  }
);

ipcMain.handle('especes:create', async (_event,
  espece: {
    nom_scientifique: string;
    nom_commun: string;
    type_plante: string;
  }) => {
    const doublon = await prisma.espece.findFirst({
      where: {
        OR: [ { nom_commun: espece.nom_commun }, { nom_scientifique: espece.nom_scientifique } ],
      },
    });

    if (doublon) {
      throw new Error('DUPLICATE_ESPECE');
    }

    return prisma.espece.create({
      data: {
        nom_scientifique: espece.nom_scientifique,
        nom_commun: espece.nom_commun,
        type_plante: espece.type_plante,
      },
      include: { _count: { select: { variete: true } } },
    });
  }
);

// IPC : récupérer une espèce par son identifiant.
ipcMain.handle('especes:get-by-id', async (_event, 
  id: number) => {
    return prisma.espece.findUnique({
      where: { id_espece: id },
      include: { _count: { select: { variete: true } } },
    });
  }
);

// IPC : modifier une espèce.
ipcMain.handle('especes:update', async (_event, 
  espece: {
    id_espece: number;
    nom_scientifique: string;
    nom_commun: string;
    type_plante: string;
  }) => {
    const doublon = await prisma.espece.findFirst({
      where: {
        OR: [ { nom_commun: espece.nom_commun }, { nom_scientifique: espece.nom_scientifique } ],
        NOT: { id_espece: espece.id_espece },
      },
    });

    if (doublon) {
      throw new Error('DUPLICATE_ESPECE');
    }

    return prisma.espece.update({
      where: { id_espece: espece.id_espece },
      data: {
        nom_scientifique: espece.nom_scientifique,
        nom_commun: espece.nom_commun,
        type_plante: espece.type_plante,
      },
      include: { _count: { select: { variete: true } } }
    });
  }
);

// IPC : supprimer une espèce sans variétés associées.
ipcMain.handle(
  'especes:delete',
  async (_event, id: number) => {
    const nombreVarietes = await prisma.variete.count({
      where: { espece_id: id },
    });

    if (nombreVarietes > 0) {
      throw new Error('ESPECE_HAS_VARIETES');
    }

    return prisma.espece.delete({
      where: { id_espece: id },
      include: { _count: { select: { variete: true } } },
    });
  }
);

ipcMain.handle('produits:get-similaires', async (_event,
  id: number) => {
    const produit = await prisma.produit.findUnique({
      where: { id_produit: id },
      include: { variete: { include: { espece: true } } }
    });

    if (!produit) {
      return [];
    }

    return prisma.produit.findMany({
      where: { id_produit: { not: produit.id_produit },
        OR: [
          { categorie_id: produit.categorie_id },
          { variete: { espece_id: produit.variete.espece_id } },
          { variete: { espece: { type_plante: produit.variete.espece.type_plante } } },
          { variete: { cycle_de_vie: produit.variete.cycle_de_vie } },
        ],
      },
      include: { categorie: true, variete: { include: { espece: true } } },
      orderBy: { intitule: 'asc' },
      take: 6,
    });
  }
);

ipcMain.handle('categories:create', async (_event, categorie: {
    nom_categorie: string;
    descriptif: string | null;
  }) => {
    const doublon = await prisma.categorie.findFirst({
      where: { nom_categorie: categorie.nom_categorie },
    });

    if (doublon) {
      throw new Error('DUPLICATE_CATEGORY');
    }

    return prisma.categorie.create({
      data: {
        nom_categorie: categorie.nom_categorie,
        descriptif: categorie.descriptif,
      },
      include: { _count: { select: { produit: true } } },
    });
  }
);

ipcMain.handle('categories:update', async (_event, 
  categorie: {
    id_categorie: number;
    nom_categorie: string;
    descriptif: string | null;
  }) => {
    const doublon = await prisma.categorie.findFirst({
      where: { nom_categorie: categorie.nom_categorie,
        NOT: { id_categorie: categorie.id_categorie }
      },
    });

    if (doublon) {
      throw new Error('DUPLICATE_CATEGORY');
    }

    return prisma.categorie.update({
      where: { id_categorie: categorie.id_categorie },
      data: {
        nom_categorie: categorie.nom_categorie,
        descriptif: categorie.descriptif,
      },
      include: { _count: { select: { produit: true } } },
    });
  }
);

// IPC : supprimer une catégorie sans produits associés.
ipcMain.handle('categories:delete', async (_event, 
  id: number) => {
    const nombreProduits = await prisma.produit.count({
      where: { categorie_id: id },
    });

    if (nombreProduits > 0) {
      throw new Error('CATEGORY_HAS_PRODUCTS');
    }

    return prisma.categorie.delete({
      where: { id_categorie: id },
      include: { _count: { select: { produit: true } } }
    });
  }
);

// IPC : réaffecter les produits puis supprimer une catégorie.
ipcMain.handle('categories:delete-with-reaffectation', async (_event,
    idCategorieASupprimer: number, idCategorieDestination: number ) => {
    if (idCategorieASupprimer === idCategorieDestination) {
      throw new Error('SAME_CATEGORY');
    }

    const categorieDestination = await prisma.categorie.findUnique({
      where: { id_categorie: idCategorieDestination },
    });

    if (!categorieDestination) {
      throw new Error('DESTINATION_CATEGORY_NOT_FOUND');
    }

    await prisma.produit.updateMany({
      where: { categorie_id: idCategorieASupprimer },
      data: { categorie_id: idCategorieDestination },
    });

    return prisma.categorie.delete({
      where: { id_categorie: idCategorieASupprimer },
      include: { _count: { select: { produit: true } } },
    });
  }
);

// IPC : récupérer toutes les variétés.
ipcMain.handle('varietes:get-all', async () => {
    return prisma.variete.findMany({
      include: { espece: true, _count: { select: { produit: true } } },
      orderBy: { nom: 'asc' },
    });
  }
);

ipcMain.handle('varietes:get-by-id', async (_event,
  id: number) => {
    return prisma.variete.findUnique({
      where: { id_variete: id },
      include: { espece: true, _count: { select: { produit: true } } }
    });
  }
);

// IPC : créer une variété.
ipcMain.handle('varietes:create', async (_event, 
  variete: {
    espece_id: number;
    nom: string;
    descriptif: string | null;
    bio: number;
    cycle_jours: number | null;
    couleur_legume: string | null;
    taille_fixe_legume: number | null;
    taille_min_legume: number | null;
    taille_max_legume: number | null;
    espacement_entre_les_plants: number | null;
    espacement_entre_les_lignes: number | null;
    type_ensoleillement: string | null;
    type_feuillage: string | null;
    hauteur_adulte_min: number | null;
    hauteur_adulte_max: number | null;
    duree_de_germination: string | null;
    temperature_min_de_germination: number | null;
    cycle_de_vie: string | null;
    rusticite_plante: string | null;
    date_semis_min: string | null;
    date_semis_max: string | null;
    duree_avant_recolte: string | null;
    type_de_sol: string | null;
    conseil_plantation: string | null;
  }) => {
    const doublon = await prisma.variete.findFirst({
      where: { nom: variete.nom, espece_id: variete.espece_id }
    });

    if (doublon) {
      throw new Error('DUPLICATE_VARIETE');
    }

    return prisma.variete.create({
      data: variete,
      include: { espece: true, _count: { select: { produit: true } } },
    });
  }
);

// IPC : modifier une variété.
ipcMain.handle('varietes:update', async (_event, 
  variete: {
    id_variete: number;
    espece_id: number;
    nom: string;
    descriptif: string | null;
    bio: number;
    cycle_jours: number | null;
    couleur_legume: string | null;
    taille_fixe_legume: number | null;
    taille_min_legume: number | null;
    taille_max_legume: number | null;
    espacement_entre_les_plants: number | null;
    espacement_entre_les_lignes: number | null;
    type_ensoleillement: string | null;
    type_feuillage: string | null;
    hauteur_adulte_min: number | null;
    hauteur_adulte_max: number | null;
    duree_de_germination: string | null;
    temperature_min_de_germination: number | null;
    cycle_de_vie: string | null;
    rusticite_plante: string | null;
    date_semis_min: string | null;
    date_semis_max: string | null;
    duree_avant_recolte: string | null;
    type_de_sol: string | null;
    conseil_plantation: string | null;
  }) => {
    const doublon = await prisma.variete.findFirst({
      where: { nom: variete.nom, espece_id: variete.espece_id,
        NOT: { id_variete: variete.id_variete } }
    });

    if (doublon) {
      throw new Error('DUPLICATE_VARIETE');
    }

    return prisma.variete.update({
      where: { id_variete: variete.id_variete },
      data: {
        espece_id: variete.espece_id,
        nom: variete.nom,
        descriptif: variete.descriptif,
        bio: variete.bio,
        cycle_jours: variete.cycle_jours,
        couleur_legume: variete.couleur_legume,
        taille_fixe_legume: variete.taille_fixe_legume,
        taille_min_legume: variete.taille_min_legume,
        taille_max_legume: variete.taille_max_legume,
        espacement_entre_les_plants: variete.espacement_entre_les_plants,
        espacement_entre_les_lignes: variete.espacement_entre_les_lignes,
        type_ensoleillement: variete.type_ensoleillement,
        type_feuillage: variete.type_feuillage,
        hauteur_adulte_min: variete.hauteur_adulte_min,
        hauteur_adulte_max: variete.hauteur_adulte_max,
        duree_de_germination: variete.duree_de_germination,
        temperature_min_de_germination: variete.temperature_min_de_germination,
        cycle_de_vie: variete.cycle_de_vie,
        rusticite_plante: variete.rusticite_plante,
        date_semis_min: variete.date_semis_min,
        date_semis_max: variete.date_semis_max,
        duree_avant_recolte: variete.duree_avant_recolte,
        type_de_sol: variete.type_de_sol,
        conseil_plantation: variete.conseil_plantation,
      },
      include: { espece: true, _count: { select: { produit: true } } },
    });
  }
);

// IPC : supprimer une variété sans produits associés.
ipcMain.handle('varietes:delete', async (_event, 
  id: number) => {
    const nombreProduits = await prisma.produit.count({
      where: { variete_id: id } });

    if (nombreProduits > 0) {
      throw new Error('VARIETE_HAS_PRODUCTS');
    }

    return prisma.variete.delete({
      where: { id_variete: id },
      include: { espece: true, _count: { select: { produit: true } } },
    });
  }
);

ipcMain.handle('produits:get-all', async () => {
  return prisma.produit.findMany({
    include: { categorie: true, variete: { include: {  espece: true } } },
    orderBy: { intitule: 'asc' },
  });
});

ipcMain.handle('produits:get-by-categorie', async (_event, 
  categorieId: number) => {
    return prisma.produit.findMany({
      where: { categorie_id: categorieId },
      include: { categorie: true, variete: { include: { espece: true } } },
      orderBy: { intitule: 'asc' },
    });
  }
);

ipcMain.handle('produits:get-by-id', async (_event,
  id: number) => {
    return prisma.produit.findUnique({
      where: { id_produit: id },
      include: { categorie: true, variete: { include: { espece: true } },
      },
    });
  }
);

ipcMain.handle('produits:create', async (_event,
  produit: {
    intitule: string;
    prix_unitaire: number;
    quantite: number;
    categorie_id: number;
    variete_id: number;
  }) => {
    const doublon = await prisma.produit.findFirst({
      where: { intitule: produit.intitule, variete_id: produit.variete_id },
    });

    if (doublon) {
      throw new Error('DUPLICATE_PRODUCT');
    }

    return prisma.produit.create({
      data: {
        intitule: produit.intitule,
        prix_unitaire: produit.prix_unitaire,
        categorie_id: produit.categorie_id,
        variete_id: produit.variete_id,
      },
      include: { categorie: true, variete: { include: { espece: true } } },
    });
  }
);

ipcMain.handle('produits:update', async (_event,
  produit: {
    id_produit: number;
    intitule: string;
    prix_unitaire: number;
    quantite: number;
    categorie_id: number;
    variete_id: number;
  }) => {
    const doublon = await prisma.produit.findFirst({
      where: { intitule: produit.intitule, variete_id: produit.variete_id,
        NOT: { id_produit: produit.id_produit },
      },
    });

    if (doublon) {
      throw new Error('DUPLICATE_PRODUCT');
    }

    return prisma.produit.update({
      where: { id_produit: produit.id_produit },
      data: {
        intitule: produit.intitule,
        prix_unitaire: produit.prix_unitaire,
        quantite: produit.quantite,
        categorie_id: produit.categorie_id,
        variete_id: produit.variete_id,
      },
      include: { categorie: true, variete: { include: { espece: true } } },
    });
  }
);

ipcMain.handle('produits:delete', async (_event,
  id: number) => {
    return prisma.produit.delete({
      where: { id_produit: id, },
      include: { categorie: true, variete: { include: { espece: true } } },
    });
  }
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.