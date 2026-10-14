import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';

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
          {/* Column 1: About Trust & Statutory Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src="/logo.png"
                alt="SECT Trust Seal"
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'contain' }}
              />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--color-white)',
                    display: 'block',
                    lineHeight: '1.2',
                  }}
                >
                  SECT
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', letterSpacing: '0.5px' }}>
                  SARASWATI EDUCATIONAL & CHARITABLE TRUST
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--color-slate-400)', marginBottom: '1.25rem' }}>
              A committed NGO active in community capacity building, renewable energy dissemination, sustainable livelihood, and Mission Sustainable India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                  width: 'fit-content',
                }}
              >
                <ShieldCheck size={16} />
                <span>Section 80G Certified</span>
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-slate-400)',
                  marginTop: '0.2rem',
                }}
              >
                Section 80G Certified Non-Profit
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Explore SECT
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              <li>
                <Link to="/about" style={{ color: 'var(--color-slate-300)' }}>About SECT & Mission Sustainable India</Link>
              </li>
              <li>
                <Link to="/activities" style={{ color: 'var(--color-slate-300)' }}>4 Core Activity Pillars (27 Mandates)</Link>
              </li>
              <li>
                <Link to="/projects" style={{ color: 'var(--color-slate-300)' }}>Ongoing Community Initiatives</Link>
              </li>
              <li>
                <Link to="/news-events" style={{ color: 'var(--color-slate-300)' }}>News & Upcoming Workshops</Link>
              </li>
              <li>
                <Link to="/documents" style={{ color: 'var(--color-slate-300)' }}>Official Trust Documents & Audits</Link>
              </li>
              <li>
                <Link to="/donate" style={{ color: 'var(--color-amber-400)', fontWeight: 600 }}>Online & UPI Donation</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The 4 Core Activity Pillars */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              4 Activity Pillars
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-slate-400)' }}>
              <li>• Environmental & Renewable Energy (10 Mandates)</li>
              <li>• Innovative Livelihood & SHGs (6 Mandates)</li>
              <li>• Agricultural & Organic Dairy Farm (4 Mandates)</li>
              <li>• Govt. Resource Mobilization (7 Mandates)</li>
              <li>• 5P Sustainability Model (Planet, People, Prosperity, Peace, Partnership)</li>
            </ul>
          </div>

          {/* Column 4: Secretariat & Social Coordinates */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Stay Connected
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-slate-400)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>K-8-82, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha-751029</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <a href="mailto:strust12@gmail.com" style={{ color: 'var(--color-slate-300)' }}>strust12@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <span>0674-2954256</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageCircle size={18} color="#22c55e" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a href="https://wa.me/919438747172" target="_blank" rel="noopener noreferrer" style={{ color: '#86efac' }}>
                    +91 9438747172
                  </a>
                  <span>/</span>
                  <a href="https://wa.me/919937159760" target="_blank" rel="noopener noreferrer" style={{ color: '#86efac' }}>
                    +91 9937159760
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge"
                  style={{ color: 'var(--color-slate-300)', fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' }}
                >
                  Facebook
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge"
                  style={{ color: 'var(--color-slate-300)', fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' }}
                >
                  @saraswati_trust
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-badge"
                  style={{ color: 'var(--color-slate-300)', fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' }}
                >
                  LinkedIn
                </a>
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
            <Link to="/contact" style={{ color: 'var(--color-slate-400)' }}>Contact Secretariat</Link>
            <Link to="/donate" style={{ color: 'var(--color-slate-400)' }}>Online Donation</Link>
            <Link to="/admin" style={{ color: 'var(--color-slate-500)' }}>Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
