'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserCheck, Plus, Pencil, Trash2, RefreshCw, Briefcase, Award } from 'lucide-react';
import { teachersApi } from '@/lib/api/academic';
import type { Teacher, TeacherStats } from '@/types/academic';
import {
  PageHeader, StatCard, SearchBar, Button, Card, CardHeader,
  Badge, EmptyState, LoadingSpinner, Modal, FormField,
  Input, Select, Textarea, Pagination, ConfirmDialog,
} from '@/components/ui/AdminUI';

function TeacherStatusBadge({ status }: { status: Teacher['status'] }) {
  const map: Record<string, { variant: 'success' | 'info' | 'danger' | 'warning'; label: string }> = {
    aktif: { variant: 'success', label: 'Aktif' }, cuti: { variant: 'warning', label: 'Cuti' },
    pensiun: { variant: 'info', label: 'Pensiun' }, keluar: { variant: 'danger', label: 'Keluar' },
  };
  const cfg = map[status] ?? { variant: 'neutral' as const, label: status };
  return <Badge variant={cfg.variant as 'success' | 'info' | 'danger' | 'warning' | 'neutral'}>{cfg.label}</Badge>;
}

function EmploymentBadge({ type }: { type: Teacher['employmentType'] }) {
  const map: Record<string, { variant: 'success' | 'info' | 'warning' | 'neutral'; label: string }> = {
    pns: { variant: 'success', label: 'PNS' }, honorer: { variant: 'warning', label: 'Honorer' },
    kontrak: { variant: 'info', label: 'Kontrak' }, yayasan: { variant: 'neutral', label: 'Yayasan' },
  };
  const cfg = map[type] ?? { variant: 'neutral' as const, label: type };
  return <Badge variant={cfg.variant as 'success' | 'info' | 'warning' | 'neutral'}>{cfg.label}</Badge>;
}

function TeacherForm({ initial, onSave, onClose, saving }: {
  initial?: Partial<Teacher>; onSave: (d: Partial<Teacher>) => void;
  onClose: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Teacher>>(initial || { gender: 'L', status: 'aktif', employmentType: 'honorer' });
  const set = (k: keyof Teacher, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nama Lengkap" required>
          <Input value={form.name || ''} onChange={e => set('name', e.target.value)} required placeholder="Nama lengkap guru" />
        </FormField>
        <FormField label="NIP"><Input value={form.nip || ''} onChange={e => set('nip', e.target.value)} placeholder="Nomor Induk Pegawai" /></FormField>
        <FormField label="Jenis Kelamin" required>
          <Select value={form.gender || 'L'} onChange={e => set('gender', e.target.value)}>
            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
          </Select>
        </FormField>
        <FormField label="Status Kepegawaian">
          <Select value={form.employmentType || 'honorer'} onChange={e => set('employmentType', e.target.value)}>
            <option value="pns">PNS</option><option value="honorer">Honorer</option>
            <option value="kontrak">Kontrak</option><option value="yayasan">Yayasan</option>
          </Select>
        </FormField>
        <FormField label="Status Aktif">
          <Select value={form.status || 'aktif'} onChange={e => set('status', e.target.value)}>
            <option value="aktif">Aktif</option><option value="cuti">Cuti</option>
            <option value="pensiun">Pensiun</option><option value="keluar">Keluar</option>
          </Select>
        </FormField>
        <FormField label="Tempat Lahir"><Input value={form.birthPlace || ''} onChange={e => set('birthPlace', e.target.value)} placeholder="Kota kelahiran" /></FormField>
        <FormField label="Tanggal Lahir"><Input type="date" value={form.birthDate?.slice(0, 10) || ''} onChange={e => set('birthDate', e.target.value)} /></FormField>
        <FormField label="No. HP"><Input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" /></FormField>
        <FormField label="Email"><Input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="email@guru.com" /></FormField>
        <FormField label="Pendidikan Terakhir">
          <Select value={form.education || ''} onChange={e => set('education', e.target.value)}>
            <option value="">-- Pilih --</option>
            {['D3', 'S1', 'S2', 'S3'].map(e => <option key={e} value={e}>{e}</option>)}
          </Select>
        </FormField>
        <FormField label="Jurusan / Bidang Studi"><Input value={form.major || ''} onChange={e => set('major', e.target.value)} placeholder="Matematika, IPA, dsb." /></FormField>
        <FormField label="Tanggal Bergabung"><Input type="date" value={form.joinDate?.slice(0, 10) || ''} onChange={e => set('joinDate', e.target.value)} /></FormField>
      </div>
      <FormField label="Alamat"><Textarea value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="Alamat lengkap" /></FormField>
      <FormField label="Catatan"><Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Catatan tambahan" /></FormField>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Batal</Button>
        <Button type="submit" loading={saving} id="btn-save-teacher">{initial?.id ? 'Simpan Perubahan' : 'Tambah Guru'}</Button>
      </div>
    </form>
  );
}

export default function GuruPage() {
  const [teachers, setTeachers]     = useState<Teacher[]>([]);
  const [stats, setStats]           = useState<TeacherStats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Teacher | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        teachersApi.list({ search, status: statusFilter || undefined, page, limit: LIMIT }),
        teachersApi.stats(),
      ]);
      setTeachers(listRes.data.data.data);
      setStats(statsRes.data.data);
      const { meta } = listRes.data.data;
      if (meta) { setTotalPages(meta.totalPages); setTotal(meta.total); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleSave = async (data: Partial<Teacher>) => {
    setSaving(true);
    try {
      editing?.id ? await teachersApi.update(editing.id, data) : await teachersApi.create(data);
      setModalOpen(false); setEditing(null); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await teachersApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Data Guru"
        subtitle="Kelola data guru dan tenaga pengajar"
        action={<Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }} id="btn-tambah-guru">Tambah Guru</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={UserCheck} label="Total Guru" value={stats?.total ?? '—'} />
        <StatCard icon={Award}     label="Aktif"      value={stats?.aktif ?? '—'} color="var(--color-success)" />
        <StatCard icon={Briefcase} label="PNS"        value={stats?.pns ?? '—'}   color="var(--color-info)" />
        <StatCard icon={UserCheck} label="Honorer"    value={stats?.honorer ?? '—'} color="var(--color-warning)" />
      </div>

      <Card noPad>
        <CardHeader
          title={`Daftar Guru${total ? ` (${total})` : ''}`}
          action={<button type="button" onClick={load} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--color-muted)' }}><RefreshCw size={13} /></button>}
        />
        <div className="px-5 py-3 flex gap-3 flex-wrap" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama, NIP..." /></div>
          <Select value={statusFilter} onChange={e => setStatus(e.target.value)} style={{ width: 140 }}>
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option><option value="cuti">Cuti</option>
            <option value="pensiun">Pensiun</option><option value="keluar">Keluar</option>
          </Select>
        </div>

        {loading ? <LoadingSpinner /> : teachers.length === 0 ? (
          <EmptyState icon={UserCheck} title="Belum ada data guru" description="Klik 'Tambah Guru' untuk menambahkan" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--color-section)', borderBottom: '0.5px solid var(--color-border)' }}>
                  {['No', 'Nama Guru', 'NIP', 'L/P', 'Kepegawaian', 'Bidang Studi', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, idx) => (
                  <tr key={t.id} style={{ borderBottom: '0.5px solid var(--color-section)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-muted)' }}>{(page - 1) * LIMIT + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'var(--color-info)' }}>{t.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="font-bold" style={{ color: 'var(--color-text)' }}>{t.name}</p>
                          <p style={{ color: 'var(--color-muted)' }}>{t.email || t.phone || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--color-text)' }}>{t.nip || '—'}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>{t.gender}</td>
                    <td className="px-4 py-3"><EmploymentBadge type={t.employmentType} /></td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{t.major || '—'}</td>
                    <td className="px-4 py-3"><TeacherStatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => { setEditing(t); setModalOpen(true); }} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}><Pencil size={12} /></button>
                        <button type="button" onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 pb-4">
              <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onChange={setPage} />
            </div>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Data Guru' : 'Tambah Guru Baru'} size="lg">
        <TeacherForm initial={editing ?? undefined} onSave={handleSave} onClose={() => { setModalOpen(false); setEditing(null); }} saving={saving} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Data Guru" description={`Yakin ingin menghapus data "${deleteTarget?.name}"?`} />
    </div>
  );
}
