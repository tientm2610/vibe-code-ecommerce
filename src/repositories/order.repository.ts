import { PrismaClient, Order, OrderItem, OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: {
      id: string;
      name: string;
      sku: string;
      image_url: string | null;
    };
  })[];
}

export interface OrderWithItemsAndUser extends OrderWithItems {
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export class OrderRepository {
  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where: { user_id: userId } })
    ]);
    return { orders, total };
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { order_number: orderNumber } });
  }

  async create(data: {
    order_number: string;
    user_id: string;
    status: OrderStatus;
    total_amount: number;
    shipping_address: string;
    billing_address: string;
    notes?: string;
    items: { product_id: string; quantity: number; unit_price: number }[];
  }): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          order_number: data.order_number,
          user_id: data.user_id,
          status: data.status,
          total_amount: data.total_amount,
          shipping_address: data.shipping_address,
          billing_address: data.billing_address,
          notes: data.notes,
          items: {
            create: data.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price
            }))
          }
        }
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.product_id },
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
        user: { select: { id: true, email: true, full_name: true } }
      }
    }) as Promise<OrderWithItemsAndUser | null>;
  }

  async getAll(page = 1, limit = 20, status?: OrderStatus): Promise<{ orders: OrderWithItemsAndUser[]; total: number }> {
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, email: true, full_name: true } }
        }
      }),
      prisma.order.count({ where })
    ]);
    return { orders: orders as OrderWithItemsAndUser[], total };
  }
}

export const orderRepository = new OrderRepository();