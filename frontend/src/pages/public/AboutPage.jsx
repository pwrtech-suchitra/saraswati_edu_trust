import React, { useState, useEffect } from 'react';
import { Target, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { trustProfileApi } from '../../api/trustProfileApi';
import { Spinner } from '../../components/common/Loader';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await trustProfileApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Error loading trust profile from database:', err);
        setProfileError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <Spinner text="Loading trust profile from database..." />;
  }
  if (profileError || !profile) {
    return <p role="alert">The trust profile is currently unavailable. Please try again later.</p>;
  }
  const msi = profile.mission_sustainable_india;

  return (
    <div>
      {/* 1. Hero Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="SECT Logo" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
            <div>
              <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
                Institutional Profile
              </span>
              <h1 style={{ color: 'white', margin: 0, fontSize: '2.2rem' }}>
                {profile.trust_name}
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-slate-300)', maxWidth: '850px', lineHeight: '1.7', marginTop: '1rem' }}>
            {profile.introduction}
          </p>
        </div>
      </section>

      {/* 2. Structured Introduction */}
      <section className="section" style={{ backgroundColor: 'var(--color-slate-50)' }}>
        <div className="container">
          <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-primary-600)', boxShadow: 'var(--shadow-md)' }}>
            <span className="section-badge" style={{ marginBottom: '0.75rem' }}>Introduction</span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)', marginBottom: '1.25rem' }}>
              Who We Are & What We Do
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)', marginBottom: '1.5rem' }}>
              {profile.introduction}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission (With Verbatim 6th P Statement) */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2">
            {/* Vision */}
            <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-amber-500)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Eye size={30} color="var(--color-amber-600)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-slate-900)' }}>Our Vision</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-slate-700)' }}>
                {profile.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Target size={30} color="var(--color-primary-600)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-slate-900)' }}>Our Mission</h3>
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)' }}>
                {profile.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP INITIATIVE: MISSION SUSTAINABLE INDIA (PDF Pages 2 & 3) */}
      <section className="section" style={{ backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)', gap: '3rem', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={16} />
                <span>{msi.title}{msi.start_date ? ` • Launched ${new Date(msi.start_date).toLocaleDateString()}` : ''}</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#14532d', marginBottom: '1rem', lineHeight: '1.25' }}>
                {msi.title}
              </h2>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#15803d', marginBottom: '1.25rem' }}>
                {msi.historical_context}
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#166534', marginBottom: '1.5rem' }}>
                {msi.narrative}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {msi.domains?.map((d, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #86efac',
                      color: '#166534',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Mission Emblem */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '1.25rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', border: '2px solid #86efac' }}>
                <img
                  src={msi.emblem_url || ''}
                  alt="Mission Sustainable India Emblem"
                  style={{ width: '260px', height: '260px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                />
                <div style={{ marginTop: '1rem', fontWeight: 800, color: '#14532d', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                  लक्ष्य — शाश्वत भारत
                </div>
                <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.25rem' }}>
                  Mission Sustainable India • 5P Framework
                </div>
              </div>
            </div>
          </div>

          {/* 5Ps + 6th P Interactive Cards */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="section-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                The Sustainability Engine
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#14532d', marginBottom: '0.5rem' }}>
                The 5P Framework + 6th P (Political Sustainability)
              </h3>
              <p style={{ color: '#166534', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                Consolidated vision chapters formulated by multi-sectoral professionals working towards sustainable national development.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {msi.five_ps?.map((p, idx) => (
                <div
                  key={idx}
                  className="card card-padded"
                  style={{
                    backgroundColor: 'white',
                    borderTop: '4px solid var(--color-primary-600)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>{p.key}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-800)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {p.name}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                    {p.subtitle}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: '1.6', margin: 0, flex: 1 }}>
                    {p.description}
                  </p>
                </div>
              ))}

              {/* 6th P Card: Political Sustainability */}
              <div
                className="card card-padded"
                style={{
                  backgroundColor: '#fffbeb',
                  borderTop: '4px solid #f59e0b',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b45309' }}>{msi.sixth_p?.key || 'P-6'}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                    The Core Enabler
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#78350f' }}>
                  {msi.sixth_p?.name || 'Political Sustainability'}
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b45309', marginBottom: '0.4rem' }}>
                  Sustainable Governance
                </div>
                <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: '1.6', margin: 0, flex: 1 }}>
                  {msi.sixth_p?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights of Mission Sustainable India */}
          <div className="card card-padded" style={{ backgroundColor: 'white', border: '1px solid #86efac' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#14532d', marginBottom: '1.25rem' }}>
              Highlights of Mission Sustainable India (As per Trust Profile)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {msi.highlights?.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--color-slate-700)' }}>
                  <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statutory Compliance & Certifications */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Compliance & Integrity</span>
            <h2 className="section-title">Official General Particulars & Credentials</h2>
            <p className="section-desc">
              Trust identity and registration details from the trust profile.
            </p>
          </div>

          <div className="grid grid-cols-2" />
        </div>
      </section>

      {/* Leadership contact */}
      <section className="section" style={{ backgroundColor: 'var(--color-slate-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Connect With Trust Secretariat
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
