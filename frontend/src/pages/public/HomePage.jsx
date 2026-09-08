import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sun,
  GraduationCap,
  Sparkles,
  TreePine,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import ProjectCard from '../../components/cards/ProjectCard';
import { CardSkeleton } from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await projectApi.listProjects({ limit: 3 });
        if (res.success && Array.isArray(res.data)) {
          setFeaturedProjects(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(20, 85, 65, 0.95) 0%, #08281d 100%)',
          color: 'var(--color-white)',
          paddingTop: '5rem',
          paddingBottom: '6rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232, 149, 40, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fef08a',
                marginBottom: '1.75rem',
              }}
            >
              <ShieldCheck size={16} />
              <span>Saraswati Educational & Charitable Trust — Registered Public Trust</span>
            </div>

            <h1
              style={{
                color: 'var(--color-white)',
                marginBottom: '1.5rem',
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Empowering Rural Communities Through Education, Clean Energy & Sustainable Livelihood
            </h1>

            <p
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '2.5rem',
                maxWidth: '720px',
              }}
            >
              Dedicated to uplifting underprivileged communities across Odisha and eastern India with solar power for rural schools, girl child scholarships, organic livelihoods, and environmental restoration.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Support Our Mission
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline-white" size="lg" icon={ArrowRight}>
                  View Active Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT COUNTER BAR */}
      <section style={{ transform: 'translateY(-2.5rem)', marginBottom: '-1rem' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-slate-200)',
              padding: '2rem 2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-emerald">
                <GraduationCap size={28} />
              </div>
              <div>
                <div className="stat-value">12,000+</div>
                <div className="stat-label">Children Educated</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-amber">
                <Sun size={28} />
              </div>
              <div>
                <div className="stat-value">50+</div>
                <div className="stat-label">Solar Schools Energized</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-teal">
                <Sparkles size={28} />
              </div>
              <div>
                <div className="stat-value">1,500+</div>
                <div className="stat-label">Artisans Empowered</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-slate">
                <ShieldCheck size={28} color="#155541" />
              </div>
              <div>
                <div className="stat-value">100%</div>
                <div className="stat-label">80G Tax Deductible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Strategic Focus</span>
            <h2 className="section-title">Our Core Action Pillars</h2>
            <p className="section-desc">
              Addressing multi-dimensional socio-economic challenges with sustainable, locally rooted programs.
            </p>
          </div>

          <div className="grid grid-cols-4">
            {/* Pillar 1 */}
            <div className="card card-padded">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Child Education & STEM</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                Scholarships for young women, rural library installations, digital literacy labs, and teacher capability building.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card card-padded">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--color-amber-100)',
                  color: 'var(--color-amber-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sun size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Solar & Clean Energy</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                Off-grid rooftop solar packs for rural hospitals and educational institutions, solar water pumps, and clean tech training.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card card-padded">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--color-teal-100)',
                  color: 'var(--color-teal-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Sustainable Livelihoods</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                Handloom weaving collectives, organic natural dye adoption, organic farm clusters, and women micro-enterprises.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="card card-padded">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--color-slate-100)',
                  color: 'var(--color-slate-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <TreePine size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Solid Waste & Ecology</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                Decentralized municipal wet-waste composting units, indigenous tree planting drives, and clean river initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SECTION */}
      <section className="section" style={{ backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-slate-200)', borderBottom: '1px solid var(--color-slate-200)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-badge amber">Make An Impact</span>
              <h2 className="section-title">Active Community Projects</h2>
              <p className="section-desc" style={{ marginBottom: 0 }}>
                Transparent grassroots projects with measurable outcomes.
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline" icon={ArrowRight}>
                View All Projects
              </Button>
            </Link>
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
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-teal-700) 100%)',
              borderRadius: 'var(--border-radius-xl)',
              padding: '4rem 3rem',
              color: 'var(--color-white)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h2 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
              Your Contribution Creates Generational Change
            </h2>
            <p
              style={{
                maxWidth: '620px',
                margin: '0 auto 2.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.15rem',
              }}
            >
              Every rupee donated to Saraswati Educational & Charitable Trust is backed by 100% financial transparency, rigorous audit reports, and official 80G tax receipts.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Donate With 80G Tax Benefit
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-white" size="lg">
                  Partner With SECT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
