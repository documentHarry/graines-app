import { PrismaClient } from '../prisma/generated/client.js';
import { UtilisateurCreateInput, UtilisateurUpdateInput } from '../../renderer/app/src/app/types/electron';

export class UtilisateurRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.utilisateur.findMany({
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        date_inscription: true,
        actif: true,
        adresse_livraison: { include: { localite: true } },
      },
      orderBy: [ { nom: 'asc' }, { prenom: 'asc' } ],
    });
  }

  getById(id: number) {
    return this.prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        date_inscription: true,
        actif: true,
        adresse_livraison: { include: { localite: true } },
      },
    });
  }

  getByEmail(email: string) {
    return this.prisma.utilisateur.findFirst({
      where: { email: email },
    });
  }

  getDoublonUpdate(utilisateur: UtilisateurUpdateInput) {
    return this.prisma.utilisateur.findFirst({
      where: {
        email: utilisateur.email,
        NOT: { id_utilisateur: utilisateur.id_utilisateur },
      },
    });
  }

  create(utilisateur: UtilisateurCreateInput, motDePasse: {
    hash: string;
    salt: Uint8Array<ArrayBuffer>;
  }) {
    return this.prisma.utilisateur.create({
      data: {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        mot_de_passe_hash: motDePasse.hash,
        mot_de_passe_salt: motDePasse.salt,
        actif: 1,
      },
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        date_inscription: true,
        actif: true,
        adresse_livraison: { include: { localite: true } },
      },
    });
  }

  update(utilisateur: UtilisateurUpdateInput) {
    return this.prisma.utilisateur.update({
      where: { id_utilisateur: utilisateur.id_utilisateur },
      data: {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
      },
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        date_inscription: true,
        actif: true,
        adresse_livraison: { include: { localite: true } },
      },
    });
  }

  delete(id: number) {
    return this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { actif: 0 },
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        date_inscription: true,
        actif: true,
        adresse_livraison: { include: { localite: true } },
      },
    });
  }
}