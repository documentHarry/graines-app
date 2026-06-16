import { PrismaClient } from '../prisma/generated/client.js';
import { VarieteCreateInput, VarieteUpdateInput } from '../../renderer/app/src/app/types/electron';

export class VarieteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.variete.findMany({
      include: { espece: true, _count: { select: { produit: true } } },
      orderBy: { nom: 'asc' },
    });
  }

  getById(id: number) {
    return this.prisma.variete.findUnique({
      where: { id_variete: id },
      include: {
        espece: true,
        _count: { select: { produit: true } }
      }
    });
  }

  create(variete: VarieteCreateInput) {
    return this.prisma.variete.create({
      data: variete,
    });
  }

  update(variete: VarieteUpdateInput) {
    return this.prisma.variete.update({
      where: { id_variete: variete.id_variete },
      data: {
        espece_id: variete.espece_id,
        nom: variete.nom,
        descriptif: variete.descriptif,
        bio: variete.bio,
        cycle_jours: variete.cycle_jours,
        couleur_legume: variete.couleur_legume,
        taille_fixe_legume: variete.taille_fixe_legume,
        taille_min_legume: variete.taille_min_legume,
        taille_max_legume: variete.taille_max_legume,
        espacement_entre_les_plants: variete.espacement_entre_les_plants,
        espacement_entre_les_lignes: variete.espacement_entre_les_lignes,
        type_ensoleillement: variete.type_ensoleillement,
        type_feuillage: variete.type_feuillage,
        hauteur_adulte_min: variete.hauteur_adulte_min,
        hauteur_adulte_max: variete.hauteur_adulte_max,
        duree_de_germination: variete.duree_de_germination,
        temperature_min_de_germination: variete.temperature_min_de_germination,
        cycle_de_vie: variete.cycle_de_vie,
        rusticite_plante: variete.rusticite_plante,
        date_semis_min: variete.date_semis_min,
        date_semis_max: variete.date_semis_max,
        duree_avant_recolte: variete.duree_avant_recolte,
        type_de_sol: variete.type_de_sol,
        conseil_plantation: variete.conseil_plantation,
      },
    });
  }
  

  countProduits(id: number) {
    return this.prisma.produit.count({
      where: { variete_id: id }
    });
  }

  delete(id: number) {
    return this.prisma.variete.delete({
      where: { id_variete: id },
      include: { espece: true, _count: { select: { produit: true } } },
    });
  }
}