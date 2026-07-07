import apiClient from './client';
import type { LoginPayload, LoginResponse, ApiResponse, PaginatedResponse, User } from '@/types';

// ── Auth Endpoints ───────────────────────────────────────
export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload),

  logout: () => apiClient.post('/auth/logout'),

  refresh: () => apiClient.post('/auth/refresh'),

  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/auth/change-password', data),
};

// ── Users Endpoints ──────────────────────────────────────
export const usersApi = {
  list: (params?: { role?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params }),

  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: Partial<User> & { password: string }) =>
    apiClient.post<ApiResponse<User>>('/users', data),

  update: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  deactivate: (id: string) => apiClient.delete(`/users/${id}`),
};
