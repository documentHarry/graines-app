import { PrismaClient } from '../prisma/generated/client.js';
import { CategorieCreateInput, CategorieUpdateInput } from '../../renderer/app/src/app/types/electron';

export class CategorieRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.categorie.findMany({
      include: { _count: { select: { produit: true } } },
      orderBy: { nom_categorie: 'asc' }
    });
  }

  getById(id: number) {
    return this.prisma.categorie.findUnique({
      where: { id_categorie: id },
      include: { _count: { select: { produit: true } } }
    });
  }

  create(categorie: CategorieCreateInput) {
    return this.prisma.categorie.create({
      data: {
        nom_categorie: categorie.nom_categorie,
        descriptif: categorie.descriptif,
      },
      include: { _count: { select: { produit: true } } },
    });
  }

  update(categorie: CategorieUpdateInput) {
    return this.prisma.categorie.update({
      where: { id_categorie: categorie.id_categorie },
      data: {
        nom_categorie: categorie.nom_categorie,
        descriptif: categorie.descriptif,
      },
      include: { _count: { select: { produit: true } } },
    });
  }

  countProduits(id: number) {
    return this.prisma.produit.count({
      where: { categorie_id: id },
    });
  }

  delete(id: number) {
    return this.prisma.categorie.delete({
      where: { id_categorie: id },
      include: { _count: { select: { produit: true } } }
    });
  }

  getCategorieDestination(idCategorieDestination: number) {
    return this.prisma.categorie.findUnique({
      where: { id_categorie: idCategorieDestination },
    });
  }

  reaffecterProduits(idCategorieASupprimer: number, idCategorieDestination: number) {
    return this.prisma.produit.updateMany({
      where: { categorie_id: idCategorieASupprimer },
      data: { categorie_id: idCategorieDestination },
    });
  }
}