'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Pencil, Trash2, RefreshCw,
  ShieldCheck, UserCheck, GraduationCap, Users2, CheckCircle, XCircle,
} from 'lucide-react';
import { usersApi } from '@/lib/api/endpoints';
import type { User } from '@/types';
import { UserRole, ROLE_LABELS } from '@/types/enums';
import {
  PageHeader, SearchBar, Button, Card, CardHeader,
  Badge, EmptyState, LoadingSpinner, Modal, FormField,
  Input, Select, Pagination, ConfirmDialog,
} from '@/components/ui/AdminUI';

// ── Helpers ───────────────────────────────────────────────
const ROLE_OPTIONS: { value: UserRole | ''; label: string }[] = [
  { value: '', label: 'Semua Role' },
  { value: UserRole.ADMIN,          label: ROLE_LABELS[UserRole.ADMIN] },
  { value: UserRole.KEPALA_SEKOLAH, label: ROLE_LABELS[UserRole.KEPALA_SEKOLAH] },
  { value: UserRole.GURU,           label: ROLE_LABELS[UserRole.GURU] },
  { value: UserRole.SISWA,          label: ROLE_LABELS[UserRole.SISWA] },
  { value: UserRole.ORTU,           label: ROLE_LABELS[UserRole.ORTU] },
];

const ROLE_ICON: Record<string, React.ElementType> = {
  admin:          ShieldCheck,
  super_admin:    ShieldCheck,
  kepala_sekolah: UserCheck,
  guru:           UserCheck,
  siswa:          GraduationCap,
  ortu:           Users2,
};

const ROLE_COLOR: Record<string, string> = {
  admin:          'var(--color-brand)',
  super_admin:    'var(--color-brand)',
  kepala_sekolah: 'var(--color-info)',
  guru:           'var(--color-success)',
  siswa:          'var(--color-warning)',
  ortu:           'var(--color-accent)',
};

function RoleBadge({ role }: { role: string }) {
  const variantMap: Record<string, 'info' | 'success' | 'warning' | 'neutral' | 'danger'> = {
    admin:          'info',
    super_admin:    'info',
    kepala_sekolah: 'info',
    guru:           'success',
    siswa:          'warning',
    ortu:           'neutral',
  };
  const label = ROLE_LABELS[role as UserRole] ?? role;
  return <Badge variant={variantMap[role] ?? 'neutral'}>{label}</Badge>;
}

function UserForm({ initial, onSave, onClose, saving, isEdit }: {
  initial?: Partial<User & { password?: string }>;
  onSave: (d: Partial<User & { password?: string }>) => void;
  onClose: () => void;
  saving: boolean;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Partial<User & { password?: string }>>(
    initial || { role: UserRole.SISWA, isActive: true }
  );
  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nama Lengkap" required>
          <Input value={form.name || ''} onChange={e => set('name', e.target.value)} required placeholder="Nama pengguna" />
        </FormField>
        <FormField label="Email" required>
          <Input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} required placeholder="email@sekolah.id" disabled={isEdit} />
        </FormField>
        {!isEdit && (
          <FormField label="Password" required>
            <Input type="password" value={(form as { password?: string }).password || ''} onChange={e => set('password', e.target.value)} required placeholder="Min. 8 karakter" />
          </FormField>
        )}
        <FormField label="Role" required>
          <Select value={form.role || UserRole.SISWA} onChange={e => set('role', e.target.value)} disabled={isEdit}>
            {Object.values(UserRole).filter(r => r !== UserRole.SUPER_ADMIN).map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="No. HP">
          <Input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" />
        </FormField>
        <FormField label="NIK">
          <Input value={form.nik || ''} onChange={e => set('nik', e.target.value)} placeholder="16 digit NIK" />
        </FormField>
        {isEdit && (
          <FormField label="Status Akun">
            <Select value={form.isActive ? 'true' : 'false'} onChange={e => set('isActive', e.target.value === 'true')}>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </Select>
          </FormField>
        )}
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Batal</Button>
        <Button type="submit" loading={saving} id="btn-save-user">
          {isEdit ? 'Simpan Perubahan' : 'Buat Pengguna'}
        </Button>
      </div>
    </form>
  );
}

export default function PenggunaPage() {
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<User | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
  const [deactivating, setDeactivating]         = useState(false);
  const LIMIT = 15;

  // Stats per role
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: LIMIT,
      });
      // users.service mengembalikan { success, data: [], meta: {} }
      // setelah ResponseInterceptor menjadi { success, data: { success, data: [], meta: {} } }
      const outer = res.data as unknown as Record<string, unknown>;
      const inner = outer?.data as Record<string, unknown> | undefined;

      const list: User[] = Array.isArray(outer?.data)
        ? (outer.data as User[])                        // jika data langsung array
        : Array.isArray(inner?.data)
          ? (inner.data as User[])                      // jika data.data adalah array
          : [];

      const meta = (inner?.meta ?? outer?.meta) as { total: number; totalPages: number } | undefined;

      setUsers(list);
      if (meta) { setTotalPages(meta.totalPages); setTotal(meta.total); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleSave = async (data: Partial<User & { password?: string }>) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await usersApi.update(editing.id, data);
      } else {
        await usersApi.create(data as User & { password: string });
      }
      setModalOpen(false); setEditing(null); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try { await usersApi.deactivate(deactivateTarget.id); setDeactivateTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeactivating(false); }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun pengguna sistem beserta role dan akses"
        action={
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }} id="btn-tambah-pengguna">
            Tambah Pengguna
          </Button>
        }
      />

      {/* Stat per role */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[UserRole.ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.GURU, UserRole.SISWA, UserRole.ORTU].map(r => {
          const Icon = ROLE_ICON[r] ?? Users;
          return (
            <div key={r} className="rounded-2xl p-3.5 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                 style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}
                 onClick={() => setRoleFilter(roleFilter === r ? '' : r)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--color-brand-soft)', color: ROLE_COLOR[r] }}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{roleCounts[r] ?? 0}</p>
                <p className="text-[10px] font-semibold truncate" style={{ color: 'var(--color-muted)' }}>
                  {ROLE_LABELS[r].split(' ')[0]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Card noPad>
        <CardHeader
          title={`Daftar Pengguna${total ? ` (${total})` : ''}`}
          action={<button type="button" onClick={load} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--color-muted)' }}><RefreshCw size={13} /></button>}
        />
        <div className="px-5 py-3 flex gap-3 flex-wrap" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama atau email..." /></div>
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 170 }}>
            {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>

        {loading ? <LoadingSpinner /> : users.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada pengguna" description="Klik 'Tambah Pengguna' untuk membuat akun" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--color-section)', borderBottom: '0.5px solid var(--color-border)' }}>
                  {['No', 'Pengguna', 'Email', 'Role', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const Icon = ROLE_ICON[u.role] ?? Users;
                  return (
                    <tr key={u.id} style={{ borderBottom: '0.5px solid var(--color-section)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-muted)' }}>{(page - 1) * LIMIT + idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                               style={{ background: ROLE_COLOR[u.role] ?? 'var(--color-brand)' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{u.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{u.phone || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{u.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Icon size={12} style={{ color: ROLE_COLOR[u.role], flexShrink: 0 }} />
                          <RoleBadge role={u.role} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {u.isActive
                          ? <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'var(--color-success)' }}><CheckCircle size={12} /> Aktif</span>
                          : <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'var(--color-danger)' }}><XCircle size={12} /> Nonaktif</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button type="button"
                                  onClick={() => { setEditing(u); setModalOpen(true); }}
                                  className="p-1.5 rounded-lg hover:opacity-80"
                                  style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                            <Pencil size={12} />
                          </button>
                          {u.isActive && (
                            <button type="button"
                                    onClick={() => setDeactivateTarget(u)}
                                    className="p-1.5 rounded-lg hover:opacity-80"
                                    style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 pb-4">
              <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onChange={setPage} />
            </div>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
             title={editing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'} size="lg">
        <UserForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          saving={saving}
          isEdit={!!editing}
        />
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        loading={deactivating}
        title="Nonaktifkan Pengguna"
        description={`Yakin ingin menonaktifkan akun "${deactivateTarget?.name}"? Pengguna tidak bisa login setelah dinonaktifkan.`}
      />
    </div>
  );
}
