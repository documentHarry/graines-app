import { PrismaClient } from '../prisma/generated/client.js';

export class UtilisateurRoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getByUtilisateur(idUtilisateur: number) {
    return this.prisma.utilisateur_role.findMany({
      where: { utilisateur_id: idUtilisateur },
      include: { role: true },
      orderBy: { role: { nom_role: 'asc' } },
    });
  }

  updateRolesUtilisateur(idUtilisateur: number, rolesIds: number[]) {
    return this.prisma.$transaction(async (transact) => {
      await transact.utilisateur_role.deleteMany({
        where: { utilisateur_id: idUtilisateur },
      });

      if (rolesIds.length > 0) {
        await transact.utilisateur_role.createMany({
          data: rolesIds.map(roleId => ({
            utilisateur_id: idUtilisateur,
            role_id: roleId,
          })),
        });
      }

      return transact.utilisateur.findUnique({
        where: { id_utilisateur: idUtilisateur },
        select: {
          id_utilisateur: true,
          nom: true,
          prenom: true,
          email: true,
          utilisateur_role: { include: { role: true } },
        },
      });
    });
  }
}