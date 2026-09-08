import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records matching your current filter criteria.',
  actionText = null,
  onAction = null,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--color-white)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1.5px dashed var(--color-slate-200)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-slate-100)',
          color: 'var(--color-slate-400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={32} />
      </div>

      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{title}</h4>
      <p style={{ maxWidth: '420px', fontSize: '0.95rem', color: 'var(--color-slate-500)', marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
