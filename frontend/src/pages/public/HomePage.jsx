import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Leaf,
  Briefcase,
  Sprout,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import ProjectCard from '../../components/cards/ProjectCard';
import { CardSkeleton } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { trustProfileApi } from '../../api/trustProfileApi';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [mission, setMission] = useState(null);
  const [trustProfile, setTrustProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const results = await Promise.allSettled([
        projectApi.listProjects({ limit: 3 }),
        trustProfileApi.getActivityPillars(),
        trustProfileApi.getMissionSustainableIndia(),
        trustProfileApi.getProfile()
      ]);
      const [projectsResult, pillarsResult, missionResult, profileResult] = results;
      if (projectsResult.status === 'fulfilled' && projectsResult.value.success) {
        setFeaturedProjects(projectsResult.value.data.slice(0, 3));
      } else if (projectsResult.status === 'rejected') {
        console.error('Failed to load homepage projects:', projectsResult.reason);
      }
      if (pillarsResult.status === 'fulfilled' && pillarsResult.value.success && Array.isArray(pillarsResult.value.data)) {
        setPillars(pillarsResult.value.data);
      } else if (pillarsResult.status === 'rejected') {
        console.error('Failed to load homepage activity pillars:', pillarsResult.reason);
      }
      if (missionResult.status === 'fulfilled' && missionResult.value.success) {
        setMission(missionResult.value.data);
      } else if (missionResult.status === 'rejected') {
        console.error('Failed to load homepage mission profile:', missionResult.reason);
      }
      if (profileResult.status === 'fulfilled' && profileResult.value.success) {
        setTrustProfile(profileResult.value.data);
      } else if (profileResult.status === 'rejected') {
        console.error('Failed to load homepage trust profile:', profileResult.reason);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const pillarIcons = { Leaf, Briefcase, Sprout, Users };

  return (
    <div style={{ backgroundColor: 'var(--color-white)' }}>
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <img
          src="/images/sect-hero.jpe"
          alt="SECT community and sustainability initiative"
          className="home-hero-image"
        />
      </section>

      {/* 2. HOMEPAGE INTRODUCTION */}
      <section style={{ position: 'relative', zIndex: 1, marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-slate-200)',
              borderTop: '4px solid var(--color-primary-600)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={16} />
              <span>{trustProfile?.short_name || 'SECT'}</span>
            </div>
            <h1
              style={{
                color: 'var(--color-slate-900)',
                fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: '1rem',
              }}
            >
              {trustProfile?.trust_name || trustProfile?.short_name || 'Welcome'}
            </h1>
            <p
              style={{
                color: 'var(--color-slate-700)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                maxWidth: '800px',
                margin: '0 auto 1.75rem',
              }}
            >
              {trustProfile?.introduction || 'Trust information is temporarily unavailable.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Donate
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Community Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Activity areas from the trust profile */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Official Trust Charter</span>
            <h2 className="section-title">Our Activity Areas</h2>
            <p className="section-desc">
              The trust's current activity areas and mandates.
            </p>
          </div>
          <div className="grid grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.icon] || Sparkles;
              return (
                <div key={pillar.id} className="card card-padded">
                  <div className="stat-icon-wrap stat-icon-emerald" style={{ marginBottom: '1.25rem' }}>
                    <Icon size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                    {pillar.summary}
                  </p>
                  <Link to="/activities" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    View {pillar.mandates?.length || 0} Mandates
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {mission && <section className="section" style={{ backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={16} />
                <span>{mission.historical_context}</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#14532d', marginBottom: '1rem', lineHeight: '1.25' }}>
                {mission.title}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#166534', marginBottom: '1.5rem' }}>
                {mission.narrative}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about">
                  <Button variant="primary" size="md">
                    Learn More
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="md">
                    Support the Mission
                  </Button>
                </Link>
              </div>
            </div>

            {mission.emblem_url && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '1.25rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '2px solid #86efac' }}>
                  <img
                    src={mission.emblem_url}
                    alt={`${mission.title} Emblem`}
                    style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ marginTop: '0.75rem', fontWeight: 800, color: '#14532d', fontSize: '1.05rem' }}>
                    {mission.title}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>}

      {/* 6. FEATURED PROJECTS LOADED DIRECTLY FROM DATABASE */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Live Initiatives</span>
            <h2 className="section-title">Community Campaigns</h2>
            <p className="section-desc">
              Explore active community projects and their funding information.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/projects">
              <Button variant="outline" size="lg" icon={ArrowRight}>
                View All Ongoing Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. STATUTORY CREDENTIALS & CALL TO ACTION */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--border-radius-xl)',
              padding: '3.5rem 3rem',
              color: 'var(--color-slate-900)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-slate-200)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-primary-50)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-900)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={18} />
              Support community initiatives
            </div>

            <h2 style={{ color: 'var(--color-slate-900)', fontSize: '2rem', marginBottom: '1rem' }}>
              Support {trustProfile?.trust_name || 'the Trust'}
            </h2>
            <p
              style={{
                maxWidth: '640px',
                margin: '0 auto 2.25rem',
                color: 'var(--color-slate-700)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
              }}
            >
              Learn about the trust's work or contact the team to explore ways to contribute.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Donate
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Trust Secretariat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
