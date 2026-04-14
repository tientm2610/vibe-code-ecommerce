import { cartRepository } from '../repositories/cart.repository';
import { orderRepository } from '../repositories/order.repository';
import AppError from '../utils/app-error';
import { OrderStatus } from '@prisma/client';

export interface CheckoutDto {
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  notes: string | null;
  items: OrderItemResponse[];
  createdAt: Date;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class OrderService {
  async checkout(userId: string, dto: CheckoutDto): Promise<OrderResponse> {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400, 'EMPTY_CART');
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product: ${item.product.name}`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }
    }

    const orderNumber = this.generateOrderNumber();
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await orderRepository.create({
      orderNumber: orderNumber,
      userId: userId,
      status: OrderStatus.PENDING,
      totalAmount: totalAmount,
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress,
      notes: dto.notes,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.product.price)
      }))
    });

    await cartRepository.clearCart(cart.id);

    return this.formatOrderResponse(order.id);
  }

  async getOrders(userId: string, page = 1, limit = 20): Promise<{ orders: OrderResponse[]; pagination: PaginationResponse }> {
    const { orders, total } = await orderRepository.findByUserId(userId, page, limit);
    const formattedOrders = await Promise.all(orders.map(o => this.formatOrderResponse(o.id)));
    
    return {
      orders: formattedOrders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getOrderById(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }
    if (order.userId !== userId) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }
    return this.formatOrderResponse(orderId);
  }

  async cancelOrder(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }
    if (order.userId !== userId) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
      throw new AppError('Order cannot be cancelled', 400, 'ORDER_CANNOT_CANCEL');
    }

    await orderRepository.updateStatus(orderId, OrderStatus.CANCELLED);
    return this.formatOrderResponse(orderId);
  }

  private async formatOrderResponse(orderId: string): Promise<OrderResponse> {
    const order: any = await orderRepository.getOrderWithItems(orderId);
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');

    const items: OrderItemResponse[] = (order.items || []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      productImageUrl: item.product.imageUrl,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.unitPrice) * item.quantity
    }));

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      items,
      createdAt: order.createdAt
    };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const orderService = new OrderService();