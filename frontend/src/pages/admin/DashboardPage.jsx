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
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.getDashboardStats();
        if (!res.success) {
          throw new Error(res.message || 'Dashboard metrics could not be loaded.');
        }
        setStats(res.data);
      } catch (requestError) {
        console.error('Failed to load dashboard metrics:', requestError);
        setError(requestError.message || 'Dashboard metrics could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <Spinner text="Loading trust operations overview..." />;
  }
  if (error) {
    return <p role="alert" className="form-error">{error}</p>;
  }

  return (
    <div>
      {/* Top Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-slate-900)' }}>Operations Dashboard</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.92rem' }}>
            Live analytics and management controls.
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
            <div className="stat-value">{formatINR(stats?.total_donations_amount ?? 0)}</div>
            <div className="stat-label">Total Contributions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Users size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.total_donors_count ?? 0}</div>
            <div className="stat-label">Donors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-teal">
            <FolderKanban size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.active_projects_count ?? 0}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-slate">
            <MessageSquareText size={26} color="#0f172a" />
          </div>
          <div>
            <div className="stat-value">{stats?.pending_inquiries_count ?? 0}</div>
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
                <th>Designated Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_donations?.map((don) => (
                <tr key={don.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{don.receipt_number || don.id}</td>
                  <td style={{ fontWeight: 600 }}>{don.donor_name}</td>
                  <td>{don.project_title || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(don.amount)}</td>
                  <td>
                    <span className="badge badge-success">COMPLETED</span>
                  </td>
                  <td>{formatDate(don.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
