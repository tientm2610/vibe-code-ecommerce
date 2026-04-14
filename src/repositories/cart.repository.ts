import { PrismaClient, Cart, CartItem } from '@prisma/client';
import { prisma } from '../config/prisma';

export class CartRepository {
  async findActiveCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: { userId: userId, isActive: true },
      include: { items: { include: { product: true } } }
    });
  }

  async createCart(userId: string) {
    return prisma.cart.create({
      data: { userId: userId, isActive: true }
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { cartId: cartId, productId: productId }
    });
  }

  async addCartItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.create({
      data: { cartId: cartId, productId: productId, quantity }
    });
  }

  async updateCartItemQuantity(cartId: string, productId: string, quantity: number) {
    const item = await prisma.cartItem.findFirst({
      where: { cartId: cartId, productId: productId }
    });
    if (!item) throw new Error('Cart item not found');
    return prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });
  }

  async removeCartItem(cartId: string, productId: string) {
    const item = await prisma.cartItem.findFirst({
      where: { cartId: cartId, productId: productId }
    });
    if (item) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    }
  }

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId: cartId } });
  }

  async getCartWithItems(cartId: string) {
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } }
    });
  }
}

export const cartRepository = new CartRepository();