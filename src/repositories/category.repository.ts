import { PrismaClient, Category } from '@prisma/client';
import { prisma } from '../config/prisma';

export class CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { name } });
  }

  async findAll(page = 1, limit = 20) {
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { parent: { select: { id: true, name: true } } }
      }),
      prisma.category.count()
    ]);
    return { categories, total };
  }

  async findHomepage(limit = 6): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: { name: 'asc' }
    });
  }

  async create(data: { name: string; description?: string; parentId?: string }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; parentId?: string; isActive?: boolean; imageUrl?: string }): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
