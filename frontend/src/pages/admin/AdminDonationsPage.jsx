import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { formatINR, formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function AdminDonationsPage() {
  const { showError, showSuccess } = useNotification();
  const [donations, setDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDonations() {
      setLoading(true);
      try {
        const params = filterStatus === 'ALL' ? {} : { status: filterStatus };
        const response = await adminApi.getDonations(params);
        setDonations(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (requestError) {
        setError(requestError.message || 'Donation submissions could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, [filterStatus]);

  async function handleDecision(donation, decision) {
    const confirming = decision === 'confirm';
    const message = confirming
      ? 'Confirm only after matching this transaction reference and amount against the Trust bank/UPI statement. Issue the receipt now?'
      : 'Reject this pending UPI submission? No receipt will be issued.';
    if (!window.confirm(message)) return;

    try {
      if (confirming) {
        await adminApi.confirmManualDonation(donation.id);
        showSuccess('Bank-verified donation confirmed and receipt issued.');
      } else {
        await adminApi.rejectManualDonation(donation.id);
        showSuccess('UPI submission rejected.');
      }
      const params = filterStatus === 'ALL' ? {} : { status: filterStatus };
      const response = await adminApi.getDonations(params);
      setDonations(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      showError(requestError.message || 'The donation status could not be updated.');
    }
  }

  const filtered = donations.filter((donation) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return [donation.donor_name, donation.donor_email, donation.payment_reference, donation.id]
      .some((value) => String(value || '').toLowerCase().includes(query));
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>UPI Donation Reconciliation</h2>
        <p style={{ color: 'var(--color-slate-600)', fontSize: '0.9rem' }}>
          Verify each transaction against the Trust bank/UPI statement before confirming. Confirmation issues the receipt.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'end', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label className="form-group" style={{ margin: 0, minWidth: '180px' }}>
          <span className="form-label">Review status</span>
          <select className="form-select" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            {['PENDING', 'COMPLETED', 'FAILED', 'ALL'].map((status) => (
              <option key={status} value={status}>{status === 'ALL' ? 'All submissions' : status}</option>
            ))}
          </select>
        </label>
        <div style={{ maxWidth: '360px', width: '100%', position: 'relative' }}>
          <Search size={16} color="var(--color-slate-500)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="search"
            aria-label="Search donation submissions"
            placeholder="Search donor or UPI reference"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
      </div>

      <p role="note" className="alert alert-warning">
        A donor-submitted reference is not proof of payment. Confirm only after the amount and reference match the Trust's bank records.
      </p>

      {loading ? <Spinner text="Loading donation submissions..." /> : error ? (
        <p role="alert" className="form-error">{error}</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Donor</th>
                <th>UPI Reference</th>
                <th>Amount</th>
                <th>Project</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((donation) => (
                <tr key={donation.id}>
                  <td>{formatDate(donation.created_at)}</td>
                  <td>
                    <strong>{donation.donor_name}</strong>
                    <div style={{ color: 'var(--color-slate-600)', fontSize: '0.82rem' }}>{donation.donor_email}</div>
                    {donation.donor_phone && <div style={{ color: 'var(--color-slate-600)', fontSize: '0.82rem' }}>{donation.donor_phone}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>{donation.payment_reference || 'Gateway payment'}</td>
                  <td style={{ fontWeight: 700 }}>{formatINR(Number(donation.amount))}</td>
                  <td>{donation.project_title || 'General Trust Fund'}</td>
                  <td><span className={`badge ${donation.status === 'COMPLETED' ? 'badge-success' : donation.status === 'PENDING' ? 'badge-warning' : 'badge-neutral'}`}>{donation.status}</span></td>
                  <td>{donation.receipt_number || 'Not issued'}</td>
                  <td>
                    {donation.status === 'PENDING' && donation.payment_method === 'UPI_QR' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Button variant="primary" size="sm" icon={CheckCircle2} onClick={() => handleDecision(donation, 'confirm')}>Confirm</Button>
                        <Button variant="outline" size="sm" icon={XCircle} onClick={() => handleDecision(donation, 'reject')}>Reject</Button>
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No submissions match this filter.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
