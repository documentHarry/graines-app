import { PrismaClient } from '../prisma/generated/client.js';
import { ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../../renderer/app/src/app/types/electron';

export class ProprieteMedicinaleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.propriete_medicinale.findMany({
      orderBy: { nom_propriete: 'asc' }
    });
  }

  create(propriete: ProprieteMedicinaleCreateInput) {
    return this.prisma.propriete_medicinale.create({
      data: { nom_propriete: propriete.nom_propriete }
    });
  }

  update(propriete: ProprieteMedicinaleUpdateInput) {
    return this.prisma.propriete_medicinale.update({
      where: { id_propriete: propriete.id_propriete },
      data: { nom_propriete: propriete.nom_propriete }
    });
  }

  delete(id: number) {
    return this.prisma.propriete_medicinale.delete({
      where: { id_propriete: id }
    });
  }

}