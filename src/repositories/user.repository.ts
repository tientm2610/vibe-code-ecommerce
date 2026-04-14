import { PrismaClient, User, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; passwordHash: string; fullName?: string; role: UserRole }): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: { fullName?: string; isActive?: boolean; role?: UserRole }): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async getAll(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);
    return { users, total };
  }
}

export const userRepository = new UserRepository();