import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const { receipt } = location.state || {};

  useEffect(() => {
    if (!receipt) return;

    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#269170', '#e89528', '#188e89', '#22c55e'],
      });
    } catch {
      // safe fallback
    }
  }, [receipt]);

  if (!receipt) {
    return (
      <div className="section" style={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <h2>Receipt details unavailable</h2>
          <p>Your payment confirmation did not include receipt details. Please contact the trust before claiming a tax deduction.</p>
          <Link to="/donate">
            <Button variant="primary">Return to donations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const receiptData = receipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section" style={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Top Success Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-100)',
              color: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <CheckCircle2 size={42} />
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: 'var(--color-primary-900)' }}>
            Thank You for Your Generosity!
          </h2>
          <p style={{ color: 'var(--color-slate-600)', fontSize: '1.1rem' }}>
            Your contribution has been authoritatively verified and recorded in SECT Trust accounts.
          </p>
        </div>

        {/* Printable Official 80G Receipt Card */}
        <div
          id="official-receipt"
          className="card"
          style={{
            padding: '2.5rem',
            border: '2px solid var(--color-primary-500)',
            position: 'relative',
            backgroundColor: 'var(--color-white)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '2rem',
          }}
        >
          {/* Watermark/stamp */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--color-slate-200)',
              paddingBottom: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-900)' }}>
                Saraswati Educational & Charitable Trust
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                Registered Indian Public Trust | 80G Order: ITBA/EXM/80G/2021-22/10398
              </p>
            </div>
            <div className="badge badge-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              VERIFIED & PAID
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', textTransform: 'uppercase' }}>Receipt Number</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-800)', fontFamily: 'monospace' }}>
                {receiptData.receiptNumber}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', textTransform: 'uppercase' }}>Transaction Date</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-slate-800)' }}>
                {formatDate(receiptData.date, true)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', textTransform: 'uppercase' }}>Donor Name</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-800)' }}>
                {receiptData.donorName}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', textTransform: 'uppercase' }}>Donor PAN Number</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-700)', fontFamily: 'monospace' }}>
                {receiptData.panNumber || 'NOT PROVIDED'}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-primary-50)',
              borderRadius: 'var(--border-radius-md)',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary-900)' }}>
              Total Amount Contributed:
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>
              {formatINR(receiptData.amount)}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)', borderTop: '1px solid var(--color-slate-100)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--color-primary-600)" />
            <span>This is a computer generated certificate. Eligible for 50% deduction under Section 80G.</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save PDF Receipt
          </Button>
          <Link to="/projects">
            <Button variant="outline" icon={ArrowLeft}>
              Explore More Initiatives
            </Button>
          </Link>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #official-receipt, #official-receipt * {
            visibility: visible;
          }
          #official-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 1px solid #000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
