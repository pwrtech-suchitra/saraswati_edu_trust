import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Briefcase,
  Sprout,
  Users,
  CheckCircle2,
  Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { trustProfileApi } from '../../api/trustProfileApi';
import { Spinner } from '../../components/common/Loader';

export default function ActivitiesPage() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePillarId, setActivePillarId] = useState('all');

  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await trustProfileApi.getActivityPillars();
        if (res.success && Array.isArray(res.data)) {
          setPillars(res.data);
        }
      } catch (err) {
        console.error('Error loading activity pillars from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  // Icon mapper helper
  const getIcon = (id) => {
    switch (id) {
      case 'environmental':
        return <Leaf size={28} />;
      case 'livelihood':
        return <Briefcase size={28} />;
      case 'agriculture':
        return <Sprout size={28} />;
      case 'gov_mobilization':
        return <Users size={28} />;
      default:
        return <Sun size={28} />;
    }
  };

  const getPillarColor = (id) => {
    switch (id) {
      case 'environmental':
        return { border: '#16a34a', bg: '#f0fdf4', text: '#15803d', badge: '#dcfce7' };
      case 'livelihood':
        return { border: '#0284c7', bg: '#f0f9ff', text: '#0369a1', badge: '#e0f2fe' };
      case 'agriculture':
        return { border: '#d97706', bg: '#fffbeb', text: '#b45309', badge: '#fef3c7' };
      case 'gov_mobilization':
        return { border: '#7c3aed', bg: '#faf5ff', text: '#6d28d9', badge: '#f3e8ff' };
      default:
        return { border: 'var(--color-primary-600)', bg: 'white', text: 'var(--color-primary-800)', badge: 'var(--color-primary-100)' };
    }
  };

  const filteredPillars = activePillarId === 'all'
    ? pillars
    : pillars.filter(p => p.id === activePillarId);

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-badge amber" style={{ margin: '0 auto 0.85rem' }}>
            Official Activity Charter
          </span>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            Areas of Activities & Core Mandates
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '780px', margin: '0 auto' }}>
            Organized into 4 core pillars comprising 27 concrete mandates directly from the Saraswati Educational &amp; Charitable Trust Profile.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          {loading ? (
            <Spinner text="Loading activity pillars from database..." />
          ) : (
            <>
              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <button
                  type="button"
                  onClick={() => setActivePillarId('all')}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '999px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    border: '1px solid var(--color-slate-300)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: activePillarId === 'all' ? 'var(--color-primary-700)' : 'white',
                    color: activePillarId === 'all' ? 'white' : 'var(--color-slate-700)',
                  }}
                >
                  All 4 Pillars (27 Mandates)
                </button>
                {pillars.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePillarId(p.id)}
                    style={{
                      padding: '0.65rem 1.4rem',
                      borderRadius: '999px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      border: '1px solid var(--color-slate-300)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: activePillarId === p.id ? 'var(--color-primary-700)' : 'white',
                      color: activePillarId === p.id ? 'white' : 'var(--color-slate-700)',
                    }}
                  >
                    {p.title} ({p.mandates?.length || 0})
                  </button>
                ))}
              </div>

              {/* Pillars Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {filteredPillars.map((pillar) => {
                  const colors = getPillarColor(pillar.id);
                  return (
                    <div
                      key={pillar.id}
                      className="card"
                      style={{
                        padding: '2.5rem',
                        borderLeft: `8px solid ${colors.border}`,
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '12px',
                              backgroundColor: colors.bg,
                              color: colors.text,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {getIcon(pillar.id)}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.text }}>
                              {pillar.category}
                            </span>
                            <h2 style={{ fontSize: '1.65rem', color: 'var(--color-slate-900)', margin: '0.15rem 0 0' }}>
                              {pillar.title}
                            </h2>
                          </div>
                        </div>

                        <span
                          style={{
                            backgroundColor: colors.badge,
                            color: colors.text,
                            padding: '0.4rem 0.9rem',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {pillar.mandates?.length || 0} Verbatim Mandates
                        </span>
                      </div>

                      <p style={{ fontSize: '1.05rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        {pillar.summary}
                      </p>

                      {/* Mandates Checklist */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                        {pillar.mandates?.map((mandate, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              backgroundColor: 'var(--color-slate-50)',
                              padding: '1rem 1.25rem',
                              borderRadius: '8px',
                              border: '1px solid var(--color-slate-200)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.85rem',
                            }}
                          >
                            <CheckCircle2 size={20} color={colors.border} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                            <span style={{ fontSize: '0.93rem', color: 'var(--color-slate-800)', lineHeight: '1.5' }}>
                              {mandate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div
                style={{
                  marginTop: '4rem',
                  backgroundColor: 'var(--color-primary-900)',
                  borderRadius: 'var(--border-radius-xl)',
                  padding: '3.5rem',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '1rem' }}>
                  Support Saraswati Educational &amp; Charitable Trust Initiatives
                </h3>
                <p style={{ color: 'var(--color-slate-300)', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
                  Every mandate is backed by verifiable on-ground grassroots implementation, official 80G tax receipts, and participatory community action.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/donate">
                    <Button variant="amber" size="lg">
                      Donate for the Mission (80G Eligible)
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline-white" size="lg">
                      Partner with SECT
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
