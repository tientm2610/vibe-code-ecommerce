import { apiClient } from '../api-client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
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

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'createdAt' | 'price' | 'name';
  order?: 'asc' | 'desc';
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export const productApi = {
  getProducts: (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.order) params.set('order', filters.order);

    return apiClient.get(`/products?${params.toString()}`);
  },

  getProduct: (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get(`/products/${id}`);
  },
};