import { PrismaClient, Product } from '@prisma/client';
import { prisma } from '../config/prisma';

export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { sku } });
  }

  async findAll(page = 1, limit = 20, filters?: { categoryId?: string; isActive?: boolean; search?: string }) {
    const where: any = {};
    if (filters?.categoryId) where.category_id = filters.categoryId;
    if (filters?.isActive !== undefined) where.is_active = filters.isActive;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.count({ where })
    ]);
    return { products, total };
  }

  async create(data: { name: string; description?: string; sku: string; price: number; stock: number; image_url?: string; category_id: string }): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; sku?: string; price?: number; stock?: number; image_url?: string; category_id?: string; is_active?: boolean }): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}

export const productRepository = new ProductRepository();