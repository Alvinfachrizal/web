import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types';
import type {
  SchoolYear, Major, SchoolClass, Subject,
  Student, StudentStats, Teacher, TeacherStats,
} from '@/types/academic';

// ── Academic Endpoints ────────────────────────────────────

export const schoolYearsApi = {
  list: () => apiClient.get<ApiResponse<SchoolYear[]>>('/academic/school-years'),
  getById: (id: string) => apiClient.get<ApiResponse<SchoolYear>>(`/academic/school-years/${id}`),
  create: (data: Partial<SchoolYear>) => apiClient.post<ApiResponse<SchoolYear>>('/academic/school-years', data),
  update: (id: string, data: Partial<SchoolYear>) => apiClient.patch<ApiResponse<SchoolYear>>(`/academic/school-years/${id}`, data),
  delete: (id: string) => apiClient.delete(`/academic/school-years/${id}`),
  setActive: (id: string) => apiClient.patch(`/academic/school-years/${id}/set-active`),
};

export const majorsApi = {
  list: () => apiClient.get<ApiResponse<Major[]>>('/academic/majors'),
  getById: (id: string) => apiClient.get<ApiResponse<Major>>(`/academic/majors/${id}`),
  create: (data: Partial<Major>) => apiClient.post<ApiResponse<Major>>('/academic/majors', data),
  update: (id: string, data: Partial<Major>) => apiClient.patch<ApiResponse<Major>>(`/academic/majors/${id}`, data),
  delete: (id: string) => apiClient.delete(`/academic/majors/${id}`),
};

export const classesApi = {
  list: (params?: { schoolYearId?: string }) =>
    apiClient.get<ApiResponse<SchoolClass[]>>('/academic/classes', { params }),
  getById: (id: string) => apiClient.get<ApiResponse<SchoolClass>>(`/academic/classes/${id}`),
  create: (data: Partial<SchoolClass>) => apiClient.post<ApiResponse<SchoolClass>>('/academic/classes', data),
  update: (id: string, data: Partial<SchoolClass>) => apiClient.patch<ApiResponse<SchoolClass>>(`/academic/classes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/academic/classes/${id}`),
};

export const subjectsApi = {
  list: () => apiClient.get<ApiResponse<Subject[]>>('/academic/subjects'),
  getById: (id: string) => apiClient.get<ApiResponse<Subject>>(`/academic/subjects/${id}`),
  create: (data: Partial<Subject>) => apiClient.post<ApiResponse<Subject>>('/academic/subjects', data),
  update: (id: string, data: Partial<Subject>) => apiClient.patch<ApiResponse<Subject>>(`/academic/subjects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/academic/subjects/${id}`),
};

// ── Students Endpoints ────────────────────────────────────

export const studentsApi = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Student>>('/students', { params }),
  getById: (id: string) => apiClient.get<ApiResponse<Student>>(`/students/${id}`),
  create: (data: Partial<Student>) => apiClient.post<ApiResponse<Student>>('/students', data),
  update: (id: string, data: Partial<Student>) => apiClient.patch<ApiResponse<Student>>(`/students/${id}`, data),
  delete: (id: string) => apiClient.delete(`/students/${id}`),
  assignClass: (id: string, data: { classId: string; schoolYearId: string }) =>
    apiClient.post(`/students/${id}/assign-class`, data),
  stats: () => apiClient.get<ApiResponse<StudentStats>>('/students/stats'),
};

// ── Teachers Endpoints ────────────────────────────────────

export const teachersApi = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Teacher>>('/teachers', { params }),
  getById: (id: string) => apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`),
  create: (data: Partial<Teacher>) => apiClient.post<ApiResponse<Teacher>>('/teachers', data),
  update: (id: string, data: Partial<Teacher>) => apiClient.patch<ApiResponse<Teacher>>(`/teachers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teachers/${id}`),
  stats: () => apiClient.get<ApiResponse<TeacherStats>>('/teachers/stats'),
};
