'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap, Plus, Pencil, Trash2, CheckCircle, XCircle, UserMinus, RefreshCw,
} from 'lucide-react';
import { studentsApi } from '@/lib/api/academic';
import type { Student, StudentStats } from '@/types/academic';
import {
  PageHeader, StatCard, SearchBar, Button, Card, CardHeader,
  Badge, EmptyState, LoadingSpinner, Modal, FormField,
  Input, Select, Textarea, Pagination, ConfirmDialog,
} from '@/components/ui/AdminUI';

function StudentStatusBadge({ status }: { status: Student['status'] }) {
  const map: Record<string, { variant: 'success' | 'info' | 'danger' | 'warning'; label: string }> = {
    aktif: { variant: 'success', label: 'Aktif' }, lulus: { variant: 'info', label: 'Lulus' },
    keluar: { variant: 'danger', label: 'Keluar' }, pindah: { variant: 'warning', label: 'Pindah' },
  };
  const cfg = map[status] ?? { variant: 'neutral' as const, label: status };
  return <Badge variant={cfg.variant as 'success' | 'info' | 'danger' | 'warning' | 'neutral'}>{cfg.label}</Badge>;
}

function StudentForm({ initial, onSave, onClose, saving }: {
  initial?: Partial<Student>; onSave: (d: Partial<Student>) => void;
  onClose: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Student>>(initial || { gender: 'L', status: 'aktif' });
  const set = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedKeys = ['nisn', 'nis', 'name', 'gender', 'birthPlace', 'birthDate', 'religion', 'address', 'phone', 'entryYear', 'status', 'parentName', 'parentPhone', 'parentJob'];
    
    // Build a clean payload
    const payload: Record<string, any> = {};
    
    allowedKeys.forEach(key => {
      let val = (form as any)[key];
      
      // Clean empty strings and zeroes for optional numbers
      if (val !== undefined && val !== '' && val !== null) {
        if (key === 'entryYear') {
          val = Number(val);
          if (val === 0) return; // skip 0
        }
        payload[key] = val;
      }
    });
    
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nama Lengkap" required>
          <Input value={form.name || ''} onChange={e => set('name', e.target.value)} required placeholder="Nama lengkap siswa" />
        </FormField>
        <FormField label="NISN"><Input value={form.nisn || ''} onChange={e => set('nisn', e.target.value)} placeholder="Nomor Induk Siswa Nasional" /></FormField>
        <FormField label="NIS"><Input value={form.nis || ''} onChange={e => set('nis', e.target.value)} placeholder="Nomor Induk Siswa" /></FormField>
        <FormField label="Jenis Kelamin" required>
          <Select value={form.gender || 'L'} onChange={e => set('gender', e.target.value)}>
            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
          </Select>
        </FormField>
        <FormField label="Tempat Lahir"><Input value={form.birthPlace || ''} onChange={e => set('birthPlace', e.target.value)} placeholder="Kota kelahiran" /></FormField>
        <FormField label="Tanggal Lahir"><Input type="date" value={form.birthDate?.slice(0, 10) || ''} onChange={e => set('birthDate', e.target.value)} /></FormField>
        <FormField label="Agama">
          <Select value={form.religion || ''} onChange={e => set('religion', e.target.value)}>
            <option value="">-- Pilih --</option>
            {['Islam', 'Kristen', 'Katholik', 'Hindu', 'Buddha', 'Konghucu'].map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </FormField>
        <FormField label="Status">
          <Select value={form.status || 'aktif'} onChange={e => set('status', e.target.value)}>
            <option value="aktif">Aktif</option><option value="alumni">Alumni</option>
            <option value="keluar">Keluar</option><option value="pindah">Pindah</option>
          </Select>
        </FormField>
        <FormField label="No. HP Siswa"><Input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" /></FormField>
        <FormField label="Nama Orang Tua"><Input value={form.parentName || ''} onChange={e => set('parentName', e.target.value)} placeholder="Nama ayah/ibu/wali" /></FormField>
        <FormField label="No. HP Orang Tua"><Input value={form.parentPhone || ''} onChange={e => set('parentPhone', e.target.value)} placeholder="08xxxxxxxxxx" /></FormField>
        <FormField label="Pekerjaan Orang Tua"><Input value={form.parentJob || ''} onChange={e => set('parentJob', e.target.value)} placeholder="Pekerjaan ayah/ibu/wali" /></FormField>
        <FormField label="Tahun Masuk"><Input type="number" value={(form as any).entryYear || ''} onChange={e => set('entryYear', e.target.value)} placeholder="2024" /></FormField>
      </div>
      <FormField label="Alamat"><Textarea value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="Alamat lengkap siswa" /></FormField>
      
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Batal</Button>
        <Button type="submit" loading={saving} id="btn-save-student">{initial?.id ? 'Simpan Perubahan' : 'Tambah Siswa'}</Button>
      </div>
    </form>
  );
}

export default function SiswaPage() {
  const [students, setStudents]     = useState<Student[]>([]);
  const [stats, setStats]           = useState<StudentStats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Student | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        studentsApi.list({ search, status: statusFilter || undefined, page, limit: LIMIT }),
        studentsApi.stats(),
      ]);
      setStudents(listRes.data.data.data);
      setStats(statsRes.data.data);
      const { meta } = listRes.data.data;
      if (meta) { setTotalPages(meta.totalPages); setTotal(meta.total); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleSave = async (data: Partial<Student>) => {
    setSaving(true);
    try {
      editing?.id ? await studentsApi.update(editing.id, data) : await studentsApi.create(data);
      setModalOpen(false); setEditing(null); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await studentsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader
        title="Data Siswa"
        subtitle="Kelola data siswa dan informasi akademik"
        action={<Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }} id="btn-tambah-siswa">Tambah Siswa</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={GraduationCap} label="Total Siswa"    value={stats?.total ?? '—'} />
        <StatCard icon={CheckCircle}   label="Aktif"          value={stats?.aktif ?? '—'} color="var(--color-success)" />
        <StatCard icon={XCircle}       label="Keluar / Pindah" value={stats?.keluar ?? '—'} color="var(--color-danger)" />
        <StatCard icon={UserMinus}     label="Lulus"          value={stats?.lulus ?? '—'} color="var(--color-info)" />
      </div>

      <Card noPad>
        <CardHeader
          title={`Daftar Siswa${total ? ` (${total})` : ''}`}
          action={<button type="button" onClick={load} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--color-muted)' }}><RefreshCw size={13} /></button>}
        />
        <div className="px-5 py-3 flex gap-3 flex-wrap" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama, NISN, NIS..." /></div>
          <Select value={statusFilter} onChange={e => setStatus(e.target.value)} style={{ width: 140 }}>
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option><option value="lulus">Lulus</option>
            <option value="keluar">Keluar</option><option value="pindah">Pindah</option>
          </Select>
        </div>

        {loading ? <LoadingSpinner /> : students.length === 0 ? (
          <EmptyState icon={GraduationCap} title="Belum ada data siswa" description="Klik 'Tambah Siswa' untuk menambahkan" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--color-section)', borderBottom: '0.5px solid var(--color-border)' }}>
                  {['No', 'Nama Siswa', 'NISN / NIS', 'L/P', 'Status', 'Orang Tua', 'HP Ortu', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: '0.5px solid var(--color-section)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-muted)' }}>{(page - 1) * LIMIT + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: 'var(--color-brand)' }}>
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: 'var(--color-text)' }}>{s.name}</p>
                          <p style={{ color: 'var(--color-muted)' }}>{s.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div style={{ color: 'var(--color-text)' }}>{s.nisn || '—'}</div><div style={{ color: 'var(--color-muted)' }}>{s.nis || '—'}</div></td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>{s.gender}</td>
                    <td className="px-4 py-3"><StudentStatusBadge status={s.status} /></td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{s.parentName || '—'}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{s.parentPhone || s.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => { setEditing(s); setModalOpen(true); }} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}><Pencil size={12} /></button>
                        <button type="button" onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}><Trash2 size={12} /></button>
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

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Data Siswa' : 'Tambah Siswa Baru'} size="lg">
        <StudentForm initial={editing ?? undefined} onSave={handleSave} onClose={() => { setModalOpen(false); setEditing(null); }} saving={saving} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Data Siswa" description={`Yakin ingin menghapus data "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`} />
    </div>
  );
}
