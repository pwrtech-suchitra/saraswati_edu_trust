import React, { useState, useEffect } from 'react';
import { FolderKanban, MessageSquareText, PlusCircle } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-slate-900)' }}>Operations Dashboard</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.92rem' }}>
            Project and inquiry management.
          </p>
        </div>
        <Link to="/admin/projects">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: '2.5rem' }}>
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
    </div>
  );
}
