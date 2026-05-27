import { PrismaClient } from '../prisma/generated/client.js';

export class RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getAll() {
    return this.prisma.role.findMany({
      orderBy: { nom_role: 'asc' },
    });
  }

  getByNom(nomRole: string) {
    return this.prisma.role.findUnique({
      where: { nom_role: nomRole },
    });
  }
}