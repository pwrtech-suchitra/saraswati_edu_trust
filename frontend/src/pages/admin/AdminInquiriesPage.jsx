import React, { useState, useEffect } from 'react';

import { adminApi } from '../../api/adminApi';
import { Spinner } from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function AdminInquiriesPage() {
  const { showSuccess } = useNotification();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeInquiry, setActiveInquiry] = useState(null);

  useEffect(() => {
    async function loadInquiries() {
      try {
        const res = await adminApi.getInquiries();
        if (res.success) setInquiries(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    loadInquiries();
  }, []);

  const toggleResolved = async (inq) => {
    const newStatus = inq.status === 'RESOLVED' ? 'PENDING' : 'RESOLVED';
    setInquiries((prev) =>
      prev.map((item) => (item.id === inq.id ? { ...item, status: newStatus } : item))
    );
    try {
      await adminApi.updateInquiryStatus(inq.id, newStatus);
    } catch {
      // Fallback
    }
    showSuccess(`Marked inquiry as ${newStatus}`);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>Public Inquiries Inbox</h2>
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
          Review contact requests, volunteer applications, and CSR partnership inquiries.
        </p>
      </div>

      {loading ? (
        <Spinner text="Loading inquiries..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inq.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>{inq.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-slate-800)' }}>{inq.subject}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inq.message}
                    </div>
                  </td>
                  <td>{inq.phone}</td>
                  <td>{inq.date}</td>
                  <td>
                    <span className={`badge ${inq.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button variant="outline" size="sm" onClick={() => setActiveInquiry(inq)}>
                        View
                      </Button>
                      <Button
                        variant={inq.status === 'RESOLVED' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => toggleResolved(inq)}
                      >
                        {inq.status === 'RESOLVED' ? 'Reopen' : 'Mark Done'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={Boolean(activeInquiry)}
        onClose={() => setActiveInquiry(null)}
        title={activeInquiry ? `Inquiry from ${activeInquiry.name}` : ''}
      >
        {activeInquiry && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Email:</strong> {activeInquiry.email}
              </div>
              <div>
                <strong>Phone:</strong> {activeInquiry.phone}
              </div>
              <div>
                <strong>Subject:</strong> {activeInquiry.subject}
              </div>
              <div>
                <strong>Date:</strong> {activeInquiry.date}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Message Content:
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--color-slate-800)' }}>
                {activeInquiry.message}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" size="sm" onClick={() => setActiveInquiry(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toggleResolved(activeInquiry);
                  setActiveInquiry(null);
                }}
              >
                {activeInquiry.status === 'RESOLVED' ? 'Mark Pending' : 'Mark Resolved'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
