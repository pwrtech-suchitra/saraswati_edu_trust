import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Heart, FileText, Download, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { donationApi } from '../../api/donationApi';
import { formatINR, formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showSuccess } = useNotification();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonations() {
      try {
        const res = await donationApi.getMyDonations();
        if (res.success) {
          setDonations(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, []);

  const handleDownloadReceipt = (don) => {
    showSuccess(`Generating official 80G Tax Receipt for ${don.id}...`);
  };

  const totalContributed = donations
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* User Card */}
        <div
          className="card card-padded"
          style={{
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-primary-50) 100%)',
            border: '1px solid var(--color-primary-100)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                }}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h2 style={{ fontSize: '1.6rem' }}>{user?.name || 'Patron'}</h2>
                  <span className="badge badge-emerald">{user?.role || 'MEMBER'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-slate-500)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                  <Mail size={15} />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>Lifetime Contribution</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                {formatINR(totalContributed)}
              </div>
            </div>
          </div>
        </div>

        {/* Donation History Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem' }}>My Contribution Ledger</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)' }}>
              Download official 80G tax receipt vouchers for your records and tax filing.
            </p>
          </div>
          <Link to="/donate">
            <Button variant="amber" size="sm" icon={Heart}>
              Make a Donation
            </Button>
          </Link>
        </div>

        {loading ? (
          <Spinner text="Loading contribution records..." />
        ) : donations.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No donation records found"
            description="You have not made any recorded donations under this account yet. Support one of our active community initiatives today!"
            actionText="Donate to a Project"
            onAction={() => (window.location.href = '/donate')}
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Initiative Supported</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>80G Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don) => (
                  <tr key={don.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{don.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-slate-800)' }}>
                      {don.projectTitle || 'General Trust Fund'}
                    </td>
                    <td>{formatDate(don.date)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>
                      {formatINR(don.amount)}
                    </td>
                    <td>
                      <span className={`badge ${don.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                        {don.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {don.status === 'COMPLETED' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDownloadReceipt(don)}
                        >
                          80G Voucher
                        </Button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
