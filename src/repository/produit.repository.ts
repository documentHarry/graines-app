import { PrismaClient } from '../prisma/generated/client.js';
import { ProduitCreateInput, ProduitUpdateInput } from '../../renderer/app/src/app/types/electron';

export class ProduitRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.produit.findMany({
      include: { categorie: true, variete: { include: {  espece: true } } },
      orderBy: { intitule: 'asc' },
    });
  }

  getByCategorie(categorieId: number) {
    return this.prisma.produit.findMany({
      where: { categorie_id: categorieId },
      include: { categorie: true, variete: { include: { espece: true } } },
      orderBy: { intitule: 'asc' },
    });
  }

  getById(id: number) {
    return this.prisma.produit.findUnique({
      where: { id_produit: id },
      include: { categorie: true, variete: { include: { espece: true } },
      },
    });
  }

  getDoublonCreate(produit: ProduitCreateInput) {
    return this.prisma.produit.findFirst({
      where: { intitule: produit.intitule, variete_id: produit.variete_id },
    });
  }

  getDoublonUpdate(produit: ProduitUpdateInput) {
    return this.prisma.produit.findFirst({
      where: {
        intitule: produit.intitule,
        variete_id: produit.variete_id,
        NOT: { id_produit: produit.id_produit },
      },
    });
  }

  create(produit: ProduitCreateInput) {
    return this.prisma.produit.create({
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

  update(produit: ProduitUpdateInput) {
    return this.prisma.produit.update({
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

  delete(id: number) {
    return this.prisma.produit.delete({
      where: { id_produit: id, },
      include: { categorie: true, variete: { include: { espece: true } } },
    });
  }

  async getSimilaires(id: number) {
    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: id },
      include: { variete: { include: { espece: true } } }
    });

    if (!produit) {
      return [];
    }

    return this.prisma.produit.findMany({
      where: { id_produit: { not: produit.id_produit },
        OR: [
          { categorie_id: produit.categorie_id },
          { variete: { espece_id: produit.variete.espece_id } },
          { variete: { cycle_de_vie: produit.variete.cycle_de_vie } },
        ],
      },
      include: { categorie: true, variete: { include: { espece: true } } },
      orderBy: { intitule: 'asc' },
      take: 6,
    });
  }
}