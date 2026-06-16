import { PrismaClient } from '../prisma/generated/client.js';
import { ProduitCreateInput, ProduitUpdateInput } from '../../renderer/app/src/app/types/electron';

export class ProduitRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.produit.findMany({
      include: {
        variete: { include: { espece: true } }
      },
      orderBy: { intitule: 'asc' }
    });
  }

  getByCategorie(categorieId: number) {
    return this.prisma.produit.findMany({
      where: { categorie_id: categorieId },
      include: {
        variete: { include: { espece: true } }
      },
      orderBy: { intitule: 'asc' }
    });
  }

  getById(id: number) {
    return this.prisma.produit.findUnique({
      where: { id_produit: id },
      include: {
        variete: { include: { espece: true } }
      }
    });
  }

  create(produit: ProduitCreateInput) {
    return this.prisma.produit.create({
      data: {
        intitule: produit.intitule,
        prix_unitaire: produit.prix_unitaire,
        quantite: produit.quantite,
        date_ajout: new Date().toISOString().slice(0, 19).replace('T', ' '),
        categorie_id: produit.categorie_id,
        variete_id: produit.variete_id
      }
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
        variete_id: produit.variete_id
      }
    });
  }

  delete(id: number) {
    return this.prisma.produit.delete({
      where: { id_produit: id }
    });
  }

}