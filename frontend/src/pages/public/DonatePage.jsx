import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Building2, QrCode } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { trustProfileApi } from '../../api/trustProfileApi';
import DonationForm from '../../components/donation/DonationForm';
import { Spinner } from '../../components/common/Loader';
import { useNotification } from '../../hooks/useNotification';

export default function DonatePage() {
  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get('project') || '';
  const [projects, setProjects] = useState([]);
  const [trustProfile, setTrustProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, profileRes] = await Promise.all([
          projectApi.listProjects(),
          trustProfileApi.getProfile()
        ]);
        if (projRes.success && Array.isArray(projRes.data)) {
          setProjects(projRes.data);
        }
        if (profileRes.success && profileRes.data) {
          setTrustProfile(profileRes.data);
        }
      } catch (err) {
        console.error('Error loading donation page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const trustDetails = {
    trustName: trustProfile?.trust_name || 'Saraswati Educational & Charitable Trust',
    qrCode: trustProfile?.qr_code_url || '/qr_code.png',
    email: trustProfile?.email || 'strust12@gmail.com',
    landline: trustProfile?.phone_landline || '0674-2954256',
    mobiles: trustProfile?.phone_mobiles || ['9937159760', '9438747172']
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-badge amber" style={{ margin: '0 auto 0.85rem' }}>
            Section 80G Tax Exempt Eligible
          </span>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            Contribute to Saraswati Educational & Charitable Trust
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '680px', margin: '0 auto' }}>
            Your contribution directly funds rural solar electrification, mobile livestock health clinics, women SHGs, and Mission Sustainable India.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="section" style={{ transform: 'translateY(-2rem)', paddingTop: '0' }}>
        <div className="container">
          {loading ? (
            <Spinner text="Preparing secure donation portal from database..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.3fr)', gap: '2.5rem' }} className="donate-grid">
              {/* Left: Online Donation Form */}
              <div>
                <DonationForm projects={projects} selectedProjectId={preselectedProjectId} />
              </div>

              {/* Right: Official Credentials & QR Code */}
              <div>
                {/* 1. Institutional Compliance & Tax Particulars Card */}
                <div className="card card-padded" style={{ marginBottom: '2rem', borderTop: '4px solid var(--color-primary-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'var(--color-primary-100)',
                        color: 'var(--color-primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.15rem' }}>Institutional & Tax Credentials</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)' }}>
                        Official SECT statutory identity for individual & CSR donors
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trust Entity</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-slate-900)', fontSize: '0.95rem' }}>{trustDetails.trustName}</div>
                    </div>

                    <div style={{ backgroundColor: '#fefce8', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                      <div style={{ fontSize: '0.75rem', color: '#854d0e', textTransform: 'uppercase', fontWeight: 600 }}>Statutory Status</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#713f12' }}>
                        Section 80G Certified Non-Profit
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#a16207', marginTop: '0.2rem' }}>
                        Eligible for 50% tax deduction on donor contributions under Income Tax rules.
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                      <strong>Direct Institutional Transfer Assistance:</strong>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem' }}>
                        For corporate CSR partnerships, grant disbursements, or direct wire transfers, please contact the Trust Secretariat at <strong>{trustDetails.email}</strong> or call <strong>{trustDetails.landline}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Official UPI Donation QR Code (Page 5 of PDF) */}
                <div className="card card-padded" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <QrCode size={22} color="var(--color-primary-600)" />
                    <h3 style={{ fontSize: '1.15rem' }}>Scan Official Donation QR Code</h3>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                    <strong>Willing to Donate for the Mission, Please scan the QR given below:</strong>
                  </p>

                  <div style={{ display: 'inline-block', padding: '0.75rem', background: 'white', border: '2px solid var(--color-slate-200)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
                    <img
                      src={trustDetails.qrCode}
                      alt="SECT Official Donation QR Code"
                      style={{ width: '220px', height: '220px', display: 'block', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)' }}>
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app
                  </div>
                </div>

                {/* 3. Section 80G Tax Exemption Guide */}
                <div className="card card-padded">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <ShieldCheck size={24} color="var(--color-primary-600)" />
                    <h3 style={{ fontSize: '1.15rem' }}>Tax Exemption Benefits (80G)</h3>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                    Contributions to Saraswati Educational & Charitable Trust are eligible for <strong>50% tax deduction</strong> under Section 80G of the Income Tax Act.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Provide Donor PAN during checkout for automated Form 10BE tax records</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Donors can request physical 80G certificate at: <strong>{trustProfile?.email || 'strust12@gmail.com'}</strong></span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Annual Form 10BE filing handled by SECT Secretariat</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 850px) {
          .donate-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
