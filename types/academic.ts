// ── Academic Types ────────────────────────────────────────

export type SemesterType = 'ganjil' | 'genap';
export type MajorType = 'IPA' | 'IPS' | 'Bahasa' | 'Umum';
export type SubjectType = 'wajib' | 'pilihan' | 'ekstra';

export interface SchoolYear {
  id: string;
  academicYear: string;
  semester: SemesterType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Major {
  id: string;
  name: string;
  code: string;
  type: MajorType;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: number;
  majorId: string | null;
  major?: Major;
  schoolYearId: string;
  schoolYear?: SchoolYear;
  homeroomTeacherId: string | null;
  roomNumber: string | null;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  type: SubjectType;
  weeklyHours: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Student Types ─────────────────────────────────────────

export type Gender = 'L' | 'P';
export type StudentStatus = 'aktif' | 'lulus' | 'keluar' | 'pindah';

export interface Student {
  id: string;
  userId: string | null;
  nisn: string | null;
  nis: string | null;
  name: string;
  gender: Gender;
  birthPlace: string | null;
  birthDate: string | null;
  religion: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  parentName: string | null;
  parentPhone: string | null;
  status: StudentStatus;
  photo: string | null;
  enrollmentYear: number | null;
  graduationYear: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  currentClass?: SchoolClass | null;
}

export interface StudentStats {
  total: number;
  aktif: number;
  lulus: number;
  keluar: number;
}

// ── Teacher Types ─────────────────────────────────────────

export type TeacherStatus = 'aktif' | 'cuti' | 'pensiun' | 'keluar';
export type EmploymentType = 'pns' | 'honorer' | 'kontrak' | 'yayasan';

export interface Teacher {
  id: string;
  userId: string | null;
  nip: string | null;
  name: string;
  gender: Gender;
  birthPlace: string | null;
  birthDate: string | null;
  religion: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  education: string | null;
  major: string | null;
  employmentType: EmploymentType;
  status: TeacherStatus;
  joinDate: string | null;
  photo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherStats {
  total: number;
  aktif: number;
  pns: number;
  honorer: number;
}
