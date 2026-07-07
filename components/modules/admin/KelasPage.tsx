'use client';

import { useState, useEffect, useCallback } from 'react';
import { School, BookOpen, Plus, Pencil, Trash2, RefreshCw, Layers } from 'lucide-react';
import { classesApi, subjectsApi, majorsApi, schoolYearsApi } from '@/lib/api/academic';
import type { SchoolClass, Subject, Major, SchoolYear } from '@/types/academic';
import {
  PageHeader, SearchBar, Button, Card, CardHeader,
  Badge, EmptyState, LoadingSpinner, Modal, FormField,
  Input, Select, Textarea, ConfirmDialog,
} from '@/components/ui/AdminUI';
import { cn } from '@/lib/utils';

type Tab = 'kelas' | 'mapel' | 'jurusan';

// ── Kelas Tab ─────────────────────────────────────────────
function KelasTab() {
  const [classes, setClasses]       = useState<SchoolClass[]>([]);
  const [years, setYears]           = useState<SchoolYear[]>([]);
  const [majors, setMajors]         = useState<Major[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<SchoolClass | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const [form, setForm] = useState<Partial<SchoolClass>>({ grade: 10, capacity: 36 });
  const setF = (k: keyof SchoolClass, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, yRes, mRes] = await Promise.all([
        classesApi.list(yearFilter ? { schoolYearId: yearFilter } : undefined),
        schoolYearsApi.list(),
        majorsApi.list(),
      ]);
      const toArr = <T,>(d: unknown): T[] => Array.isArray(d) ? d as T[] : ((d as { data?: T[] })?.data ?? []);
      setClasses(toArr<SchoolClass>(cRes.data.data));
      setYears(toArr<SchoolYear>(yRes.data.data));
      setMajors(toArr<Major>(mRes.data.data));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [yearFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setSaving(true);
    try {
      editing?.id ? await classesApi.update(editing.id, form) : await classesApi.create(form);
      setModalOpen(false); setEditing(null); setForm({ grade: 10, capacity: 36 }); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await classesApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  const openEdit = (c: SchoolClass) => { setEditing(c); setForm(c); setModalOpen(true); };
  const openAdd  = () => { setEditing(null); setForm({ grade: 10, capacity: 36 }); setModalOpen(true); };

  return (
    <>
      <div className="px-5 py-3 flex gap-3 flex-wrap items-center justify-between" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="flex-1 min-w-[180px]"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama kelas..." /></div>
          <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ width: 160 }}>
            <option value="">Semua Tahun Ajaran</option>
            {years.map(y => <option key={y.id} value={y.id}>{y.academicYear} {y.semester}</option>)}
          </Select>
        </div>
        <Button icon={Plus} onClick={openAdd} id="btn-tambah-kelas">Tambah Kelas</Button>
      </div>
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={School} title="Belum ada kelas" description="Tambahkan kelas terlebih dahulu" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: 'var(--color-section)', borderBottom: '0.5px solid var(--color-border)' }}>
                {['Nama Kelas', 'Tingkat', 'Jurusan', 'Tahun Ajaran', 'Kapasitas', 'Ruang', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '0.5px solid var(--color-section)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--color-text)' }}>{c.name}</td>
                  <td className="px-4 py-3"><Badge variant="info">Kelas {c.grade}</Badge></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{c.major?.name || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{c.schoolYear?.academicYear || '—'}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>{c.capacity} siswa</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{c.roomNumber || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}><Pencil size={12} /></button>
                      <button type="button" onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kelas' : 'Tambah Kelas'} size="md">
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nama Kelas" required>
              <Input value={form.name || ''} onChange={e => setF('name', e.target.value)} required placeholder="X IPA 1" />
            </FormField>
            <FormField label="Tingkat Kelas" required>
              <Select value={form.grade || 10} onChange={e => setF('grade', Number(e.target.value))}>
                <option value={10}>Kelas 10</option><option value={11}>Kelas 11</option><option value={12}>Kelas 12</option>
              </Select>
            </FormField>
            <FormField label="Tahun Ajaran">
              <Select value={form.schoolYearId || ''} onChange={e => setF('schoolYearId', e.target.value)}>
                <option value="">-- Pilih --</option>
                {years.map(y => <option key={y.id} value={y.id}>{y.academicYear} ({y.semester})</option>)}
              </Select>
            </FormField>
            <FormField label="Jurusan">
              <Select value={form.majorId || ''} onChange={e => setF('majorId', e.target.value)}>
                <option value="">-- Pilih --</option>
                {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Kapasitas">
              <Input type="number" value={form.capacity || 36} onChange={e => setF('capacity', Number(e.target.value))} />
            </FormField>
            <FormField label="No. Ruang">
              <Input value={form.roomNumber || ''} onChange={e => setF('roomNumber', e.target.value)} placeholder="R-101" />
            </FormField>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Batal</Button>
            <Button type="submit" loading={saving} id="btn-save-kelas">{editing ? 'Simpan' : 'Tambah Kelas'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Kelas" description={`Yakin ingin menghapus kelas "${deleteTarget?.name}"?`} />
    </>
  );
}

// ── Mapel Tab ─────────────────────────────────────────────
function MapelTab() {
  const [subjects, setSubjects]     = useState<Subject[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Subject | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [form, setForm] = useState<Partial<Subject>>({ type: 'wajib', creditHours: 2 });
  const setF = (k: keyof Subject, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subjectsApi.list();
      const d = res.data.data;
      setSubjects(Array.isArray(d) ? d : ((d as unknown as { data: Subject[] })?.data ?? []));
    }
    catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setSaving(true);
    try {
      editing?.id ? await subjectsApi.update(editing.id, form) : await subjectsApi.create(form);
      setModalOpen(false); setEditing(null); setForm({ type: 'wajib', creditHours: 2 }); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await subjectsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  const typeVariant: Record<string, 'success' | 'info' | 'warning'> = { wajib: 'success', pilihan: 'info', ekstra: 'warning' };
  const typeLabel: Record<string, string> = { wajib: 'Wajib', pilihan: 'Pilihan', ekstra: 'Ekstra' };

  return (
    <>
      <div className="px-5 py-3 flex gap-3 flex-wrap items-center justify-between" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Cari nama atau kode mapel..." /></div>
        <Button icon={Plus} onClick={() => { setEditing(null); setForm({ type: 'wajib', creditHours: 2 }); setModalOpen(true); }} id="btn-tambah-mapel">Tambah Mapel</Button>
      </div>
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Belum ada mata pelajaran" description="Tambahkan mata pelajaran terlebih dahulu" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: 'var(--color-section)', borderBottom: '0.5px solid var(--color-border)' }}>
                {['Nama Mata Pelajaran', 'Kode', 'Tipe', 'Jam / Minggu', 'Keterangan', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '0.5px solid var(--color-section)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--color-text)' }}>{s.name}</td>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--color-muted)' }}>{s.code}</td>
                  <td className="px-4 py-3"><Badge variant={typeVariant[s.type] || 'neutral'}>{typeLabel[s.type] || s.type}</Badge></td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>{s.creditHours} jam</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{s.description || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => { setEditing(s); setForm(s); setModalOpen(true); }} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}><Pencil size={12} /></button>
                      <button type="button" onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} size="md">
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nama Mata Pelajaran" required>
              <Input value={form.name || ''} onChange={e => setF('name', e.target.value)} required placeholder="Matematika" />
            </FormField>
            <FormField label="Kode Mapel" required>
              <Input value={form.code || ''} onChange={e => setF('code', e.target.value.toUpperCase())} required placeholder="MTK" />
            </FormField>
            <FormField label="Tipe">
              <Select value={form.type || 'wajib'} onChange={e => setF('type', e.target.value)}>
                <option value="wajib">Wajib</option><option value="pilihan">Pilihan</option><option value="ekstra">Ekstra</option>
              </Select>
            </FormField>
            <FormField label="Jam / Minggu">
              <Input type="number" value={form.creditHours || 2} onChange={e => setF('creditHours', Number(e.target.value))} min={1} max={20} />
            </FormField>
          </div>
          <FormField label="Deskripsi"><Textarea value={form.description || ''} onChange={e => setF('description', e.target.value)} placeholder="Deskripsi singkat mata pelajaran" /></FormField>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Batal</Button>
            <Button type="submit" loading={saving} id="btn-save-mapel">{editing ? 'Simpan' : 'Tambah Mapel'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Mata Pelajaran" description={`Yakin ingin menghapus "${deleteTarget?.name}"?`} />
    </>
  );
}

// ── Jurusan Tab ───────────────────────────────────────────
function JurusanTab() {
  const [majors, setMajors]         = useState<Major[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Major | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Major | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [form, setForm] = useState<Partial<Major>>({ type: 'IPA' });
  const setF = (k: keyof Major, v: string) => setForm(p => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await majorsApi.list();
      const d = res.data.data;
      setMajors(Array.isArray(d) ? d : ((d as unknown as { data: Major[] })?.data ?? []));
    }
    catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      editing?.id ? await majorsApi.update(editing.id, form) : await majorsApi.create(form);
      setModalOpen(false); setEditing(null); setForm({ type: 'IPA' }); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await majorsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  return (
    <>
      <div className="px-5 py-3 flex justify-end" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <Button icon={Plus} onClick={() => { setEditing(null); setForm({ type: 'IPA' }); setModalOpen(true); }} id="btn-tambah-jurusan">Tambah Jurusan</Button>
      </div>
      {loading ? <LoadingSpinner /> : majors.length === 0 ? (
        <EmptyState icon={Layers} title="Belum ada jurusan" />
      ) : (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {majors.map(m => (
            <div key={m.id} className="rounded-xl p-4 flex items-start justify-between gap-2"
              style={{ background: 'var(--color-page)', border: '0.5px solid var(--color-border)' }}>
              <div>
                <p className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>{m.name}</p>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--color-muted)' }}>{m.code}</p>
                <Badge variant="info" className="mt-2">{m.type}</Badge>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button type="button" onClick={() => { setEditing(m); setForm(m); setModalOpen(true); }} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}><Pencil size={12} /></button>
                <button type="button" onClick={() => setDeleteTarget(m)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Jurusan' : 'Tambah Jurusan'} size="sm">
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <FormField label="Nama Jurusan" required><Input value={form.name || ''} onChange={e => setF('name', e.target.value)} required placeholder="IPA / IPS" /></FormField>
          <FormField label="Kode"><Input value={form.code || ''} onChange={e => setF('code', e.target.value.toUpperCase())} placeholder="IPA" /></FormField>
          <FormField label="Tipe">
            <Select value={form.type || 'IPA'} onChange={e => setF('type', e.target.value)}>
              <option value="IPA">IPA</option><option value="IPS">IPS</option>
              <option value="Bahasa">Bahasa</option><option value="Umum">Umum</option>
            </Select>
          </FormField>
          <FormField label="Deskripsi"><Textarea value={form.description || ''} onChange={e => setF('description', e.target.value)} /></FormField>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Batal</Button>
            <Button type="submit" loading={saving} id="btn-save-jurusan">{editing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Jurusan" description={`Yakin ingin menghapus jurusan "${deleteTarget?.name}"?`} />
    </>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function KelasPage() {
  const [tab, setTab] = useState<Tab>('kelas');
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'kelas', label: 'Kelas', icon: School },
    { key: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },
    { key: 'jurusan', label: 'Jurusan', icon: Layers },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader title="Kelas & Mata Pelajaran" subtitle="Kelola kelas, mata pelajaran, dan jurusan sekolah" />

      <Card noPad>
        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn('flex items-center gap-2 px-5 py-3.5 text-[12px] font-bold transition-all relative')}
              style={{ color: tab === key ? 'var(--color-brand)' : 'var(--color-muted)' }}
            >
              <Icon size={14} />
              {label}
              {tab === key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: 'var(--color-brand)' }} />
              )}
            </button>
          ))}
          <div className="ml-auto px-3 py-2 flex items-center">
            <button type="button" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--color-muted)' }}><RefreshCw size={13} /></button>
          </div>
        </div>

        {tab === 'kelas'   && <KelasTab />}
        {tab === 'mapel'   && <MapelTab />}
        {tab === 'jurusan' && <JurusanTab />}
      </Card>
    </div>
  );
}
