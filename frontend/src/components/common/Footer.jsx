import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Sun } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-slate-900)',
        color: 'var(--color-slate-300)',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Column 1: About Trust */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fef08a',
                }}
              >
                <Sun size={20} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--color-white)',
                }}
              >
                SECT
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--color-slate-400)', marginBottom: '1.5rem' }}>
              Saraswati Educational & Charitable Trust is an officially registered non-profit working across education,
              renewable energy, environmental sustainability, and rural livelihoods.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(38, 145, 112, 0.15)',
                color: 'var(--color-primary-400)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={16} />
              <span>Section 80G Tax Exempt Eligible</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Explore Trust
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              <li>
                <Link to="/about" style={{ color: 'var(--color-slate-300)' }}>About Our Founders & Mission</Link>
              </li>
              <li>
                <Link to="/activities" style={{ color: 'var(--color-slate-300)' }}>Trust Core Activities</Link>
              </li>
              <li>
                <Link to="/projects" style={{ color: 'var(--color-slate-300)' }}>Ongoing Community Projects</Link>
              </li>
              <li>
                <Link to="/news-events" style={{ color: 'var(--color-slate-300)' }}>Press Releases & Events</Link>
              </li>
              <li>
                <Link to="/documents" style={{ color: 'var(--color-slate-300)' }}>Annual Reports & Compliance</Link>
              </li>
              <li>
                <Link to="/gallery" style={{ color: 'var(--color-slate-300)' }}>Impact Photo Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust Pillars */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Focus Areas
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--color-slate-400)' }}>
              <li>• Girl Child & Rural Education</li>
              <li>• Solar Power & Renewable Micro-grids</li>
              <li>• Sustainable Women Livelihoods</li>
              <li>• Solid Waste Management & Composting</li>
              <li>• Eco-friendly Community Development</li>
            </ul>
          </div>

          {/* Column 4: Secretariat Contact */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Trust Secretariat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-slate-400)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>SECT Central Office, Plot 42/B, Chandrasekharpur, Bhubaneswar, Odisha 751024</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <span>contact@sect-trust.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <span>+91 (0674) 274-8890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--color-slate-500)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Saraswati Educational & Charitable Trust. All rights reserved. Registered Indian Public Trust.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/contact" style={{ color: 'var(--color-slate-400)' }}>Privacy & Terms</Link>
            <Link to="/documents" style={{ color: 'var(--color-slate-400)' }}>80G Registration Order</Link>
            <Link to="/admin" style={{ color: 'var(--color-slate-500)' }}>Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
