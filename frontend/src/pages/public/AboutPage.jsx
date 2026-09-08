import React from 'react';
import { ShieldCheck, Award, Target, Eye, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function AboutPage() {
  const trustees = [
    { name: 'Dr. Sarojini Panda', role: 'Managing Trustee & Educationist', bio: 'Former University Dean with 30+ years advancing rural literacy and girl child education in eastern India.' },
    { name: 'Er. Debabrata Mohanty', role: 'Trustee — Energy & Infrastructure', bio: 'Renewable energy pioneer focused on decentralized solar grids and rural water security.' },
    { name: 'Smt. Minati Mishra', role: 'Trustee — Livelihood & Artisan Welfare', bio: 'Social activist and cooperative organizer empowering thousands of handloom weavers.' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Who We Are
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            About Saraswati Educational & Charitable Trust
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '750px' }}>
            Established with a deep reverence for Saraswati—the goddess of wisdom and illumination—SECT is committed to dismantling systemic poverty through grassroots education, clean energy, and dignified livelihood.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2">
            <div className="card card-padded" style={{ borderLeft: '5px solid var(--color-primary-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Target size={28} color="var(--color-primary-600)" />
                <h3 style={{ fontSize: '1.4rem' }}>Our Mission</h3>
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--color-slate-600)' }}>
                To bridge rural and underprivileged inequalities by deploying sustainable educational resources, renewable solar micro-infrastructure, women-led agricultural and handloom cooperatives, and community-centric environmental protection programs.
              </p>
            </div>

            <div className="card card-padded" style={{ borderLeft: '5px solid var(--color-amber-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Eye size={28} color="var(--color-amber-500)" />
                <h3 style={{ fontSize: '1.4rem' }}>Our Vision</h3>
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--color-slate-600)' }}>
                A self-reliant, enlightened, and sustainable society where every child has access to continuous education, every community is powered by clean renewable energy, and traditional rural artisans thrive with pride and prosperity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Governance & Registration Details */}
      <section className="section" style={{ backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-slate-200)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Compliance & Integrity</span>
            <h2 className="section-title">Statutory Legal Registrations</h2>
            <p className="section-desc">
              Complete accountability and adherence to Indian Trust laws and financial reporting standards.
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="card card-padded">
              <ShieldCheck size={28} color="var(--color-primary-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Section 80G Tax Exemption</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Donors receive 50% tax deductions on all contributions under Section 80G of the Income Tax Act, 1961.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-700)' }}>
                Order No: ITBA/EXM/80G/2021-22/10398
              </div>
            </div>

            <div className="card card-padded">
              <Award size={28} color="var(--color-amber-500)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Section 12A Non-Profit Status</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Perpetual income tax exemption registered under Section 12A(a) as a verified public charitable trust.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-amber-600)' }}>
                Reg No: 12A/SECT/BBSR/2018
              </div>
            </div>

            <div className="card card-padded">
              <FileText size={28} color="var(--color-teal-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>NITI Aayog NGO Darpan</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Registered on the Government of India NITI Aayog portal for resource mobilization and public auditing.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-teal-700)' }}>
                Darpan ID: OR/2019/0248810
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Board */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Leadership</span>
            <h2 className="section-title">Board of Trustees</h2>
            <p className="section-desc">
              Governed by distinguished educators, engineers, and social workers.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {trustees.map((t, idx) => (
              <div key={idx} className="card card-padded">
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-100)',
                    color: 'var(--color-primary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  {t.name.split(' ')[1]?.[0] || 'T'}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{t.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: '0.85rem' }}>
                  {t.role}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>{t.bio}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Connect With Our Trustees
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
