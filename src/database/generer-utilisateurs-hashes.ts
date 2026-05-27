import fs from 'node:fs';
import crypto from 'node:crypto';

function echapperSql(valeur: string): string {
  return valeur.replaceAll("'", "''");
}

function nettoyerValeurSql(valeur: string): string {
  return valeur.replaceAll("''", "'");
}

function hacherMotDePasse(motDePasse: string): { hash: string; saltHex: string } {
  const saltBuffer = crypto.randomBytes(16);

  const hash = crypto
    .pbkdf2Sync(motDePasse, saltBuffer, 100000, 64, 'sha512')
    .toString('hex');

  return {
    hash,
    saltHex: saltBuffer.toString('hex'),
  };
}

export function genererUtilisateursHashes(
  fichierSource: string,
  fichierDestination: string
): void {
  const contenu = fs.readFileSync(fichierSource, 'utf-8');

  const regex = /\('((?:''|[^'])*)', '((?:''|[^'])*)', '((?:''|[^'])*)', '((?:''|[^'])*)', randomblob\(16\)\)([,;])/g;

  let nombreUtilisateurs = 0;

  const contenuTransforme = contenu.replace(
    regex,
    (_match, nom, prenom, email, motDePasse, fin) => {
      const motDePasseClair = nettoyerValeurSql(motDePasse);
      const { hash, saltHex } = hacherMotDePasse(motDePasseClair);

      nombreUtilisateurs++;

      return `('${echapperSql(nettoyerValeurSql(nom))}', '${echapperSql(nettoyerValeurSql(prenom))}', '${echapperSql(nettoyerValeurSql(email))}', '${hash}', X'${saltHex}')${fin}`;
    }
  );

  fs.writeFileSync(fichierDestination, contenuTransforme, 'utf-8');

  console.log(`${nombreUtilisateurs} utilisateurs traités.`);
  console.log(`Fichier généré : ${fichierDestination}`);
}