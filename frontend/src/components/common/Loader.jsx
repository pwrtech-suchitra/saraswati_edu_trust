import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 28, color = 'var(--color-primary-600)', text = null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '0.75rem',
      }}
    >
      <Loader2
        size={size}
        style={{
          color,
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', fontWeight: 500 }}>{text}</p>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function Skeleton({ width = '100%', height = '1.25rem', borderRadius = 'var(--border-radius-sm)', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-slate-200)',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 0 }}>
      <Skeleton height="200px" borderRadius="16px 16px 0 0" />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Skeleton width="40%" height="1rem" />
        <Skeleton width="85%" height="1.5rem" />
        <Skeleton width="100%" height="3rem" />
        <Skeleton width="100%" height="8px" borderRadius="999px" />
        <Skeleton width="50%" height="1.2rem" />
      </div>
    </div>
  );
}

export default Spinner;
