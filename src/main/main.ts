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
      include: { _count: { select: { produit: true } } },
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

ipcMain.handle('varietes:get-all', async () => {
  return prisma.variete.findMany({
    include: { espece: true },
    orderBy: { nom: 'asc' },
  });
});

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