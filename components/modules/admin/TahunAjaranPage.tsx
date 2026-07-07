'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Pencil, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { schoolYearsApi } from '@/lib/api/academic';
import type { SchoolYear } from '@/types/academic';
import {
  PageHeader, Button, Card, CardHeader, Badge,
  EmptyState, LoadingSpinner, Modal, FormField,
  Input, Select, ConfirmDialog,
} from '@/components/ui/AdminUI';

export default function TahunAjaranPage() {
  const [years, setYears]           = useState<SchoolYear[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<SchoolYear | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SchoolYear | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [activating, setActivating] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<SchoolYear>>({ semester: 'ganjil', isActive: false });
  const setF = (k: keyof SchoolYear, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await schoolYearsApi.list();
      const payload = res.data.data;
      setYears(Array.isArray(payload) ? payload : ((payload as unknown as { data: SchoolYear[] })?.data ?? []));
    }
    catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      editing?.id ? await schoolYearsApi.update(editing.id, form) : await schoolYearsApi.create(form);
      setModalOpen(false); setEditing(null); setForm({ semester: 'ganjil', isActive: false }); load();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await schoolYearsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  const handleSetActive = async (id: string) => {
    setActivating(id);
    try { await schoolYearsApi.setActive(id); load(); }
    catch (err) { console.error(err); } finally { setActivating(null); }
  };

  const formatDate = (d: string | null) => d
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d))
    : '—';

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="Tahun Ajaran"
        subtitle="Kelola tahun ajaran dan semester aktif"
        action={
          <Button icon={Plus} onClick={() => { setEditing(null); setForm({ semester: 'ganjil', isActive: false }); setModalOpen(true); }} id="btn-tambah-tahun-ajaran">
            Tambah Tahun Ajaran
          </Button>
        }
      />

      <Card noPad>
        <CardHeader title="Daftar Tahun Ajaran" />
        {loading ? <LoadingSpinner /> : years.length === 0 ? (
          <EmptyState icon={Calendar} title="Belum ada tahun ajaran" description="Tambahkan tahun ajaran pertama" />
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {years.map(y => (
              <div key={y.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: y.isActive ? 'var(--color-brand-soft)' : 'var(--color-section)', color: y.isActive ? 'var(--color-brand)' : 'var(--color-muted)' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-[15px]" style={{ color: 'var(--color-text)' }}>{y.academicYear}</p>
                      <Badge variant={y.semester === 'ganjil' ? 'info' : 'warning'}>
                        Semester {y.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                      </Badge>
                      {y.isActive && <Badge variant="success">✓ Aktif</Badge>}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={11} style={{ color: 'var(--color-muted)' }} />
                      <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                        {formatDate(y.startDate)} — {formatDate(y.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!y.isActive && (
                    <Button
                      variant="secondary" size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleSetActive(y.id)}
                      loading={activating === y.id}
                      id={`btn-aktifkan-${y.id}`}
                    >
                      Jadikan Aktif
                    </Button>
                  )}
                  <button type="button" onClick={() => { setEditing(y); setForm(y); setModalOpen(true); }}
                    className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                    <Pencil size={13} />
                  </button>
                  {!y.isActive && (
                    <button type="button" onClick={() => setDeleteTarget(y)}
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'} size="sm">
        <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <FormField label="Tahun Ajaran" required>
            <Input value={form.academicYear || ''} onChange={e => setF('academicYear', e.target.value)} required placeholder="2024/2025" />
          </FormField>
          <FormField label="Semester" required>
            <Select value={form.semester || 'ganjil'} onChange={e => setF('semester', e.target.value)}>
              <option value="ganjil">Ganjil</option><option value="genap">Genap</option>
            </Select>
          </FormField>
          <FormField label="Tanggal Mulai"><Input type="date" value={form.startDate?.slice(0, 10) || ''} onChange={e => setF('startDate', e.target.value)} /></FormField>
          <FormField label="Tanggal Selesai"><Input type="date" value={form.endDate?.slice(0, 10) || ''} onChange={e => setF('endDate', e.target.value)} /></FormField>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Batal</Button>
            <Button type="submit" loading={saving} id="btn-save-tahun-ajaran">{editing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Tahun Ajaran" description={`Yakin ingin menghapus tahun ajaran "${deleteTarget?.academicYear}"?`} />
    </div>
  );
}
