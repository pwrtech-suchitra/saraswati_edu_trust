import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { contentApi } from '../../api/contentApi';
import { Spinner } from '../../components/common/Loader';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await contentApi.getDocuments();
        if (res.success && Array.isArray(res.data)) {
          setDocuments(res.data);
        } else {
          throw new Error(res.message || 'Documents could not be loaded.');
        }
      } catch (requestError) {
        console.error('Failed to load trust documents:', requestError);
        setError(requestError.message || 'Documents could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

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
            Browse and download the documents published by the trust.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="documents-content">
          {loading ? (
            <Spinner text="Loading documents..." />
          ) : error ? (
            <p role="alert" className="form-error">{error}</p>
          ) : (
            <div className="table-container documents-table-container" style={{ boxShadow: 'var(--shadow-md)' }}>
              <table className="table documents-table">
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
                        {doc.fileAvailable && doc.fileUrl ? <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <Download size={16} /> Download
                        </a> : <span className="badge badge-neutral">File unavailable</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && <div className="documents-mobile-list">
            {documents.map((doc) => (
              <article key={doc.id} className="card document-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <FileText size={20} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <h2 className="document-card-title">{doc.title}</h2>
                </div>
                <dl className="document-meta">
                  <div><dt>Fiscal year</dt><dd>{doc.year}</dd></div>
                  <div><dt>Format</dt><dd>{doc.type}</dd></div>
                  <div><dt>Size</dt><dd>{doc.size}</dd></div>
                </dl>
                {doc.fileAvailable && doc.fileUrl ? <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <Download size={16} /> Download
                </a> : <span className="badge badge-neutral document-unavailable">File unavailable</span>}
              </article>
            ))}
          </div>}

          {documents.length > 0 && !error && <div
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
            <div>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-primary-800)', lineHeight: '1.6' }}>
                The documents listed here are published from the trust's records.
              </p>
            </div>
          </div>}
          </div>
        </div>
      </section>
    </div>
  );
}
