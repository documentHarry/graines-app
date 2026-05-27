import { PrismaClient } from '../prisma/generated/client.js';
import { AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput } from '../../renderer/app/src/app/types/electron';

export class AdresseLivraisonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(adresse: AdresseLivraisonCreateInput) {
    return this.prisma.adresse_livraison.create({
      data: {
        rue: adresse.rue,
        numero: adresse.numero,
        par_defaut: adresse.par_defaut,
        utilisateur_id: adresse.utilisateur_id,
        localite_id: adresse.localite_id,
      },
      include: { localite: true },
    });
  }

  update(adresse: AdresseLivraisonUpdateInput) {
    return this.prisma.adresse_livraison.update({
      where: { id_adresse: adresse.id_adresse },
      data: {
        rue: adresse.rue,
        numero: adresse.numero,
        par_defaut: adresse.par_defaut,
        localite_id: adresse.localite_id,
      },
      include: { localite: true },
    });
  }

  delete(id: number) {
    return this.prisma.adresse_livraison.delete({
      where: { id_adresse: id },
      include: { localite: true },
    });
  }
}