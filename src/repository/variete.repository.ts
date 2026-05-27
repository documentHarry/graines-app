import { PrismaClient } from '../prisma/generated/client.js';
import { VarieteCreateInput, VarieteUpdateInput } from '../../renderer/app/src/app/types/electron';

type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

export class VarieteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  transaction<T>(callback: (transact: TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(callback);
  }

  getAll() {
    return this.prisma.variete.findMany({
      include: { espece: true, aromate: true, _count: { select: { produit: true } } },
      orderBy: { nom: 'asc' },
    });
  }

  getById(id: number) {
    return this.prisma.variete.findUnique({
      where: { id_variete: id },
      include: {
        espece: true,
        aromate: {
          include: {
            aromate_propriete: { include: { propriete_medicinale: true } },
          },
        },
        _count: { select: { produit: true } }
      }
    });
  }

  getByIdTransaction(transact: TransactionClient, id: number) {
    return transact.variete.findUnique({
      where: { id_variete: id },
      include: {
        espece: true,
        aromate: { include: { aromate_propriete: { include: { propriete_medicinale: true } } } },
        _count: { select: { produit: true } } 
      }
    });
  }

  getDoublonCreate(transact: TransactionClient, variete: VarieteCreateInput) {
    return transact.variete.findFirst({
      where: { nom: variete.nom, espece_id: variete.espece_id }
    });
  }

  getDoublonUpdate(transact: TransactionClient, variete: VarieteUpdateInput) {
    return transact.variete.findFirst({
      where: {
        nom: variete.nom,
        espece_id: variete.espece_id,
        NOT: { id_variete: variete.id_variete }
      }
    });
  }

  create(transact: TransactionClient, variete: VarieteCreateInput) {
    const { aromate, ...donneesVariete } = variete;

    return transact.variete.create({
      data: donneesVariete,
    });
  }

  update(transact: TransactionClient, variete: VarieteUpdateInput) {
    const { id_variete, aromate, ...donneesVariete } = variete;

    return transact.variete.update({
      where: { id_variete },
      data: donneesVariete
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