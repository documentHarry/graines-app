import { PrismaClient } from '../prisma/generated/client.js';
import { LocaliteCreateInput, LocaliteUpdateInput } from '../../renderer/app/src/app/types/electron';

export class LocaliteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.localite.findMany({
      orderBy: [ { code_postal: 'asc' }, { localite: 'asc' } ],
    });
  }

  create(localite: LocaliteCreateInput) {
    return this.prisma.localite.create({
      data: {
        code_postal: localite.code_postal,
        localite: localite.localite,
      },
    });
  }

  update(localite: LocaliteUpdateInput) {
    return this.prisma.localite.update({
      where: { id_localite: localite.id_localite },
      data: {
        code_postal: localite.code_postal,
        localite: localite.localite,
      },
    });
  }

  countAdresses(id: number) {
    return this.prisma.adresse_livraison.count({
      where: { localite_id: id },
    });
  }

  delete(id: number) {
    return this.prisma.localite.delete({
      where: { id_localite: id },
    });
  }
}