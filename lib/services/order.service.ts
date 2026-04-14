import { apiClient } from '../core';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

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
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface CheckoutRequest {
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
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

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export const orderService = {
  checkout: async (data: CheckoutRequest): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>('/orders/checkout', data);
  },

  getOrders: async (page = 1, limit = 20): Promise<OrdersResponse> => {
    return apiClient.get<OrdersResponse>(`/orders?page=${page}&limit=${limit}`);
  },

  getOrder: async (id: string): Promise<OrderDetailResponse> => {
    return apiClient.get<OrderDetailResponse>(`/orders/${id}`);
  },

  cancelOrder: async (id: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/orders/${id}/cancel`, {});
  },

  getAdminOrders: async (
    page = 1,
    limit = 20,
    status?: OrderStatus
  ): Promise<OrdersResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) {
      params.set('status', status);
    }
    return apiClient.get<OrdersResponse>(`/admin/orders?${params.toString()}`);
  },

  getAdminOrder: async (id: string): Promise<OrderDetailResponse> => {
    return apiClient.get<OrderDetailResponse>(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/admin/orders/${id}/status`, {
      status,
    } as UpdateOrderStatusRequest);
  },
};
