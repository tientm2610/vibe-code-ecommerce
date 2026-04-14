import type { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productPrice: number;
  productImageUrl: string | null;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ClearCartResponse {
  success: boolean;
  message: string;
}
