import React from 'react';
import { Download, QrCode } from 'lucide-react';
import { DONOR_CONTACT_PHONE } from '../../utils/trustContacts';

export default function DonatePage() {
  const qrCode = '/qr_code.png';

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>
            Make a Donation
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '680px', margin: '0 auto' }}>
            Support the trust by scanning the official SECT UPI QR code.
          </p>
        </div>
      </section>

      <section className="section" style={{ transform: 'translateY(-2rem)', paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="card card-padded" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <QrCode size={24} color="var(--color-primary-600)" />
              <h2 style={{ fontSize: '1.35rem' }}>Scan to Pay with UPI</h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
              Scan with your UPI app and verify the payee name and amount shown by your bank before approving.
            </p>
            <div style={{ display: 'inline-block', padding: '0.75rem', background: 'white', border: '2px solid var(--color-slate-200)', borderRadius: '8px', marginBottom: '1rem' }}>
              <img
                src={qrCode}
                alt="Official SECT UPI donation QR code"
                style={{ width: 'min(280px, 70vw)', aspectRatio: '1 / 1', display: 'block', objectFit: 'contain' }}
                decoding="async"
              />
            </div>
            <div>
              <a className="btn btn-outline" href={qrCode} download="sect-donation-qr.png">
                <Download size={17} />
                Save QR code
              </a>
            </div>
            <p role="note" style={{ marginTop: '1.25rem', padding: '1rem', textAlign: 'left', backgroundColor: 'var(--color-amber-50)', border: '1px solid var(--color-amber-200)', borderRadius: '8px', color: 'var(--color-slate-800)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Donations made with this QR code are not submitted to or recorded by this website. For assistance, call{' '}
              <a href={`tel:${DONOR_CONTACT_PHONE}`}>{DONOR_CONTACT_PHONE}</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
