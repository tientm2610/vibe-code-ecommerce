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

export interface OrderAdminItem extends OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderAdmin {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  notes: string | null;
  items: OrderAdminItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: Pagination;
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

export interface OrderAdminResponse {
  success: boolean;
  data: OrderAdmin[];
  pagination: Pagination;
}

export interface OrderAdminDetailResponse {
  success: boolean;
  data: OrderAdmin;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
