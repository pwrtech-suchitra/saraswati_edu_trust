import React from 'react';
import {
  GraduationCap,
  Sun,
  Sparkles,
  HeartHandshake,
  Recycle,
  Building2,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function ActivitiesPage() {
  const activities = [
    {
      icon: GraduationCap,
      title: 'Charity & Quality Education',
      color: 'var(--color-primary-600)',
      bg: 'var(--color-primary-100)',
      points: [
        'Saraswati Girls Higher Education Scholarship fund covering collegiate degree courses',
        'Distribution of textbooks, STEM kits, and digital tablets in tribal districts',
        'Establishing community reading rooms and digital village libraries',
        'Remedial coaching centres for drop-out prevention among 1st-generation learners',
      ],
    },
    {
      icon: Sun,
      title: 'Renewable Energy & Solar Adoption',
      color: 'var(--color-amber-600)',
      bg: 'var(--color-amber-100)',
      points: [
        'Equipping rural government schools and anganwadis with off-grid rooftop solar packs',
        'Solar powered deep-tube-well community drinking water filtration systems',
        'Technical skilling of local rural youth as certified solar PV technicians',
        'Solar street lighting for remote tribal hamlets lacking grid connectivity',
      ],
    },
    {
      icon: Sparkles,
      title: 'Sustainable Livelihood & Agriculture',
      color: 'var(--color-teal-600)',
      bg: 'var(--color-teal-100)',
      points: [
        'Training women self-help groups (SHGs) in organic khadi handloom weaving and natural dyes',
        'Organic farming workshops, seed banks, and non-pesticide management clusters',
        'Rural micro-enterprise incubation and direct market linkage without middlemen',
        'Mushroom cultivation and beekeeping for supplementary household income',
      ],
    },
    {
      icon: Recycle,
      title: 'Solid Waste Management & Environment',
      color: '#15803d',
      bg: '#dcfce7',
      points: [
        'Decentralized community aerobic composting for wet organic waste in semi-urban wards',
        'Annual indigenous tree plantation drives along riverbanks and degraded catchment areas',
        'Plastic source-segregation awareness campaigns in public schools and markets',
        'Conservation of native bio-diversity and sacred groves',
      ],
    },
    {
      icon: Building2,
      title: 'Government Resource Mobilization',
      color: '#4338ca',
      bg: '#e0e7ff',
      points: [
        'Assisting rural villagers in applying for government welfare schemes and pensions',
        'Facilitating tribal land rights documentation and bank account linkages',
        'Coordinating with District Rural Development Agencies (DRDA) for infrastructure grants',
        'Bridging corporate CSR funding with verified high-need grassroots requirements',
      ],
    },
    {
      icon: HeartHandshake,
      title: 'Community Relief & Healthcare',
      color: '#b91c1c',
      bg: '#fee2e2',
      points: [
        'Mobile health vans and free eye screening camps in underserved rural pockets',
        'Emergency cyclone, flood, and disaster relief ration distribution in coastal belts',
        'Nutritional supplement drives for pregnant women and malnourished infants',
        'Clean sanitation facilities and menstrual hygiene awareness in rural high schools',
      ],
    },
  ];

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Impact In Action
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Trust Core Activities & Initiatives
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '750px' }}>
            Explore how SECT combines social welfare, technology, and community mobilization to spark sustainable change across Odisha.
          </p>
        </div>
      </section>

      {/* Grid of Activities */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '2.5rem' }}>
            {activities.map((act, index) => {
              const Icon = act.icon;
              return (
                <div key={index} className="card card-padded" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: act.bg,
                        color: act.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem' }}>{act.title}</h3>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {act.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.94rem', color: 'var(--color-slate-600)' }}>
                        <CheckCircle size={18} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-slate-100)' }}>
                    <Link to="/projects">
                      <Button variant="outline" size="sm">
                        View Active Projects
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '4rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-white)',
              padding: '3rem',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--color-slate-200)',
            }}
          >
            <h3 style={{ marginBottom: '0.75rem' }}>Want to Volunteer or Sponsor an Activity?</h3>
            <p style={{ color: 'var(--color-slate-500)', maxWidth: '580px', margin: '0 auto 1.75rem' }}>
              We welcome CSR collaborations, individual volunteers, academic partnerships, and technical mentors.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/contact">
                <Button variant="primary">Submit Volunteer Inquiry</Button>
              </Link>
              <Link to="/donate">
                <Button variant="amber">Donate to Activities</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
