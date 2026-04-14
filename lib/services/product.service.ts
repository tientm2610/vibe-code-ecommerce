import { apiClient } from '../core';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'createdAt' | 'price' | 'name';
  order?: 'asc' | 'desc';
  isActive?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

function buildQueryString(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const productService = {
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryString = buildQueryString(filters);
    return apiClient.get<ProductsResponse>(`/products${queryString}`);
  },

  getProduct: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get<ProductDetailResponse>(`/products/${id}`);
  },

  getAdminProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryString = buildQueryString(filters);
    return apiClient.get<ProductsResponse>(`/admin/products${queryString}`);
  },

  getAdminProduct: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get<ProductDetailResponse>(`/admin/products/${id}`);
  },

  createProduct: async (data: any): Promise<any> => {
    return apiClient.post('/admin/products', data);
  },

  updateProduct: async (id: string, data: any): Promise<any> => {
    return apiClient.put(`/admin/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<any> => {
    return apiClient.delete(`/admin/products/${id}`);
  },
};
