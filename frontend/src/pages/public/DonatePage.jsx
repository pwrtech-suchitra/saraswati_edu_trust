import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, ShieldCheck, CheckCircle2, Building2, QrCode } from 'lucide-react';
import { trustProfileApi } from '../../api/trustProfileApi';
import ManualDonationForm from '../../components/donation/ManualDonationForm';
import { DONOR_CONTACT_PHONE } from '../../utils/trustContacts';

export default function DonatePage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project') || null;
  const [trustProfile, setTrustProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    trustProfileApi.getProfile()
      .then((profileRes) => {
        if (profileRes.success && profileRes.data) {
          setTrustProfile(profileRes.data);
        }
      })
      .catch((err) => {
        console.error('Error loading donation page trust details:', err);
        setProfileError(true);
      });
  }, []);

  const trustDetails = {
    trustName: trustProfile?.trust_name,
    qrCode: trustProfile?.qr_code_url || '/qr_code.png',
    email: trustProfile?.email,
    landline: trustProfile?.phone_landline,
    donorContactPhone: DONOR_CONTACT_PHONE,
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            {trustProfile?.trust_name ? `Contribute to ${trustProfile.trust_name}` : 'Make a Donation'}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '680px', margin: '0 auto' }}>
            Support the trust by scanning the official SECT UPI donation QR code.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="section" style={{ transform: 'translateY(-2rem)', paddingTop: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.3fr)', gap: '2.5rem' }} className="donate-grid">
              <div className="card card-padded" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <QrCode size={24} color="var(--color-primary-600)" />
                  <h2 style={{ fontSize: '1.35rem' }}>Scan to Pay with UPI</h2>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                  Scan with your UPI app. Before approving, verify the payee name and donation amount shown by your bank.
                </p>
                {profileError && <p role="alert" style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>
                  Trust details could not be loaded. Confirm the payee shown in your UPI app before authorizing payment.
                </p>}
                <div style={{ display: 'inline-block', padding: '0.75rem', background: 'white', border: '2px solid var(--color-slate-200)', borderRadius: '8px', marginBottom: '1rem' }}>
                  <img
                    src={trustDetails.qrCode}
                    alt="Official SECT UPI donation QR code"
                    style={{ width: 'min(280px, 70vw)', aspectRatio: '1 / 1', display: 'block', objectFit: 'contain' }}
                    decoding="async"
                  />
                </div>
                <div>
                  <a className="btn btn-outline" href={trustDetails.qrCode} download="sect-donation-qr.png">
                    <Download size={17} />
                    Save QR code
                  </a>
                </div>
                <div role="note" style={{ marginTop: '1.25rem', padding: '1rem', textAlign: 'left', backgroundColor: 'var(--color-amber-50)', border: '1px solid var(--color-amber-200)', borderRadius: '8px', color: 'var(--color-slate-800)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <strong>This direct UPI payment is not automatically recorded or confirmed by this website.</strong>{' '}
                  Keep your UPI transaction reference. For payment acknowledgement or 80G receipt requests, contact the Trust{trustDetails.email && <> at <a href={`mailto:${trustDetails.email}`}>{trustDetails.email}</a></>} or call <a href={`tel:${trustDetails.donorContactPhone}`}>{trustDetails.donorContactPhone}</a>.
                </div>
                <ManualDonationForm
                  has80GRegistration={Boolean(trustProfile?.exemption_80g_no)}
                  projectId={projectId}
                />
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

                    <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Donor Assistance</div>
                      <a href={`tel:${trustDetails.donorContactPhone}`} style={{ fontWeight: 700, color: 'var(--color-primary-700)', fontSize: '0.95rem' }}>{trustDetails.donorContactPhone}</a>
                    </div>

                    {(trustDetails.email || trustDetails.landline) && <div style={{ backgroundColor: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                      <strong>Direct Institutional Transfer Assistance:</strong>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem' }}>
                        For corporate CSR partnerships, grant disbursements, or direct wire transfers, contact the Trust Secretariat{trustDetails.email && <> at <strong>{trustDetails.email}</strong></>}{trustDetails.landline && <> or call <strong>{trustDetails.landline}</strong></>}. For donor assistance, call <a href={`tel:${trustDetails.donorContactPhone}`}>{trustDetails.donorContactPhone}</a>.
                      </p>
                    </div>}
                  </div>
                </div>

                {/* 3. Section 80G Tax Exemption Guide */}
                {trustProfile?.exemption_80g_no && <div className="card card-padded">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <ShieldCheck size={24} color="var(--color-primary-600)" />
                    <h3 style={{ fontSize: '1.15rem' }}>Tax Exemption Benefits (80G)</h3>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                    Consult the current 80G registration terms and applicable tax rules to determine donation eligibility.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Provide PAN when required for applicable 80G documentation</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>{trustDetails.email ? <>For questions about documentation, contact: <strong>{trustDetails.email}</strong> or call <a href={`tel:${trustDetails.donorContactPhone}`}>{trustDetails.donorContactPhone}</a>.</> : <>For documentation questions or applicable tax treatment, call <a href={`tel:${trustDetails.donorContactPhone}`}>{trustDetails.donorContactPhone}</a>.</>}</span>
                    </li>
                  </ul>
                </div>}
              </div>
          </div>
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
