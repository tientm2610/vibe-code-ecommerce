import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import AppError from '../utils/app-error';
import { Cart, CartItem } from '@prisma/client';

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateQuantityDto {
  quantity: number;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productPrice: number;
  productImageUrl: string | null;
  quantity: number;
  subtotal: number;
}

export class CartService {
  async getCart(userId: string): Promise<CartResponse> {
    let cart: any = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }
    return this.formatCartResponse(cart);
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<CartResponse> {
    const product = await productRepository.findById(dto.productId);
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    if (!product.isActive) {
      throw new AppError('Product is not available', 400, 'PRODUCT_NOT_AVAILABLE');
    }
    if (product.stock < dto.quantity) {
      throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');
    }

    let cart: any = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    const existingItem = await cartRepository.findCartItem(cart.id, dto.productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new AppError('Insufficient stock for requested quantity', 400, 'INSUFFICIENT_STOCK');
      }
      await cartRepository.updateCartItemQuantity(cart.id, dto.productId, newQuantity);
    } else {
      await cartRepository.addCartItem(cart.id, dto.productId, dto.quantity);
    }

    const updatedCart = await cartRepository.getCartWithItems(cart.id);
    return this.formatCartResponse(updatedCart!);
  }

  async updateQuantity(userId: string, productId: string, dto: UpdateQuantityDto): Promise<CartResponse> {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
    if (product.stock < dto.quantity) {
      throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');
    }

    const cartItem = await cartRepository.findCartItem(cart.id, productId);
    if (!cartItem) {
      throw new AppError('Item not found in cart', 404, 'CART_ITEM_NOT_FOUND');
    }

    await cartRepository.updateCartItemQuantity(cart.id, productId, dto.quantity);
    const updatedCart = await cartRepository.getCartWithItems(cart.id);
    return this.formatCartResponse(updatedCart!);
  }

  async removeFromCart(userId: string, productId: string): Promise<CartResponse> {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
    }

    const cartItem = await cartRepository.findCartItem(cart.id, productId);
    if (!cartItem) {
      throw new AppError('Item not found in cart', 404, 'CART_ITEM_NOT_FOUND');
    }

    await cartRepository.removeCartItem(cart.id, productId);
    const updatedCart = await cartRepository.getCartWithItems(cart.id);
    return this.formatCartResponse(updatedCart!);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
    }
    await cartRepository.clearCart(cart.id);
  }

  private formatCartResponse(cart: any): CartResponse {
    const items: CartItemResponse[] = (cart.items || []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      productPrice: Number(item.product.price),
      productImageUrl: item.product.imageUrl,
      quantity: item.quantity,
      subtotal: Number(item.product.price) * item.quantity
    }));

    const totalItems = items.reduce((sum: number, item: CartItemResponse) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum: number, item: CartItemResponse) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      items,
      totalItems,
      totalAmount
    };
  }
}

export const cartService = new CartService();