import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { initialiserBaseDeDonnees } from '../database/init-database';
import { genererUtilisateursHashes } from '../database/generer-utilisateurs-hashes';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/client.js';

import { AuthRepository } from '../repository/auth.repository';
import { CategorieRepository } from '../repository/categorie.repository';
import { EspeceRepository } from '../repository/espece.repository';
import { AromateRepository } from '../repository/aromate.repository';
import { VarieteRepository } from '../repository/variete.repository';
import { ProprieteMedicinaleRepository } from '../repository/propriete-medicinale.repository';
import { ProduitRepository } from '../repository/produit.repository';
import { AvisRepository } from '../repository/avis.repository';
import { UtilisateurRepository } from '../repository/utilisateur.repository';
import { LocaliteRepository } from '../repository/localite.repository';
import { AdresseLivraisonRepository } from '../repository/adresse-livraison.repository';
import { RoleRepository } from '../repository/role.repository';
import { UtilisateurRoleRepository } from '../repository/utilisateur-role.repository';

import { enregistrerAuthIpc } from '../ipc/auth.ipc';
import { enregistrerCategorieIpc } from '../ipc/categorie.ipc';
import { enregistrerEspeceIpc } from '../ipc/espece.ipc';
import { enregistrerVarieteIpc } from '../ipc/variete.ipc';
import { enregistrerProprieteMedicinaleIpc } from '../ipc/propriete-medicinale.ipc';
import { enregistrerProduitIpc } from '../ipc/produit.ipc';
import { enregistrerAvisIpc } from '../ipc/avis.ipc';
import { enregistrerUtilisateurIpc } from '../ipc/utilisateur.ipc';
import { enregistrerLocaliteIpc } from '../ipc/localite.ipc';
import { enregistrerAdresseLivraisonIpc } from '../ipc/adresse-livraison.ipc';
import { enregistrerRoleIpc } from '../ipc/role.ipc';
import { enregistrerUtilisateurRoleIpc } from '../ipc/utilisateur-role.ipc';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const dbPath = path.join( __dirname, '..', '..', 'database', 'graines.db');
const databaseExiste = fs.existsSync(dbPath);

if (!databaseExiste) {
  const utilisateursSourcePath = path.join( __dirname, '..', '..', 'database', 'seed', '07_insert_utilisateurs.sql');
  const utilisateursHashesPath = path.join( __dirname, '..', '..', 'database', 'seed', '07_insert_utilisateurs_hashes.sql');
  genererUtilisateursHashes( utilisateursSourcePath, utilisateursHashesPath);
}

initialiserBaseDeDonnees(dbPath);
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

const authRepository = new AuthRepository(prisma);
const categorieRepository = new CategorieRepository(prisma);
const especeRepository = new EspeceRepository(prisma);
const varieteRepository = new VarieteRepository(prisma);
const aromateRepository = new AromateRepository();
const proprieteMedicinaleRepository = new ProprieteMedicinaleRepository(prisma);
const produitRepository = new ProduitRepository(prisma);
const utilisateurRepository = new UtilisateurRepository(prisma);
const localiteRepository = new LocaliteRepository(prisma);
const adresseLivraisonRepository = new AdresseLivraisonRepository(prisma);
const roleRepository = new RoleRepository(prisma);
const utilisateurRoleRepository = new UtilisateurRoleRepository(prisma);
const avisRepository = new AvisRepository(prisma);

enregistrerAuthIpc(authRepository);
enregistrerCategorieIpc(categorieRepository);
enregistrerEspeceIpc(especeRepository);
enregistrerVarieteIpc(varieteRepository, aromateRepository);
enregistrerProprieteMedicinaleIpc(proprieteMedicinaleRepository);
enregistrerProduitIpc(produitRepository);
enregistrerUtilisateurIpc(utilisateurRepository);
enregistrerLocaliteIpc(localiteRepository);
enregistrerAdresseLivraisonIpc(adresseLivraisonRepository);
enregistrerRoleIpc(roleRepository);
enregistrerUtilisateurRoleIpc(utilisateurRoleRepository);
enregistrerAvisIpc(avisRepository);

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