'use client';

import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Pencil, Trash2, Pin, Calendar, Users, Eye } from 'lucide-react';
import { communicationApi, Announcement } from '@/lib/api/communication';
import { classesApi } from '@/lib/api/academic';
import type { SchoolClass } from '@/types/academic';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole, ROLE_LABELS } from '@/types/enums';
import {
  PageHeader, Button, Card, Badge, EmptyState, LoadingSpinner,
  Modal, FormField, Input, Select, Textarea, ConfirmDialog
} from '@/components/ui/AdminUI';
import { cn } from '@/lib/utils';

export default function PengumumanPage() {
  const { user } = useAuthStore();
  const canEdit = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.GURU].includes(user?.role as UserRole);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // View Modal
  const [viewing, setViewing] = useState<Announcement | null>(null);

  // Form
  const [form, setForm] = useState<Partial<Announcement>>({ isPinned: false, targetRoles: [], targetClassIds: [] });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, cRes] = await Promise.all([
        communicationApi.list(),
        classesApi.list()
      ]);
      const toArr = <T,>(d: any): T[] => Array.isArray(d) ? d : (d?.data ?? []);
      setAnnouncements(toArr<Announcement>(aRes.data.data));
      setClasses(toArr<SchoolClass>(cRes.data.data));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await communicationApi.update(editing.id, form);
      else await communicationApi.create(form);
      setModalOpen(false); setEditing(null); loadData();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await communicationApi.delete(deleteTarget.id); setDeleteTarget(null); loadData(); }
    catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader 
        title="Pengumuman" 
        subtitle="Informasi dan papan pengumuman sekolah" 
        action={
          canEdit && (
            <Button icon={Plus} onClick={() => { setEditing(null); setForm({ isPinned: false, targetRoles: [], targetClassIds: [] }); setModalOpen(true); }}>
              Buat Pengumuman
            </Button>
          )
        }
      />

      {loading ? <LoadingSpinner /> : announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="Belum ada pengumuman" description={canEdit ? "Silakan buat pengumuman baru untuk warga sekolah." : "Tidak ada informasi terbaru saat ini."} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map(a => (
            <Card key={a.id} className={cn("relative transition-all hover:border-[var(--color-brand)]", a.isPinned ? "border-l-4 border-l-[var(--color-brand)] bg-gradient-to-r from-[var(--color-brand-soft)] to-transparent" : "")}>
              {a.isPinned && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)]">
                  <Pin size={12} className="fill-[var(--color-brand)]" /> Dipasematkan
                </div>
              )}
              
              <div className="pr-20">
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{a.title}</h3>
                <p className="text-[13px] text-[var(--color-muted)] line-clamp-2 leading-relaxed">{a.content}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-muted)]">
                    <Calendar size={13} /> {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  {a.author && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-muted)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex items-center justify-center text-[9px] font-bold">
                        {a.author.name.charAt(0)}
                      </div>
                      {a.author.name}
                    </div>
                  )}
                  {(a.targetRoles?.length > 0 || a.targetClassIds?.length > 0) && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-brand)] bg-[var(--color-brand-soft)] px-2 py-0.5 rounded-md">
                      <Users size={12} /> Terbatas
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                <Button variant="secondary" size="sm" icon={Eye} onClick={() => setViewing(a)}>Baca Selengkapnya</Button>
                
                {canEdit && (
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => { setEditing(a); setForm(a); setModalOpen(true); }} className="p-2 rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:opacity-80"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(a)} className="p-2 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger-dark)] hover:opacity-80"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {canEdit && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'} size="lg">
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Judul Pengumuman" required>
              <Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Masukkan judul..." />
            </FormField>
            
            <FormField label="Isi Pengumuman" required>
              <Textarea value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} required rows={6} placeholder="Tulis isi pengumuman secara detail..." />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <FormField label="Target Peran (Kosongkan jika untuk semua)">
                <div className="flex flex-wrap gap-2 mt-2">
                  {[UserRole.GURU, UserRole.SISWA, UserRole.ORTU].map(role => {
                    const active = form.targetRoles?.includes(role);
                    return (
                      <button type="button" key={role}
                        onClick={() => {
                          const curr = form.targetRoles || [];
                          const next = active ? curr.filter(r => r !== role) : [...curr, role];
                          setForm({ ...form, targetRoles: next });
                        }}
                        className={cn("px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border", active ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]" : "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]")}
                      >
                        {ROLE_LABELS[role]}
                      </button>
                    )
                  })}
                </div>
              </FormField>
              
              <FormField label="Target Kelas (Opsional)">
                 <Select 
                   value="" 
                   onChange={e => {
                     const val = e.target.value;
                     if (val && !form.targetClassIds?.includes(val)) {
                       setForm({ ...form, targetClassIds: [...(form.targetClassIds || []), val] });
                     }
                   }}
                 >
                   <option value="">+ Tambah Target Kelas</option>
                   {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </Select>
                 {form.targetClassIds && form.targetClassIds.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-2">
                     {form.targetClassIds.map(id => {
                       const cls = classes.find(c => c.id === id);
                       return (
                         <span key={id} className="inline-flex items-center gap-1 bg-[var(--color-section)] px-2 py-1 rounded-md text-[10px] font-bold text-[var(--color-text)]">
                           {cls?.name || id}
                           <button type="button" onClick={() => setForm({ ...form, targetClassIds: form.targetClassIds?.filter(i => i !== id) })} className="text-[var(--color-danger)] ml-1">✕</button>
                         </span>
                       );
                     })}
                   </div>
                 )}
              </FormField>
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] mt-4">
              <label className="flex items-center gap-2 cursor-pointer w-fit text-[12px] font-bold text-[var(--color-text)]">
                <input type="checkbox" checked={!!form.isPinned} onChange={e => setForm({ ...form, isPinned: e.target.checked })} className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-brand)]" />
                Sematkan di Atas (Pinned)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button type="submit" loading={saving}>Publikasikan</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Read More Modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title || ''} size="lg">
        {viewing && (
           <div className="space-y-4">
              <div className="flex flex-wrap gap-3 pb-4 border-b border-[var(--color-border)]">
                 <Badge variant="neutral">{new Date(viewing.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Badge>
                 {viewing.author && <Badge variant="info">Penulis: {viewing.author.name}</Badge>}
              </div>
              <div className="prose prose-sm max-w-none text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                 {viewing.content}
              </div>
              <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
                 <Button variant="secondary" onClick={() => setViewing(null)}>Tutup</Button>
              </div>
           </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Pengumuman" description={`Yakin ingin menghapus pengumuman "${deleteTarget?.title}"?`} />
    </div>
  );
}
