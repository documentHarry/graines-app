import { PrismaClient } from '../prisma/generated/client.js';
import { AromateCreateInput, AromateUpdateInput } from '../../renderer/app/src/app/types/electron';

export class AromateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.aromate.findMany({
      include: {
        variete: { include: { espece: true } },
        aromate_propriete: { include: { propriete_medicinale: true } },
      },
      orderBy: { id_aromate: 'asc' },
    });
  }

  getById(id: number) {
    return this.prisma.aromate.findUnique({
      where: { id_aromate: id },
      include: {
        variete: { include: { espece: true } },
        aromate_propriete: { include: { propriete_medicinale: true } },
      },
    });
  }

  create(aromate: AromateCreateInput) {
    return this.prisma.aromate.create({
      data: {
        variete_id: aromate.variete_id,
        partie_utilisee: aromate.partie_utilisee,
        propriete: aromate.propriete,
        usage_culinaire: aromate.usage_culinaire,
      },
    });
  }

  update(aromate: AromateUpdateInput) {
    return this.prisma.aromate.update({
      where: { id_aromate: aromate.id_aromate },
      data: {
        variete_id: aromate.variete_id,
        partie_utilisee: aromate.partie_utilisee,
        propriete: aromate.propriete,
        usage_culinaire: aromate.usage_culinaire,
      },
    });
  }

  createProprietes(aromateId: number, proprietesIds: number[]) {
    if (proprietesIds.length === 0) {
      return Promise.resolve();
    }

    return this.prisma.aromate_propriete.createMany({
      data: proprietesIds.map(proprieteId => ({
        aromate_id: aromateId,
        propriete_id: proprieteId,
      })),
    });
  }

  deleteProprietes(aromateId: number) {
    return this.prisma.aromate_propriete.deleteMany({
      where: { aromate_id: aromateId },
    });
  }

  delete(id: number) {
    return this.prisma.aromate.delete({
      where: { id_aromate: id },
    });
  }
}