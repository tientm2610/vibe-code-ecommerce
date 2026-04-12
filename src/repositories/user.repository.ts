import { PrismaClient, User, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; password_hash: string; full_name?: string; role: UserRole }): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: { full_name?: string; is_active?: boolean; role?: UserRole }): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async getAll(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.user.count()
    ]);
    return { users, total };
  }
}

export const userRepository = new UserRepository();