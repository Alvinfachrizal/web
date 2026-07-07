'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, FileText, Plus, Pencil, Trash2, Layers, Calendar, Link as LinkIcon, Video, CheckCircle, Clock } from 'lucide-react';
import { materialsApi, assignmentsApi, Material, Assignment, MaterialType } from '@/lib/api/lms';
import { classesApi, subjectsApi } from '@/lib/api/academic';
import type { SchoolClass, Subject } from '@/types/academic';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/enums';
import {
  PageHeader, Button, Card, Badge, EmptyState, LoadingSpinner,
  Modal, FormField, Input, Select, Textarea, ConfirmDialog
} from '@/components/ui/AdminUI';
import { cn } from '@/lib/utils';

type Tab = 'materi' | 'tugas';

export default function LmsPage() {
  const { user } = useAuthStore();
  const canEdit = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.GURU].includes(user?.role as UserRole);

  const [tab, setTab] = useState<Tab>('materi');
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [matModal, setMatModal] = useState(false);
  const [assModal, setAssModal] = useState(false);
  const [editingMat, setEditingMat] = useState<Material | null>(null);
  const [editingAss, setEditingAss] = useState<Assignment | null>(null);
  const [deleteMat, setDeleteMat] = useState<Material | null>(null);
  const [deleteAss, setDeleteAss] = useState<Assignment | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Forms
  const [matForm, setMatForm] = useState<Partial<Material>>({ type: MaterialType.DOCUMENT });
  const [assForm, setAssForm] = useState<Partial<Assignment>>({ maxScore: 100 });

  // 1. Load Filter Options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cRes, sRes] = await Promise.all([classesApi.list(), subjectsApi.list()]);
        const toArr = <T,>(d: any): T[] => Array.isArray(d) ? d : (d?.data ?? []);
        const cls = toArr<SchoolClass>(cRes.data.data);
        const sub = toArr<Subject>(sRes.data.data);
        setClasses(cls);
        setSubjects(sub);
        if (cls.length > 0) setClassId(cls[0].id);
        if (sub.length > 0) setSubjectId(sub[0].id);
      } catch (err) { console.error(err); }
    };
    loadFilters();
  }, []);

  // 2. Load Data
  const loadData = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const params = { classId, subjectId: subjectId || undefined };
      const [mRes, aRes] = await Promise.all([
        materialsApi.list(params),
        assignmentsApi.list(params)
      ]);
      const toArr = <T,>(d: any): T[] => Array.isArray(d) ? d : (d?.data ?? []);
      setMaterials(toArr<Material>(mRes.data.data));
      setAssignments(toArr<Assignment>(aRes.data.data));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [classId, subjectId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Actions
  const handleSaveMat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...matForm, classId, subjectId };
      if (editingMat) await materialsApi.update(editingMat.id, payload);
      else await materialsApi.create(payload);
      setMatModal(false); setEditingMat(null); loadData();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDeleteMat = async () => {
    if (!deleteMat) return;
    setDeleting(true);
    try { await materialsApi.delete(deleteMat.id); setDeleteMat(null); loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  const handleSaveAss = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...assForm, classId, subjectId };
      // Format dueDate to ISO if exists
      if (payload.dueDate && !payload.dueDate.includes('T')) {
        payload.dueDate = new Date(payload.dueDate).toISOString();
      }
      if (editingAss) await assignmentsApi.update(editingAss.id, payload);
      else await assignmentsApi.create(payload);
      setAssModal(false); setEditingAss(null); loadData();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDeleteAss = async () => {
    if (!deleteAss) return;
    setDeleting(true);
    try { await assignmentsApi.delete(deleteAss.id); setDeleteAss(null); loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  const getMatIcon = (type: MaterialType) => {
    if (type === MaterialType.VIDEO) return <Video size={16} />;
    if (type === MaterialType.LINK) return <LinkIcon size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader title="Materi & LMS" subtitle="Kelola bahan ajar dan tugas sekolah" />

      {/* Filter Bar */}
      <Card noPad className="p-4 flex gap-4 flex-wrap items-end bg-gradient-to-r from-[var(--color-brand-soft)] to-transparent">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold text-[var(--color-brand-dark)] uppercase tracking-wider mb-1 block">Pilih Kelas</label>
          <Select value={classId} onChange={e => setClassId(e.target.value)}>
            <option value="">-- Pilih Kelas --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold text-[var(--color-brand-dark)] uppercase tracking-wider mb-1 block">Pilih Mata Pelajaran</label>
          <Select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            <option value="">Semua Mata Pelajaran</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
      </Card>

      {!classId ? (
        <EmptyState icon={Layers} title="Pilih kelas terlebih dahulu" description="Silakan pilih kelas pada filter di atas untuk melihat materi dan tugas." />
      ) : (
        <Card noPad>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
            <button onClick={() => setTab('materi')} className={cn("flex-1 py-3.5 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors", tab === 'materi' ? "text-[var(--color-brand)] border-b-2 border-[var(--color-brand)]" : "text-[var(--color-muted)] hover:bg-[var(--color-page)]")}>
              <BookOpen size={16} /> Materi
            </button>
            <button onClick={() => setTab('tugas')} className={cn("flex-1 py-3.5 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors", tab === 'tugas' ? "text-[var(--color-brand)] border-b-2 border-[var(--color-brand)]" : "text-[var(--color-muted)] hover:bg-[var(--color-page)]")}>
              <FileText size={16} /> Tugas & Kuis
            </button>
          </div>

          <div className="p-5">
            {loading ? <LoadingSpinner /> : tab === 'materi' ? (
              <div className="space-y-4">
                {canEdit && (
                  <div className="flex justify-end mb-4">
                    <Button icon={Plus} onClick={() => { setEditingMat(null); setMatForm({ type: MaterialType.DOCUMENT }); setMatModal(true); }}>Tambah Materi</Button>
                  </div>
                )}
                {materials.length === 0 ? <EmptyState icon={BookOpen} title="Belum ada materi" /> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {materials.map(m => (
                      <div key={m.id} className="p-4 rounded-xl border flex gap-4 hover:border-[var(--color-brand)] transition-colors" style={{ borderColor: 'var(--color-border)', background: 'var(--color-page)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--color-brand)] shrink-0" style={{ background: 'var(--color-brand-soft)' }}>
                          {getMatIcon(m.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[14px] text-[var(--color-text)] truncate">{m.title}</h4>
                          <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 mt-1">{m.description || 'Tidak ada deskripsi'}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="neutral">{new Date(m.createdAt).toLocaleDateString('id-ID')}</Badge>
                            {m.teacher && <span className="text-[10px] text-[var(--color-muted)]">Oleh: {m.teacher.name}</span>}
                          </div>
                        </div>
                        {canEdit && (
                          <div className="flex flex-col gap-1 shrink-0">
                            <button onClick={() => { setEditingMat(m); setMatForm(m); setMatModal(true); }} className="p-1.5 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:opacity-80"><Pencil size={12} /></button>
                            <button onClick={() => setDeleteMat(m)} className="p-1.5 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger-dark)] hover:opacity-80"><Trash2 size={12} /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {canEdit && (
                  <div className="flex justify-end mb-4">
                    <Button icon={Plus} onClick={() => { setEditingAss(null); setAssForm({ maxScore: 100 }); setAssModal(true); }}>Tambah Tugas</Button>
                  </div>
                )}
                {assignments.length === 0 ? <EmptyState icon={FileText} title="Belum ada tugas" /> : (
                  <div className="grid grid-cols-1 gap-3">
                    {assignments.map(a => {
                      const isLate = a.dueDate && new Date() > new Date(a.dueDate);
                      return (
                        <div key={a.id} className="p-4 rounded-xl border flex flex-col sm:flex-row gap-4 sm:items-center justify-between" style={{ borderColor: 'var(--color-border)', background: 'var(--color-page)' }}>
                          <div>
                            <h4 className="font-bold text-[14px] text-[var(--color-text)]">{a.title}</h4>
                            <p className="text-[12px] text-[var(--color-muted)] mt-1">{a.description}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              {a.dueDate ? (
                                <span className={cn("text-[11px] flex items-center gap-1 font-semibold", isLate ? "text-[var(--color-danger)]" : "text-[var(--color-brand)]")}>
                                  <Clock size={12} /> Deadline: {new Date(a.dueDate).toLocaleString('id-ID')}
                                </span>
                              ) : <span className="text-[11px] text-[var(--color-muted)]">Tanpa batas waktu</span>}
                              <Badge variant="info">Max Nilai: {a.maxScore}</Badge>
                            </div>
                          </div>
                          {canEdit ? (
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" icon={CheckCircle}>Lihat Pengumpulan</Button>
                              <button onClick={() => { setEditingAss(a); setAssForm(a); setAssModal(true); }} className="p-2 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:opacity-80"><Pencil size={14} /></button>
                              <button onClick={() => setDeleteAss(a)} className="p-2 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger-dark)] hover:opacity-80"><Trash2 size={14} /></button>
                            </div>
                          ) : (
                            <Button variant="primary" size="sm" icon={FileText}>Kerjakan Tugas</Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Modals for Materi */}
      <Modal open={matModal} onClose={() => setMatModal(false)} title={editingMat ? 'Edit Materi' : 'Tambah Materi'} size="md">
        <form onSubmit={handleSaveMat} className="space-y-4">
          <FormField label="Judul Materi" required>
            <Input value={matForm.title || ''} onChange={e => setMatForm({ ...matForm, title: e.target.value })} required />
          </FormField>
          <FormField label="Tipe Materi" required>
            <Select value={matForm.type || MaterialType.DOCUMENT} onChange={e => setMatForm({ ...matForm, type: e.target.value as MaterialType })}>
              <option value={MaterialType.DOCUMENT}>Dokumen (PDF/Word)</option>
              <option value={MaterialType.VIDEO}>Video</option>
              <option value={MaterialType.LINK}>Link/URL</option>
              <option value={MaterialType.OTHER}>Lainnya</option>
            </Select>
          </FormField>
          <FormField label="Link / URL File">
            <Input value={matForm.fileUrl || ''} onChange={e => setMatForm({ ...matForm, fileUrl: e.target.value })} placeholder="https://..." />
          </FormField>
          <FormField label="Deskripsi">
            <Textarea value={matForm.description || ''} onChange={e => setMatForm({ ...matForm, description: e.target.value })} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setMatModal(false)}>Batal</Button>
            <Button type="submit" loading={saving}>Simpan</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteMat} onClose={() => setDeleteMat(null)} onConfirm={handleDeleteMat} loading={deleting}
        title="Hapus Materi" description={`Yakin ingin menghapus materi "${deleteMat?.title}"?`} />

      {/* Modals for Tugas */}
      <Modal open={assModal} onClose={() => setAssModal(false)} title={editingAss ? 'Edit Tugas' : 'Tambah Tugas'} size="md">
        <form onSubmit={handleSaveAss} className="space-y-4">
          <FormField label="Judul Tugas" required>
            <Input value={assForm.title || ''} onChange={e => setAssForm({ ...assForm, title: e.target.value })} required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Batas Waktu (Deadline)">
              <Input type="datetime-local" 
                value={assForm.dueDate ? new Date(assForm.dueDate).toISOString().slice(0, 16) : ''} 
                onChange={e => setAssForm({ ...assForm, dueDate: e.target.value })} />
            </FormField>
            <FormField label="Nilai Maksimal" required>
              <Input type="number" min="1" max="100" value={assForm.maxScore || 100} onChange={e => setAssForm({ ...assForm, maxScore: Number(e.target.value) })} required />
            </FormField>
          </div>
          <FormField label="Deskripsi Tugas">
            <Textarea value={assForm.description || ''} onChange={e => setAssForm({ ...assForm, description: e.target.value })} rows={4} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setAssModal(false)}>Batal</Button>
            <Button type="submit" loading={saving}>Simpan</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteAss} onClose={() => setDeleteAss(null)} onConfirm={handleDeleteAss} loading={deleting}
        title="Hapus Tugas" description={`Yakin ingin menghapus tugas "${deleteAss?.title}"?`} />
    </div>
  );
}
