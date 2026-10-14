import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '5.5rem',
            fontWeight: 800,
            color: 'var(--color-primary-600)',
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--color-slate-900)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-slate-600)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          The link or document you requested might have been moved or does not exist on the SECT portal.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" icon={Home}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
