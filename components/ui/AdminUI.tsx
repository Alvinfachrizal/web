'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

// ── Badge ─────────────────────────────────────────────────
type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export function Badge({ variant = 'neutral', children, className }: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    success: { background: 'var(--color-success-soft)', color: 'var(--color-success-dark)' },
    danger:  { background: 'var(--color-danger-soft)',  color: 'var(--color-danger-dark)'  },
    warning: { background: 'var(--color-warning-soft)', color: 'var(--color-warning-dark)' },
    info:    { background: 'var(--color-info-soft)',    color: 'var(--color-info-dark)'    },
    neutral: { background: 'var(--color-section)',      color: 'var(--color-muted)'        },
  };
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', className)}
      style={styles[variant]}
    >
      {children}
    </span>
  );
}

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color ? `${color}18` : 'var(--color-brand-soft)', color: color || 'var(--color-brand)' }}
        >
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>{value}</p>
          <p className="text-[11px] font-semibold" style={{ color: 'var(--color-muted)' }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Cari...'}
        className="w-full pl-9 pr-3 py-2 text-[13px] rounded-xl outline-none transition-all"
        style={{
          background: 'var(--color-surface)',
          border: '0.5px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  );
}

// ── Button ────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export function Button({
  children, onClick, variant = 'primary', size = 'md',
  icon: Icon, disabled, loading, type = 'button', id,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: React.ElementType;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  id?: string;
}) {
  const baseClass = 'inline-flex items-center gap-1.5 font-bold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-[12px]';

  const variantStyle: Record<ButtonVariant, React.CSSProperties> = {
    primary:   { background: 'var(--color-brand)', color: '#fff' },
    secondary: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '0.5px solid var(--color-border)' },
    danger:    { background: 'var(--color-danger-soft)', color: 'var(--color-danger-dark)' },
    ghost:     { background: 'transparent', color: 'var(--color-muted)' },
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClass, sizeClass)}
      style={variantStyle[variant]}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : Icon && <Icon size={13} />}
      {children}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className, noPad }: {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <div
      className={cn('rounded-2xl shadow-sm overflow-hidden', !noPad && 'p-5', className)}
      style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}
    >
      {children}
    </div>
  );
}

// ── CardHeader ────────────────────────────────────────────
export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div
      className="px-5 py-3.5 flex items-center justify-between"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <h3 className="font-bold text-[13px]" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {action}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-section)' }}>
        <Icon size={24} style={{ color: 'var(--color-muted)' }} />
      </div>
      <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{title}</p>
      {description && <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>{description}</p>}
    </div>
  );
}

// ── LoadingSpinner ────────────────────────────────────────
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-brand)' }} />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn('w-full rounded-2xl shadow-2xl overflow-hidden', widths[size])}
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
          <h2 className="font-extrabold text-[15px]" style={{ color: 'var(--color-text)' }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
            style={{ background: 'var(--color-section)', color: 'var(--color-muted)' }}
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────
export function FormField({ label, required, children, error }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] mt-1" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ type = 'text', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 text-[13px] rounded-xl outline-none transition-all"
      style={{
        background: 'var(--color-page)',
        border: '0.5px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    />
  );
}

// ── Select ────────────────────────────────────────────────
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 text-[13px] rounded-xl outline-none transition-all appearance-none"
      style={{
        background: 'var(--color-page)',
        border: '0.5px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    />
  );
}

// ── Textarea ──────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={props.rows || 3}
      className="w-full px-3 py-2 text-[13px] rounded-xl outline-none transition-all resize-none"
      style={{
        background: 'var(--color-page)',
        border: '0.5px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    />
  );
}

// ── Pagination ────────────────────────────────────────────
export function Pagination({ page, totalPages, total, limit, onChange }: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between pt-4 mt-1" style={{ borderTop: '0.5px solid var(--color-border)' }}>
      <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
        Menampilkan {from}–{to} dari {total} data
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition disabled:opacity-40"
          style={{ background: 'var(--color-section)', color: 'var(--color-text)' }}
        >‹ Prev</button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="w-7 h-7 rounded-lg text-[11px] font-bold transition"
            style={{
              background: p === page ? 'var(--color-brand)' : 'var(--color-section)',
              color:      p === page ? '#fff' : 'var(--color-text)',
            }}
          >{p}</button>
        ))}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition disabled:opacity-40"
          style={{ background: 'var(--color-section)', color: 'var(--color-text)' }}
        >Next ›</button>
      </div>
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-[13px] mb-5" style={{ color: 'var(--color-muted)' }}>
        {description || 'Tindakan ini tidak dapat dibatalkan.'}
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose}>Batal</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} id="btn-confirm-delete">
          Ya, Hapus
        </Button>
      </div>
    </Modal>
  );
}
