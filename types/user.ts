export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface UserAdmin extends User {
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UserAdminResponse {
  success: boolean;
  data: UserAdmin;
}

export interface UsersResponse {
  success: boolean;
  data: UserAdmin[];
  pagination: Pagination;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
