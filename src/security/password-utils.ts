import crypto from 'node:crypto';

export function hacherMotDePasse(motDePasse: string): { hash: string; salt: Uint8Array<ArrayBuffer> } {
  const saltBuffer = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(motDePasse, saltBuffer, 100000, 64, 'sha512').toString('hex');
  const salt = new Uint8Array(new ArrayBuffer(saltBuffer.length));
  salt.set(saltBuffer);

  return { hash, salt };
}

export function verifierMotDePasse(motDePasse: string, hashStocke: string, salt: Uint8Array): boolean {
  const hash = crypto.pbkdf2Sync(motDePasse, Buffer.from(salt), 100000, 64, 'sha512').toString('hex');

  return hash === hashStocke;
}