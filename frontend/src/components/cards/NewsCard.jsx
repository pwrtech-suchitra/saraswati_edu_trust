import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function NewsCard({ article, onReadMore }) {
  return (
    <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
        {article.category && <span className="badge badge-emerald">{article.category}</span>}
        <span style={{ fontSize: '0.82rem', color: 'var(--color-slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Calendar size={14} /> {formatDate(article.date)}
        </span>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.35' }}>
        {article.title}
      </h3>

      <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1.5rem', flex: 1 }}>
        {article.summary}
      </p>

      <button
        onClick={() => onReadMore?.(article)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-primary-600)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span>Read full release</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
