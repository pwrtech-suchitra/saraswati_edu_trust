import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { contentApi } from '../../api/contentApi';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function DocumentsPage() {
  const { showSuccess } = useNotification();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await contentApi.getDocuments();
        if (res.success) setDocuments(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const handleDownload = (doc) => {
    showSuccess(`Downloading "${doc.title}" (${doc.size})...`);
  };

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Governance & Transparency
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Official Trust Documents & Audits
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            SECT maintains complete statutory compliance. Download audited financial reports, Income Tax Section 80G orders, and Trust deeds.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          {loading ? (
            <Spinner text="Loading documents..." />
          ) : (
            <div className="table-container" style={{ boxShadow: 'var(--shadow-md)' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Fiscal Year</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FileText size={20} color="var(--color-primary-600)" />
                          <span style={{ fontWeight: 600, color: 'var(--color-slate-900)' }}>
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{doc.year}</span>
                      </td>
                      <td>
                        <span className="badge badge-info">{doc.type}</span>
                      </td>
                      <td style={{ color: 'var(--color-slate-500)', fontSize: '0.88rem' }}>
                        {doc.size}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownload(doc)}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              marginTop: '3rem',
              backgroundColor: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-100)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <ShieldCheck size={26} color="var(--color-primary-700)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
            <div>
              <h4 style={{ color: 'var(--color-primary-900)', marginBottom: '0.35rem' }}>
                Statutory Reporting Commitment
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-primary-800)', lineHeight: '1.6' }}>
                All financial accounts of Saraswati Educational & Charitable Trust are audited annually by registered Chartered Accountants and submitted to the Income Tax Department of India. Patrons and institutional CSR contributors are entitled to inspect audited balance sheets at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
