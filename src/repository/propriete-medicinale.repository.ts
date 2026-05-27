import { PrismaClient } from '../prisma/generated/client.js';

export class ProprieteMedicinaleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.propriete_medicinale.findMany({
      orderBy: { nom_propriete: 'asc' } 
    });
  }
}