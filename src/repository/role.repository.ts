import { PrismaClient } from '../prisma/generated/client.js';
import { RoleCreateInput, RoleUpdateInput } from '../../renderer/app/src/app/types/electron';

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

  create(role: RoleCreateInput) {
    return this.prisma.role.create({
      data: {
        nom_role: role.nom_role,
      },
    });
  }

  update(role: RoleUpdateInput) {
    return this.prisma.role.update({
      where: {
        id_role: role.id_role,
      },
      data: {
        nom_role: role.nom_role,
      },
    });
  }

  delete(id: number) {
    return this.prisma.role.delete({
      where: {
        id_role: id,
      },
    });
  }
}