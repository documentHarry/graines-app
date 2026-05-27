import { PrismaClient } from '../prisma/generated/client.js';
import { AromateInput } from '../../renderer/app/src/app/types/electron';

type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

export class AromateRepository {
  create(transact: TransactionClient, varieteId: number, aromate: AromateInput) {
    return transact.aromate.create({
      data: {
        variete_id: varieteId,
        partie_utilisee: aromate.partie_utilisee,
        propriete: aromate.propriete,
        usage_culinaire: aromate.usage_culinaire,
      },
    });
  }

  deleteByVariete(transact: TransactionClient, varieteId: number) {
    return transact.aromate.deleteMany({
      where: { variete_id: varieteId },
    });
  }

  deleteProprietesByVariete(transact: TransactionClient, varieteId: number) {
    return transact.aromate_propriete.deleteMany({
      where: { aromate: { variete_id: varieteId } },
    });
  }

  createProprietes(transact: TransactionClient, aromateId: number, proprietesIds: number[]) {
    if (proprietesIds.length === 0) {
      return;
    }

    return transact.aromate_propriete.createMany({
      data: proprietesIds.map(proprieteId => ({
        aromate_id: aromateId,
        propriete_id: proprieteId,
      })),
    });
  }
}