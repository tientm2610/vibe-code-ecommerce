import { PrismaClient, Cart, CartItem } from '@prisma/client';
import { prisma } from '../config/prisma';

export class CartRepository {
  async findActiveCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: { user_id: userId, is_active: true },
      include: { items: { include: { product: true } } }
    });
  }

  async createCart(userId: string) {
    return prisma.cart.create({
      data: { user_id: userId, is_active: true }
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { cart_id: cartId, product_id: productId }
    });
  }

  async addCartItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.create({
      data: { cart_id: cartId, product_id: productId, quantity }
    });
  }

  async updateCartItemQuantity(cartId: string, productId: string, quantity: number) {
    const item = await prisma.cartItem.findFirst({
      where: { cart_id: cartId, product_id: productId }
    });
    if (!item) throw new Error('Cart item not found');
    return prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });
  }

  async removeCartItem(cartId: string, productId: string) {
    const item = await prisma.cartItem.findFirst({
      where: { cart_id: cartId, product_id: productId }
    });
    if (item) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    }
  }

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cart_id: cartId } });
  }

  async getCartWithItems(cartId: string) {
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } }
    });
  }
}

export const cartRepository = new CartRepository();