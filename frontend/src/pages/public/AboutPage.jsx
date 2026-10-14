import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Target, Eye, Globe2, Sparkles, CheckCircle2, Building, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { trustProfileApi } from '../../api/trustProfileApi';
import { Spinner } from '../../components/common/Loader';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await trustProfileApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Error loading trust profile from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const msi = profile?.mission_sustainable_india || {
    title: 'Mission Sustainable India',
    emblem_url: '/mission_sustainable_india.jpg',
    start_date: '2022-08-15',
    historical_context: '15 August 2022 coinciding 75 years of political Independence from British rule',
    narrative: 'We have launched a new mission for our mother earth which shall help India to achieve sustainability in a sustainable approach. Mission Sustainable India is an initiative by an enthusiastic group of volunteers, who have made an attempt to co-work, although located at various parts within the country. The members have collectively been working on different domains of sustainability such as Food, Water, Air, Energy, Waste Management, Habitat and Livelihood, Healthy and Natural living, Afforestation and Bio-diversity, Education, Urbanization and Rural Development, Governance, Bureaucracy, laws and Justice.',
    domains: [
      'Food', 'Water', 'Air', 'Energy', 'Waste Management',
      'Habitat and Livelihood', 'Healthy and Natural living',
      'Afforestation and Bio-diversity', 'Education',
      'Urbanization and Rural Development', 'Governance',
      'Bureaucracy', 'Laws and Justice'
    ],
    five_ps: [
      { key: 'P-1', name: 'Planet', subtitle: 'Environmental Sustainability', description: 'Protection of natural resources (water, vegetation, soil), renewable energy acceleration (solar, wind, biomass, tidal), biogas, and waste recycling.' },
      { key: 'P-2', name: 'People', subtitle: 'Social Sustainability', description: 'Empowering weaker and backward tribal communities, participatory decision making, dynamic education, and healthcare access.' },
      { key: 'P-3', name: 'Prosperity', subtitle: 'Economic Sustainability', description: 'Low-cost high-yield eco-farming, women SHG cooperatives, mobile livestock care, and village-level employment.' },
      { key: 'P-4', name: 'Peace & Well being', subtitle: 'Social Harmony & Health', description: 'Nurturing ethical responsibility, holistic well-being, community mutual aid, and peaceful conflict resolution.' },
      { key: 'P-5', name: 'Partnership', subtitle: 'Collaborative Ecosystems', description: 'Cross-sectoral networks linking volunteers, Gram Panchayats, research organizations, and government schemes.' }
    ],
    sixth_p: {
      key: 'P-6',
      name: 'Political Sustainability',
      subtitle: 'Sustainable Governance',
      description: 'The foundational enabler: the 5Ps can be sustained through transparent, decentralized, and accountable governance.'
    },
    highlights: [
      'To prepare a dynamic Vision Document for putting India to a sustainable development path with time bound action plan.',
      'The start date of the mission is assumed as 15th August, 2022. (Finish date is the date by which the country should be broadly on a sustainable development path)',
      'Aligned with 5 dimensions of Sustainability (Planet, People, Prosperity, Peace and Partnership).',
      'National sustainability to be achieved by making every activity sustainable.',
      'Proposes structural changes in Governance, Bureaucracy, Judiciary, Education and other domains.',
      'De-growth of over developed places and sustainable development of villages.',
      'Citizens as the "Central Pillar" of democracy to exercise their duties.'
    ]
  };

  const trustees = [
    { name: 'Dr. Sarojini Panda', role: 'Managing Trustee & Educationist', bio: 'Former University Dean with 30+ years advancing rural literacy and girl child education in eastern India.' },
    { name: 'Er. Debabrata Mohanty', role: 'Trustee — Energy & Infrastructure', bio: 'Renewable energy pioneer focused on decentralized solar grids and rural water security.' },
    { name: 'Smt. Minati Mishra', role: 'Trustee — Livelihood & Artisan Welfare', bio: 'Social activist and cooperative organizer empowering thousands of handloom weavers.' },
  ];

  if (loading) {
    return <Spinner text="Loading trust profile from database..." />;
  }

  return (
    <div>
      {/* 1. Hero Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="SECT Logo" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
            <div>
              <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
                Institutional Profile
              </span>
              <h1 style={{ color: 'white', margin: 0, fontSize: '2.2rem' }}>
                Saraswati Educational & Charitable Trust
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-slate-300)', maxWidth: '850px', lineHeight: '1.7', marginTop: '1rem' }}>
            A professionally managed committed NGO active in community capacity building, renewable energy dissemination, dynamic education, and issue-based networking across India.
          </p>
        </div>
      </section>

      {/* 2. Structured Introduction */}
      <section className="section" style={{ backgroundColor: 'var(--color-slate-50)' }}>
        <div className="container">
          <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-primary-600)', boxShadow: 'var(--shadow-md)' }}>
            <span className="section-badge" style={{ marginBottom: '0.75rem' }}>Introduction</span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)', marginBottom: '1.25rem' }}>
              Who We Are & What We Do
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)', marginBottom: '1.5rem' }}>
              <strong>SARASWATI EDUCATIONAL &amp; CHARITABLE TRUST (SECT)</strong> is a professionally managed committed NGO active in community capacity building and issue based networking. The primary focus of SECT involves:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                <h4 style={{ color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>🌱 Charity & Social Service</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                  Active in community charity, social service, education, teaching, and promotion of dynamic education.
                </p>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                <h4 style={{ color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>☀️ Renewable Energy (RE)</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                  Implementation of wind, solar, and biomass energy technologies; prefeasibility studies and public energy conservation awareness.
                </p>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                <h4 style={{ color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>♻️ Ecological Technologies</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                  Solid Waste Management (MSW), Biogas, community building, reduce, recycle, reuse, and e-vehicle promotion.
                </p>
              </div>
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-slate-200)' }}>
                <h4 style={{ color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>💧 Natural Resource Protection</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                  Protection of natural resources such as water, vegetation, and soil for both public and commercial needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission (With Verbatim 6th P Statement) */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2">
            {/* Vision */}
            <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-amber-500)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Eye size={30} color="var(--color-amber-600)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-slate-900)' }}>Our Vision</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-slate-700)' }}>
                {profile?.vision || 'To explore, develop and sustain efforts for develop renewable energy sector and enhance its natural resources use.'}
              </p>
            </div>

            {/* Mission */}
            <div className="card card-padded" style={{ borderLeft: '6px solid var(--color-primary-600)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Target size={30} color="var(--color-primary-600)" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-slate-900)' }}>Our Mission</h3>
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)' }}>
                {profile?.mission || 'To provide energy and support to the weaker and backward tribal community to empower them so that they can become capable of make use of the resource and to create an environment where they can play the decision making role in the society and to manage the resources through the participatory value based process. We have been working on 5P principle i.e. Prosperity (Economic Sustainability), Planet (Environmental Sustainability), People (Social Sustainability), Peace and Partnership to have sustainable development. We believe that the above 5Ps can be achieved with the 6th P i.e., Political Sustainability which can come from Sustainable Governance.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP INITIATIVE: MISSION SUSTAINABLE INDIA (PDF Pages 2 & 3) */}
      <section className="section" style={{ backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)', gap: '3rem', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={16} />
                <span>Flagship National Initiative • Launched 15 August 2022</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#14532d', marginBottom: '1rem', lineHeight: '1.25' }}>
                Mission Sustainable India
              </h2>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#15803d', marginBottom: '1.25rem' }}>
                Coinciding with 75 years of Indian Political Independence
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#166534', marginBottom: '1.5rem' }}>
                {msi.narrative}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {msi.domains?.map((d, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #86efac',
                      color: '#166534',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Mission Emblem */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '1.25rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', border: '2px solid #86efac' }}>
                <img
                  src={msi.emblem_url || '/mission_sustainable_india.jpg'}
                  alt="Mission Sustainable India Emblem"
                  style={{ width: '260px', height: '260px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                />
                <div style={{ marginTop: '1rem', fontWeight: 800, color: '#14532d', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                  लक्ष्य — शाश्वत भारत
                </div>
                <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.25rem' }}>
                  Mission Sustainable India • 5P Framework
                </div>
              </div>
            </div>
          </div>

          {/* 5Ps + 6th P Interactive Cards */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="section-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                The Sustainability Engine
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#14532d', marginBottom: '0.5rem' }}>
                The 5P Framework + 6th P (Political Sustainability)
              </h3>
              <p style={{ color: '#166534', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                Consolidated vision chapters formulated by multi-sectoral professionals working towards sustainable national development.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {msi.five_ps?.map((p, idx) => (
                <div
                  key={idx}
                  className="card card-padded"
                  style={{
                    backgroundColor: 'white',
                    borderTop: '4px solid var(--color-primary-600)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>{p.key}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-800)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      {p.name}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-slate-900)' }}>
                    {p.subtitle}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: '1.6', margin: 0, flex: 1 }}>
                    {p.description}
                  </p>
                </div>
              ))}

              {/* 6th P Card: Political Sustainability */}
              <div
                className="card card-padded"
                style={{
                  backgroundColor: '#fffbeb',
                  borderTop: '4px solid #f59e0b',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b45309' }}>{msi.sixth_p?.key || 'P-6'}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                    The Core Enabler
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#78350f' }}>
                  {msi.sixth_p?.name || 'Political Sustainability'}
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b45309', marginBottom: '0.4rem' }}>
                  Sustainable Governance
                </div>
                <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: '1.6', margin: 0, flex: 1 }}>
                  {msi.sixth_p?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights of Mission Sustainable India */}
          <div className="card card-padded" style={{ backgroundColor: 'white', border: '1px solid #86efac' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#14532d', marginBottom: '1.25rem' }}>
              Highlights of Mission Sustainable India (As per Trust Profile)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {msi.highlights?.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--color-slate-700)' }}>
                  <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statutory Compliance & Certifications */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Compliance & Integrity</span>
            <h2 className="section-title">Official General Particulars & Credentials</h2>
            <p className="section-desc">
              Authoritative particulars of Saraswati Educational & Charitable Trust as filed under Indian Trust laws.
            </p>
          </div>

          <div className="grid grid-cols-4">
            <div className="card card-padded">
              <ShieldCheck size={28} color="var(--color-primary-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.35rem' }}>Statutory Status</h4>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-800)', marginBottom: '0.5rem' }}>
                Registered Public Trust
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)', margin: 0 }}>
                Recognized non-profit public charitable trust in Odisha, India.
              </p>
            </div>

            <div className="card card-padded">
              <Building size={28} color="var(--color-amber-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.35rem' }}>Statutory Audits</h4>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-800)', marginBottom: '0.3rem' }}>
                Audited & Certified
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)', margin: 0 }}>
                Annual statutory audits & Form 10BE filed with income tax authorities.
              </p>
            </div>

            <div className="card card-padded">
              <Award size={28} color="var(--color-teal-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.35rem' }}>Section 80G Approval</h4>
              <div style={{ fontSize: '1.05rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-teal-700)', marginBottom: '0.3rem' }}>
                {profile?.exemption_80g_no || 'AAETS9821BF20214'}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)', margin: 0 }}>
                Eligible for 50% tax deduction on donor contributions.
              </p>
            </div>

            <div className="card card-padded">
              <Globe2 size={28} color="var(--color-primary-600)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.35rem' }}>Trust Registration</h4>
              <div style={{ fontSize: '1.05rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-800)', marginBottom: '0.3rem' }}>
                {profile?.registration_no || 'TRUST/OD/2018/0091'}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-slate-500)', margin: 0 }}>
                Registered Public Educational & Charitable Trust, Odisha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Board of Trustees */}
      <section className="section" style={{ backgroundColor: 'var(--color-slate-50)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-badge">Leadership</span>
            <h2 className="section-title">Board of Trustees</h2>
            <p className="section-desc">
              Governed by committed educators, renewable energy engineers, and grassroots social workers.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {trustees.map((t, idx) => (
              <div key={idx} className="card card-padded">
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-100)',
                    color: 'var(--color-primary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  {t.name.split(' ')[1]?.[0] || 'T'}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{t.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: '0.85rem' }}>
                  {t.role}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>{t.bio}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Connect With Trust Secretariat
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
