import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { formatINR, formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function AdminDonationsPage() {
  const { showSuccess } = useNotification();
  const [donations, setDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonations() {
      try {
        const res = await adminApi.getDashboardStats();
        if (res.success && res.data?.recentDonations) {
          setDonations(res.data.recentDonations);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, []);

  const handleExportCSV = () => {
    showSuccess('Exporting complete donation ledger to CSV...');
  };

  const handleDownload80G = (don) => {
    showSuccess(`Generating 80G Receipt for ${don.donorName} (${don.id})...`);
  };

  const filtered = donations.filter((d) => {
    const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;
    const matchesSearch =
      !search ||
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      (d.pan && d.pan.toLowerCase().includes(search.toLowerCase())) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>Donation Ledger & 80G Audit</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
            Authoritative financial transaction logs synchronized with gateway webhooks.
          </p>
        </div>
        <Button variant="outline" icon={Download} onClick={handleExportCSV}>
          Export CSV Ledger
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--color-slate-200)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'COMPLETED', 'PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '300px', width: '100%', position: 'relative' }}>
          <Search size={16} color="var(--color-slate-400)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filter by donor, PAN, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.2rem', height: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {loading ? (
        <Spinner text="Loading donation records..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Donor Details</th>
                <th>PAN (80G)</th>
                <th>Project Designation</th>
                <th>Amount (INR)</th>
                <th>Verification Status</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{d.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.donorName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-400)' }}>{d.email}</div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary-800)' }}>
                    {d.pan || <span style={{ color: 'var(--color-slate-300)' }}>Not Given</span>}
                  </td>
                  <td>{d.projectTitle}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(d.amount)}</td>
                  <td>
                    <span className={`badge ${d.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td>{formatDate(d.date)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownload80G(d)}
                      title="Download 80G Certificate"
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
