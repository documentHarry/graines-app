import { PrismaClient } from '../prisma/generated/client.js';

export class AvisRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.avis.findMany({
      where: { statut: { not: 'supprimé' } },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
      orderBy: { date_depot: 'desc' },
    });
  }

  getById(id: number) {
    return this.prisma.avis.findUnique({
      where: { id_avis: id },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
    });
  }

  getByProduit(produitId: number) {
    return this.prisma.avis.findMany({
      where: { produit_id: produitId, statut: { not: 'supprimé' } },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
      orderBy: { date_depot: 'desc' },
    });
  }

  getByUtilisateurAndProduit(utilisateurId: number, produitId: number) {
    return this.prisma.avis.findFirst({
      where: { utilisateur_id: utilisateurId, produit_id: produitId, statut: { not: 'supprimé' } },
    });
  }

  async existeAvisUtilisateurProduit(utilisateurId: number, produitId: number): Promise<boolean> {
    const avis = await this.getByUtilisateurAndProduit(utilisateurId, produitId);

    return avis !== null;
  }

  getActifById(id: number) {
    return this.prisma.avis.findFirst({
      where: { id_avis: id, statut: { not: 'supprimé' } },
    });
  }

  async existeAvisActif(id: number): Promise<boolean> {
    const avis = await this.getActifById(id);

    return avis !== null;
  }

  create(avis: {
    note: number;
    titre: string | null;
    commentaire: string | null;
    utilisateur_id: number;
    produit_id: number;
  }) {
    return this.prisma.avis.create({
      data: {
        note: avis.note,
        titre: avis.titre,
        commentaire: avis.commentaire,
        utilisateur_id: avis.utilisateur_id,
        produit_id: avis.produit_id,
        statut: 'nouveau',
        nombre_jaime: 0,
      },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
    });
  }

  update(avis: {
    id_avis: number;
    note: number;
    titre: string | null;
    commentaire: string | null;
  }) {
    return this.prisma.avis.update({
      where: { id_avis: avis.id_avis },
      data: {
        note: avis.note,
        titre: avis.titre,
        commentaire: avis.commentaire,
        statut: 'modifié',
      },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
    });
  }

  delete(id: number) {
    return this.prisma.avis.update({
      where: { id_avis: id },
      data: { statut: 'supprimé' },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
    });
  }

  like(id: number) {
    return this.prisma.avis.update({
      where: { id_avis: id },
      data: { nombre_jaime: { increment: 1 } },
      include: {
        utilisateur: { select: { id_utilisateur: true, nom: true, prenom: true, email: true } },
        produit: { include: { categorie: true, variete: { include: { espece: true } } } },
      },
    });
  }
}