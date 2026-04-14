import { apiClient } from '../core';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface UserUpdate {
  fullName?: string;
  isActive?: boolean;
  role?: 'USER' | 'ADMIN';
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export const userAdminService = {
  getUsers: async (page = 1, limit = 20): Promise<UsersResponse> => {
    return apiClient.get<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
  },

  getUser: async (id: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/admin/users/${id}`);
  },

  updateUser: async (id: string, data: UserUpdate): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/admin/users/${id}`, data);
  },
};
