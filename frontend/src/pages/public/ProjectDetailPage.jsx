import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ArrowLeft,
  Users,
  Calendar,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { formatINR, calculateProgress, formatDate } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { showSuccess } = useNotification();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await projectApi.getProject(id);
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError('Project details could not be found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Project link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0' }}>
        <Spinner size={36} text="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <Alert type="error" title="Project Not Found">
          {error || 'Unable to retrieve project details.'}
        </Alert>
        <Link to="/projects">
          <Button variant="outline" icon={ArrowLeft}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const progress = calculateProgress(project.raisedAmount, project.targetAmount);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Top Breadcrumb & Title */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '3.5rem 0' }}>
        <div className="container">
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-slate-300)',
              fontSize: '0.88rem',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>All Projects</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            {project.category && <span className="badge badge-emerald" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
              {project.category}
            </span>}
            {project.status && <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-300)' }}>
              Status: {project.status}
            </span>}
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* Main Details Grid */}
      <section className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '2.5rem' }} className="project-detail-grid">
          {/* Left: Media & Description */}
          <div>
            <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
              <img
                src={project.imageUrl}
                alt={project.title}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Initiative Overview</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)', marginBottom: '2rem' }}>
              {project.description || project.shortDescription}
            </p>

            {/* Impact Metrics Section */}
            {project.impactMetrics && project.impactMetrics.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Target Impact Outcomes</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  {project.impactMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'var(--color-white)',
                        border: '1px solid var(--color-slate-200)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '1.25rem',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', marginTop: '0.25rem' }}>
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: Funding Progress Card & Direct Action */}
          <div>
            <div
              className="card card-padded"
              style={{
                position: 'sticky',
                top: 'calc(var(--header-height) + 1.5rem)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                  Active Campaign
                </span>
                <button
                  onClick={handleShare}
                  className="btn btn-ghost btn-sm"
                  title="Share Project"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-slate-900)', lineHeight: '1.1' }}>
                  {formatINR(project.raisedAmount)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>
                  pledged of {formatINR(project.targetAmount)} target goal
                </div>

                <div className="progress-bar-wrap" style={{ height: '10px', margin: '1rem 0' }}>
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--color-primary-700)' }}>{progress}% Complete</span>
                  <span style={{ color: 'var(--color-slate-600)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {project.donorCount !== undefined && project.donorCount !== null && <><Users size={15} /> {project.donorCount} Donors</>}
                  </span>
                </div>
              </div>

              {/* Timeline Info */}
              {(project.startDate || project.endDate) && <div
                style={{
                  borderTop: '1px solid var(--color-slate-200)',
                  borderBottom: '1px solid var(--color-slate-200)',
                  padding: '1rem 0',
                  marginBottom: '1.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-slate-600)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Calendar size={16} color="var(--color-amber-600)" />
                <span>Campaign Window: {formatDate(project.startDate)} to {formatDate(project.endDate)}</span>
              </div>}

              {/* Action */}
              <Link to={`/donate?project=${project.id}`} style={{ width: '100%' }}>
                <Button variant="amber" size="lg" icon={Heart} style={{ width: '100%', marginBottom: '0.75rem' }}>
                  Donate to this Project
                </Button>
              </Link>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-700)',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} />
                <span>UPI transfers are confirmed against Trust bank records</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 850px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
