import { apiClient } from '../core';

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

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>('/cart');
  },

  addItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    return apiClient.post<CartResponse>('/cart/items', {
      productId,
      quantity,
    } as AddToCartRequest);
  },

  updateItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    return apiClient.patch<CartResponse>(`/cart/items/${productId}`, {
      quantity,
    } as UpdateCartItemRequest);
  },

  removeItem: async (productId: string): Promise<CartResponse> => {
    return apiClient.delete<CartResponse>(`/cart/items/${productId}`);
  },

  clearCart: async (): Promise<ClearCartResponse> => {
    return apiClient.delete<ClearCartResponse>('/cart');
  },
};
