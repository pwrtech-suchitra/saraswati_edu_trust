import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import Button from '../../components/common/Button';

export default function PaymentFailurePage() {
  const location = useLocation();
  const errorReason = location.state?.error || 'The payment gateway could not verify the transaction or the request was cancelled.';

  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '580px', textAlign: 'center' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertCircle size={40} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-slate-900)' }}>
          Donation Could Not Be Completed
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--color-slate-600)', marginBottom: '1.75rem' }}>
          {errorReason}
        </p>

        <div
          style={{
            backgroundColor: 'var(--color-slate-100)',
            padding: '1.25rem',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'left',
            fontSize: '0.88rem',
            color: 'var(--color-slate-600)',
            marginBottom: '2rem',
          }}
        >
          <strong>Please Note:</strong> If any amount was debited from your bank account or UPI handle, it will be automatically refunded by your banking provider within 3 to 5 business days. No money was transferred to SECT accounts.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/donate">
            <Button variant="primary" icon={RefreshCw}>
              Try Again
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" icon={HelpCircle}>
              Contact Secretariat Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
