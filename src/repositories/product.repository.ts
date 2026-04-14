import { PrismaClient, Product, Category } from '@prisma/client';
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
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
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
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.count({ where })
    ]);
    return { products, total };
  }

  async findFeatured(limit = 4): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { id: true, name: true } } }
    });
  }

  async findBestSellers(limit = 4): Promise<Product[]> {
    const productIdsWithOrders = await prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { quantity: true },
      orderBy: { _count: { quantity: 'desc' } },
      take: limit * 2
    });

    const topProductIds = productIdsWithOrders.map(p => p.productId);
    
    if (topProductIds.length === 0) {
      return prisma.product.findMany({
        where: { isActive: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: topProductIds }, isActive: true },
      include: { category: { select: { id: true, name: true } } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));
    return topProductIds.map(id => productMap.get(id)!).filter(Boolean).slice(0, limit);
  }

  async create(data: { name: string; description?: string; sku: string; price: number; stock: number; imageUrl?: string; categoryId: string }): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; sku?: string; price?: number; stock?: number; imageUrl?: string; categoryId?: string; isActive?: boolean; isFeatured?: boolean; originalPrice?: number; badge?: string }): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}

export const productRepository = new ProductRepository();
