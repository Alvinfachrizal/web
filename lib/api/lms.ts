import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types';

// LMS Types
export enum MaterialType {
  DOCUMENT = 'document',
  VIDEO = 'video',
  LINK = 'link',
  OTHER = 'other',
}

export interface Material {
  id: string;
  schoolId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  type: MaterialType;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  teacher?: { id: string; name: string };
}

export interface Assignment {
  id: string;
  schoolId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  teacher?: { id: string; name: string };
  submissions?: Submission[];
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  textContent?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; name: string };
}

// ── Materials Endpoints ─────────────────────────────────────
export const materialsApi = {
  list: (params: { classId: string; subjectId?: string }) =>
    apiClient.get<ApiResponse<Material[]>>('/lms/materials', { params }),
  create: (data: Partial<Material>) =>
    apiClient.post<ApiResponse<Material>>('/lms/materials', data),
  update: (id: string, data: Partial<Material>) =>
    apiClient.patch<ApiResponse<Material>>(`/lms/materials/${id}`, data),
  delete: (id: string) => apiClient.delete(`/lms/materials/${id}`),
};

// ── Assignments Endpoints ───────────────────────────────────
export const assignmentsApi = {
  list: (params: { classId: string; subjectId?: string }) =>
    apiClient.get<ApiResponse<Assignment[]>>('/lms/assignments', { params }),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Assignment>>(`/lms/assignments/${id}`),
  create: (data: Partial<Assignment>) =>
    apiClient.post<ApiResponse<Assignment>>('/lms/assignments', data),
  update: (id: string, data: Partial<Assignment>) =>
    apiClient.patch<ApiResponse<Assignment>>(`/lms/assignments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/lms/assignments/${id}`),
};

// ── Submissions Endpoints ───────────────────────────────────
export const submissionsApi = {
  submit: (assignmentId: string, data: { fileUrl?: string; textContent?: string }) =>
    apiClient.post<ApiResponse<Submission>>(`/lms/assignments/${assignmentId}/submit`, data),
  grade: (submissionId: string, data: { score: number; feedback?: string }) =>
    apiClient.post<ApiResponse<Submission>>(`/lms/submissions/${submissionId}/grade`, data),
};
