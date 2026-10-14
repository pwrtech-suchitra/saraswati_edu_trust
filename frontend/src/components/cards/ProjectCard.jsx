import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';
import { formatINR, calculateProgress } from '../../utils/formatters';
import Button from '../common/Button';

export default function ProjectCard({ project }) {
  const progress = calculateProgress(project.raisedAmount, project.targetAmount);

  return (
    <div className="card">
      {/* Project Image */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
        <img
          src={project.imageUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>
          <Link to={`/projects/${project.id || project.slug}`} style={{ color: 'var(--color-slate-900)' }}>
            {project.title}
          </Link>
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem', flex: 1 }}>
          {project.shortDescription}
        </p>

        {/* Progress */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--color-primary-700)' }}>Raised: {formatINR(project.raisedAmount)}</span>
            <span style={{ color: 'var(--color-slate-500)' }}>Goal: {formatINR(project.targetAmount)}</span>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--color-slate-500)',
              marginTop: '0.35rem',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={14} /> {project.donorCount || 0} Patrons
            </span>
            <span style={{ fontWeight: 700, color: 'var(--color-amber-600)' }}>{progress}% Funded</span>
          </div>

          {/* Action */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/projects/${project.id || project.slug}`} style={{ flex: 1 }}>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Details
              </Button>
            </Link>
            <Link to={`/donate?project=${project.id}`} style={{ flex: 1 }}>
              <Button variant="amber" size="sm" icon={Heart} style={{ width: '100%' }}>
                Donate
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
