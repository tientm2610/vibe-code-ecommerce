import { PrismaClient, Order, OrderItem, OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: {
      id: string;
      name: string;
      sku: string;
      imageUrl: string | null;
    };
  })[];
}

export interface OrderWithItemsAndUser extends OrderWithItems {
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export class OrderRepository {
  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where: { userId: userId } })
    ]);
    return { orders, total };
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { orderNumber } });
  }

  async create(data: {
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: string;
    billingAddress: string;
    notes?: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
  }): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: data.orderNumber,
          userId: data.userId,
          status: data.status,
          totalAmount: data.totalAmount,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          notes: data.notes,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        }
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async getOrderWithItems(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    }) as Promise<OrderWithItems | null>;
  }

  async getOrderWithItemsAndUser(id: string): Promise<OrderWithItemsAndUser | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, fullName: true } }
      }
    }) as Promise<OrderWithItemsAndUser | null>;
  }

  async getAll(page = 1, limit = 20, status?: OrderStatus): Promise<{ orders: OrderWithItemsAndUser[]; total: number }> {
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, email: true, fullName: true } }
        }
      }),
      prisma.order.count({ where })
    ]);
    return { orders: orders as OrderWithItemsAndUser[], total };
  }
}

export const orderRepository = new OrderRepository();