import { apiClient } from '../api-client';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

export const orderApi = {
  checkout: (data: { shippingAddress: string; billingAddress: string; notes?: string }): Promise<OrderDetailResponse> => {
    return apiClient.post('/orders/checkout', data);
  },

  getOrders: (page = 1, limit = 20): Promise<OrdersResponse> => {
    return apiClient.get(`/orders?page=${page}&limit=${limit}`);
  },

  getOrder: (id: string): Promise<OrderDetailResponse> => {
    return apiClient.get(`/orders/${id}`);
  },

  cancelOrder: (id: string): Promise<OrderDetailResponse> => {
    return apiClient.patch(`/orders/${id}/cancel`);
  },
};