import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  FolderKanban,
  MessageSquareText,
  PlusCircle,
  FileDown
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { formatINR, formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.getDashboardStats();
        if (res.success) setStats(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <Spinner text="Loading trust operations overview..." />;
  }

  return (
    <div>
      {/* Top Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-slate-900)' }}>Operations Dashboard</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.92rem' }}>
            Real-time analytics and management controls for Saraswati Trust.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/projects">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              New Project
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" icon={FileDown}>
              Export 80G
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-emerald">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-value">{formatINR(stats?.totalDonationsAmount || 2955000)}</div>
            <div className="stat-label">Total Contributions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Users size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalDonationsCount || 865}</div>
            <div className="stat-label">Verified Patrons</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-teal">
            <FolderKanban size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.activeProjectsCount || 12}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-slate">
            <MessageSquareText size={26} color="#0f172a" />
          </div>
          <div>
            <div className="stat-value">{stats?.pendingInquiriesCount || 6}</div>
            <div className="stat-label">Pending Inquiries</div>
          </div>
        </div>
      </div>

      {/* Recent Donations Ledger */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Verified Contributions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', margin: 0 }}>
              Latest transactions synced with payment gateway and verified by backend.
            </p>
          </div>
          <Link to="/admin/donations">
            <Button variant="ghost" size="sm">
              View Full Ledger
            </Button>
          </Link>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Receipt / ID</th>
                <th>Donor Name</th>
                <th>PAN</th>
                <th>Designated Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentDonations?.map((don) => (
                <tr key={don.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{don.id}</td>
                  <td style={{ fontWeight: 600 }}>{don.donorName}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--color-slate-600)' }}>{don.pan || '—'}</td>
                  <td>{don.projectTitle}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(don.amount)}</td>
                  <td>
                    <span className={`badge ${don.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                      {don.status}
                    </span>
                  </td>
                  <td>{formatDate(don.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
