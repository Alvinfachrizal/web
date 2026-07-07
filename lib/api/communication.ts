import apiClient from './client';
import type { ApiResponse } from '@/types';
import { UserRole } from '@/types/enums';

export interface Announcement {
  id: string;
  schoolId: string;
  authorId: string;
  title: string;
  content: string;
  targetRoles?: UserRole[];
  targetClassIds?: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string };
}

export const communicationApi = {
  list: (params?: { role?: UserRole; classId?: string }) =>
    apiClient.get<ApiResponse<Announcement[]>>('/communication/announcements', { params }),
  create: (data: Partial<Announcement>) =>
    apiClient.post<ApiResponse<Announcement>>('/communication/announcements', data),
  update: (id: string, data: Partial<Announcement>) =>
    apiClient.patch<ApiResponse<Announcement>>(`/communication/announcements/${id}`, data),
  delete: (id: string) => apiClient.delete(`/communication/announcements/${id}`),
};
