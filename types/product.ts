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

export interface ProductCreate {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
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
  pagination: Pagination;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export interface CreateProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export interface UpdateProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
