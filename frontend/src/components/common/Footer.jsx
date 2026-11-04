import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { trustProfileApi } from '../../api/trustProfileApi';
import { DONOR_CONTACT_PHONE } from '../../utils/trustContacts';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    trustProfileApi.getProfile()
      .then((response) => setProfile(response.data || null))
      .catch((error) => console.error('Error loading trust profile for footer:', error));
  }, []);

  const socialLinks = [
    profile?.facebook_url && { label: 'Facebook', url: profile.facebook_url },
    profile?.twitter_handle && {
      label: 'X',
      url: `https://x.com/${profile.twitter_handle.replace(/^@/, '')}`
    },
    profile?.linkedin_url && { label: 'LinkedIn', url: profile.linkedin_url }
  ].filter(Boolean);
  const whatsappNumbers = profile?.whatsapp_numbers || [];

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
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Column 1: About Trust & Statutory Status */}
          <div className="footer-column">
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
                <span className="footer-brand-subtitle" style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)' }}>
                  {profile?.trust_name || profile?.short_name || 'Charitable Trust'}
                </span>
              </div>
            </div>
            <p className="footer-introduction" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--color-slate-400)', marginBottom: '1.25rem' }}>
              {profile?.introduction || 'Community-led work in education, environmental protection, renewable energy, and sustainable livelihoods.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} />
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="footer-column">
            <h2 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Explore SECT
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              <li>
                <Link to="/about" style={{ color: 'var(--color-slate-300)' }}>About SECT & Mission Sustainable India</Link>
              </li>
              <li>
                <Link to="/activities" style={{ color: 'var(--color-slate-300)' }}>Activity Areas &amp; Mandates</Link>
              </li>
              <li>
                <Link to="/projects" style={{ color: 'var(--color-slate-300)' }}>Ongoing Community Initiatives</Link>
              </li>
              <li>
                <Link to="/news-events" style={{ color: 'var(--color-slate-300)' }}>News &amp; Events</Link>
              </li>
              <li>
                <Link to="/documents" style={{ color: 'var(--color-slate-300)' }}>Official Trust Documents & Audits</Link>
              </li>
              <li>
                <Link to="/donate" style={{ color: 'var(--color-amber-400)', fontWeight: 600 }}>UPI QR Donation</Link>
              </li>
            </ul>
          </div>

          {/* Secretariat & Social Coordinates */}
          <div className="footer-column">
            <h2 style={{ color: 'var(--color-white)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Stay Connected
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-slate-400)' }}>
              {profile?.address && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{profile.address}</span>
              </div>}
              {profile?.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${profile.email}`} style={{ color: 'var(--color-slate-300)' }}>{profile.email}</a>
              </div>}
              {profile?.phone_landline && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <a href={`tel:${profile.phone_landline}`} style={{ color: 'var(--color-slate-300)' }}>{profile.phone_landline}</a>
              </div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-amber-500)" style={{ flexShrink: 0 }} />
                <a href={`tel:${DONOR_CONTACT_PHONE}`} style={{ color: 'var(--color-slate-300)' }}>Donor assistance: {DONOR_CONTACT_PHONE}</a>
              </div>
              {whatsappNumbers.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageCircle size={18} color="#22c55e" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {whatsappNumbers.map((phone) => {
                    const digits = phone.replace(/\D/g, '');
                    const number = digits.startsWith('91') ? digits : `91${digits}`;
                    return <a key={phone} href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" style={{ color: '#86efac' }}>{phone}</a>;
                  })}
                </div>
              </div>}

              {/* Social Channels */}
              {socialLinks.length > 0 && <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                {socialLinks.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="social-badge" style={{ color: 'var(--color-slate-300)', fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px' }}>
                    {label}
                  </a>
                ))}
              </div>}
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
            color: 'var(--color-slate-400)',
          }}
        >
          <div>
            © {currentYear} {profile?.trust_name || 'SECT'}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/contact" style={{ color: 'var(--color-slate-400)' }}>Contact Secretariat</Link>
            <Link to="/donate" style={{ color: 'var(--color-slate-400)' }}>UPI QR Donation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
