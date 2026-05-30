import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { app } from 'electron';

function executerScriptsSql(database: Database.Database, dossier: string): void {
  const scripts = fs.readdirSync(dossier)
    .filter(file => file.endsWith('.sql'))
    .filter(file => file !== '07_insert_utilisateurs.sql')
    .sort();

  for (const script of scripts) {
    const scriptPath = path.join(dossier, script);
    const sql = fs.readFileSync(scriptPath, 'utf8');

    database.exec(sql);
  }
}

export function initialiserBaseDeDonnees(dbPath: string): void {
  const databaseDirectory = path.dirname(dbPath);

  if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
  }

  const databaseExiste = fs.existsSync(dbPath);

  if (databaseExiste) {
    return;
  }

  const database = new Database(dbPath);

  try {
    database.pragma('foreign_keys = ON');

    const schemaDirectory = path.join(app.getAppPath(), 'database', 'schema');
    const seedDirectory = path.join(app.getAppPath(), 'database', 'seed');

    executerScriptsSql(database, schemaDirectory);
    executerScriptsSql(database, seedDirectory);
  }
  finally {
    database.close();
  }
}