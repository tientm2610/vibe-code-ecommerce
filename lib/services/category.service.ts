import { apiClient } from '../core';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  parentId?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryDetailResponse {
  success: boolean;
  data: Category;
}

export interface CreateCategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

export interface UpdateCategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

export const categoryService = {
  getCategories: async (page = 1, limit = 20): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>(`/admin/categories?page=${page}&limit=${limit}`);
  },

  getCategory: async (id: string): Promise<CategoryDetailResponse> => {
    return apiClient.get<CategoryDetailResponse>(`/admin/categories/${id}`);
  },

  createCategory: async (data: CategoryCreate): Promise<CreateCategoryResponse> => {
    return apiClient.post<CreateCategoryResponse>('/admin/categories', data);
  },

  updateCategory: async (id: string, data: CategoryUpdate): Promise<UpdateCategoryResponse> => {
    return apiClient.put<UpdateCategoryResponse>(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<DeleteCategoryResponse> => {
    return apiClient.delete<DeleteCategoryResponse>(`/admin/categories/${id}`);
  },
};
