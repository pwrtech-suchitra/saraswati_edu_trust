import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import DonationForm from '../../components/donation/DonationForm';
import { Spinner } from '../../components/common/Loader';

export default function DonatePage() {
  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get('project') || '';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await projectApi.listProjects();
        if (res.success && Array.isArray(res.data)) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-badge amber" style={{ margin: '0 auto 0.85rem' }}>
            Section 80G Eligible
          </span>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            Contribute to Saraswati Charitable Trust
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '680px', margin: '0 auto' }}>
            Your support delivers clean solar power, girl child scholarships, and ecological sustainability to rural India.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="section" style={{ transform: 'translateY(-2rem)', paddingTop: '0' }}>
        <div className="container">
          {loading ? (
            <Spinner text="Preparing secure donation portal..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '2.5rem' }} className="donate-grid">
              {/* Form */}
              <div>
                <DonationForm projects={projects} selectedProjectId={preselectedProjectId} />
              </div>

              {/* 80G Tax Guide & Trust Assurance */}
              <div>
                <div className="card card-padded" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <ShieldCheck size={24} color="var(--color-primary-600)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Tax Deduction (Section 80G)</h3>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    Donations to Saraswati Educational & Charitable Trust are eligible for a <strong>50% tax deduction</strong> under Section 80G of the Indian Income Tax Act.
                  </p>

                  <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.3rem' }}>
                      80G Order Number:
                    </div>
                    <div style={{ color: 'var(--color-primary-700)', fontFamily: 'monospace', fontWeight: 700 }}>
                      ITBA/EXM/80G/2021-22/10398
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-slate-600)' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>PAN card required by Income Tax rules</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Instant downloadable 80G receipt voucher</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" />
                      <span>Annual Form 10BE filing on your behalf</span>
                    </li>
                  </ul>
                </div>

                {/* FAQ Quick Accordion */}
                <div className="card card-padded">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <HelpCircle size={22} color="var(--color-amber-600)" />
                    <h4 style={{ fontSize: '1.1rem' }}>Frequently Asked Questions</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                    <div>
                      <strong style={{ color: 'var(--color-slate-800)' }}>Will I receive a receipt?</strong>
                      <p style={{ color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>
                        Yes, immediately after payment verification, you will see your digital receipt and receive a copy via email.
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: 'var(--color-slate-800)' }}>Can I donate from international cards?</strong>
                      <p style={{ color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>
                        Currently, online payments support Indian cards, UPI, and net banking. For FCRA international transfers, contact our secretariat.
                      </p>
                    </div>
                  </div>
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
