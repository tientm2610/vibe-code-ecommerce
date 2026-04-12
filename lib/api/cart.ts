import { apiClient } from '../api-client';

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

export const cartApi = {
  getCart: (): Promise<CartResponse> => {
    return apiClient.get('/cart');
  },

  addItem: (productId: string, quantity: number): Promise<CartResponse> => {
    return apiClient.post('/cart/items', { productId, quantity });
  },

  updateItem: (productId: string, quantity: number): Promise<CartResponse> => {
    return apiClient.patch(`/cart/items/${productId}`, { quantity });
  },

  removeItem: (productId: string): Promise<CartResponse> => {
    return apiClient.delete(`/cart/items/${productId}`);
  },

  clearCart: (): Promise<{ success: boolean }> => {
    return apiClient.delete('/cart');
  },
};