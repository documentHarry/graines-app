import { PrismaClient } from '../prisma/generated/client.js';
import { EspeceCreateInput, EspeceUpdateInput } from '../../renderer/app/src/app/types/electron';

export class EspeceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.espece.findMany({
      include: { _count: { select: { variete: true } } },
      orderBy: { nom_commun: 'asc' },
    });
  }

  getById(id: number) {
    return this.prisma.espece.findUnique({
      where: { id_espece: id },
      include: { _count: { select: { variete: true } } },
    });
  }

  create(espece: EspeceCreateInput) {
    return this.prisma.espece.create({
      data: {
        nom_scientifique: espece.nom_scientifique,
        nom_commun: espece.nom_commun,
      },
      include: { _count: { select: { variete: true } } },
    });
  }

  update(espece: EspeceUpdateInput) {
    return this.prisma.espece.update({
      where: { id_espece: espece.id_espece },
      data: {
        nom_scientifique: espece.nom_scientifique,
        nom_commun: espece.nom_commun,
      },
      include: { _count: { select: { variete: true } } }
    });
  }

  countVarietes(id: number) {
    return this.prisma.variete.count({
      where: { espece_id: id },
    });
  }

  delete(id: number) {
    return this.prisma.espece.delete({
      where: { id_espece: id },
      include: { _count: { select: { variete: true } } },
    });
  }
}