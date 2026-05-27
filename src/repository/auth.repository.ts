import { PrismaClient } from '../prisma/generated/client.js';

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getByEmailWithRoles(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email: email },
      include: { utilisateur_role: { include: { role: true } } },
    });
  }
}