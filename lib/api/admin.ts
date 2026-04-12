import { apiClient } from '../api-client';

export const productCardApi = {
  getProducts: (filters?: { page?: number; limit?: number; search?: string; categoryId?: string; isActive?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.search) params.set('search', filters.search);
    if (filters?.categoryId) params.set('categoryId', filters.categoryId);
    return apiClient.get(`/admin/products?${params.toString()}`);
  },
  
  getProduct: (id: string) => apiClient.get(`/admin/products/${id}`),
  
  createProduct: (data: any) => apiClient.post('/admin/products', data),
  
  updateProduct: (id: string, data: any) => apiClient.put(`/admin/products/${id}`, data),
  
  deleteProduct: (id: string) => apiClient.delete(`/admin/products/${id}`),
};

export const categoryApi = {
  getCategories: (page = 1, limit = 20) => apiClient.get(`/admin/categories?page=${page}&limit=${limit}`),
  createCategory: (data: any) => apiClient.post('/admin/categories', data),
  updateCategory: (id: string, data: any) => apiClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/admin/categories/${id}`),
};

export const orderApi = {
  getOrders: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return apiClient.get(`/admin/orders?${params.toString()}`);
  },
  getOrder: (id: string) => apiClient.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => apiClient.patch(`/admin/orders/${id}/status`, { status }),
};

export const userApi = {
  getUsers: (page = 1, limit = 20) => apiClient.get(`/admin/users?page=${page}&limit=${limit}`),
  getUser: (id: string) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => apiClient.patch(`/admin/users/${id}`, data),
};