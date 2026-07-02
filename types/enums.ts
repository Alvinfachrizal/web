export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  KEPALA_SEKOLAH = 'kepala_sekolah',
  GURU = 'guru',
  SISWA = 'siswa',
  ORTU = 'ortu',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin / Tata Usaha',
  [UserRole.KEPALA_SEKOLAH]: 'Kepala Sekolah',
  [UserRole.GURU]: 'Guru / Wali Kelas',
  [UserRole.SISWA]: 'Siswa',
  [UserRole.ORTU]: 'Orang Tua / Wali',
};

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '/admin/dashboard',
  [UserRole.ADMIN]: '/admin/dashboard',
  [UserRole.KEPALA_SEKOLAH]: '/admin/dashboard',
  [UserRole.GURU]: '/guru/dashboard',
  [UserRole.SISWA]: '/siswa/dashboard',
  [UserRole.ORTU]: '/ortu/dashboard',
};
