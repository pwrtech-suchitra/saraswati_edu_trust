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
import { trustProfileApi } from '../../api/trustProfileApi';
import ProjectCard from '../../components/cards/ProjectCard';
import { CardSkeleton } from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trustProfile, setTrustProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, profileRes] = await Promise.all([
          projectApi.listProjects({ limit: 3 }),
          trustProfileApi.getProfile()
        ]);
        if (projRes.success && Array.isArray(projRes.data)) {
          setFeaturedProjects(projRes.data.slice(0, 3));
        }
        if (profileRes.success && profileRes.data) {
          setTrustProfile(profileRes.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
      <section style={{ position: 'relative', zIndex: 1, marginTop: '-2.5rem', marginBottom: '2rem' }}>
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
              <span>Saraswati Educational &amp; Charitable Trust • Registered NGO</span>
            </div>
            <h1
              style={{
                color: 'var(--color-slate-900)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Empowering Rural &amp; Tribal Communities Through Renewable Energy &amp; Sustainable Governance
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
              A committed NGO active in community capacity building, clean solar electrification, mobile livestock care, organic dairy training, and Mission Sustainable India.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Donate with 80G Tax Benefit
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

      {/* 3. IMPACT COUNTER BAR */}
      <section>
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
                <Leaf size={28} />
              </div>
              <div>
                <div className="stat-value">50+</div>
                <div className="stat-label">Solar Schools Energized</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-amber">
                <Briefcase size={28} />
              </div>
              <div>
                <div className="stat-value">8,500+</div>
                <div className="stat-label">Livestock Treated</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div className="stat-icon-wrap stat-icon-teal">
                <Sprout size={28} />
              </div>
              <div>
                <div className="stat-value">1,200+</div>
                <div className="stat-label">Organic Farmers Trained</div>
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

      {/* 4. FOUR CORE ACTIVITY PILLARS (AS PER OFFICIAL PDF) */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Official Trust Charter</span>
            <h2 className="section-title">Our 4 Core Activity Pillars</h2>
            <p className="section-desc">
              Structured into 27 authentic mandates across environmental protection, livelihood, organic agriculture, and governance mobilization.
            </p>
          </div>

          <div className="grid grid-cols-4">
            {/* Pillar 1 */}
            <div className="card card-padded" style={{ borderTop: '4px solid #16a34a' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Leaf size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Environmental &amp; Renewable Energy</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Solar, wind, and biomass energy technologies; prefeasibility assessments; bio-compost and solid waste recycling (10 Mandates).
              </p>
              <Link to="/activities" style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
                View 10 Mandates →
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="card card-padded" style={{ borderTop: '4px solid #0284c7' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Briefcase size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Innovative Livelihood</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Mobile Live-stock Hospital, women SHG processing units, water harvesting to check migration, and cattle improvement (6 Mandates).
              </p>
              <Link to="/activities" style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
                View 6 Mandates →
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="card card-padded" style={{ borderTop: '4px solid #d97706' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sprout size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Agricultural Development</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Technologically sound eco-agriculture, low-cost high-yield models, organic farming, and Organic Dairy Farm &amp; Training Centre (4 Mandates).
              </p>
              <Link to="/activities" style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>
                View 4 Mandates →
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="card card-padded" style={{ borderTop: '4px solid #7c3aed' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: '#f3e8ff',
                  color: '#6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Govt. Resource Mobilization</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                Advocacy to alleviate poverty, community participation in Gram Panchayats, and training village-level para-professionals (7 Mandates).
              </p>
              <Link to="/activities" style={{ fontSize: '0.85rem', color: '#6d28d9', fontWeight: 600 }}>
                View 7 Mandates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MISSION SUSTAINABLE INDIA SPOTLIGHT BANNER */}
      <section className="section" style={{ backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={16} />
                <span>Launched on 15 August 2022 (75 Years of Independence)</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#14532d', marginBottom: '1rem', lineHeight: '1.25' }}>
                Mission Sustainable India
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#166534', marginBottom: '1.5rem' }}>
                An initiative by volunteers across India co-working on 13 domains of sustainability (Food, Water, Air, Energy, Waste, Livelihood, Governance, and Justice). Anchored on the 5P principle—<strong>Planet, People, Prosperity, Peace &amp; Well being, and Partnership</strong>—sustained through <strong>Political Sustainability (Sustainable Governance)</strong>.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about">
                  <Button variant="primary" size="md">
                    Read the 5P Vision Document
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="md">
                    Support the Mission
                  </Button>
                </Link>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '1.25rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '2px solid #86efac' }}>
                <img
                  src="/mission_sustainable_india.jpg"
                  alt="Mission Sustainable India Emblem"
                  style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                />
                <div style={{ marginTop: '0.75rem', fontWeight: 800, color: '#14532d', fontSize: '1.05rem' }}>
                  लक्ष्य — शाश्वत भारत
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS LOADED DIRECTLY FROM DATABASE */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Live Initiatives</span>
            <h2 className="section-title">Community Campaigns</h2>
            <p className="section-desc">
              All contributions are stored securely in database, verified via payment webhooks, and backed by Section 80G tax receipts.
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
              <span>Section 80G Tax Exemption Certified Non-Profit</span>
            </div>

            <h2 style={{ color: 'var(--color-slate-900)', fontSize: '2rem', marginBottom: '1rem' }}>
              Support Saraswati Educational &amp; Charitable Trust
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
              Whether contributing through online donation, UPI, or volunteer participation, every rupee creates generational change with 100% financial transparency.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/donate">
                <Button variant="amber" size="lg" icon={Heart}>
                  Donate with 80G Tax Benefit
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
