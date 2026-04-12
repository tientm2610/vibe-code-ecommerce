import { apiClient } from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: AuthUser;
}

export const authApi = {
  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/auth/register', data);
  },

  login: (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/auth/login', data);
  },

  refresh: (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  getProfile: (): Promise<ProfileResponse> => {
    return apiClient.get('/auth/me');
  },
};