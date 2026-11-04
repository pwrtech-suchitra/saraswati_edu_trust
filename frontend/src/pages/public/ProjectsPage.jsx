import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, FolderOpen, Presentation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import ProjectCard from '../../components/cards/ProjectCard';
import { CardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

function loadProjects(category, search) {
  return Promise.all([
    projectApi.listProjects({ category, search }),
    projectApi.listCategories(),
  ]);
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async ({
    showLoading = true,
    category = selectedCategory,
    query = searchQuery,
  } = {}) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [projRes, catRes] = await loadProjects(category, query);

      if (projRes.success) {
        setProjects(projRes.data || []);
      }
      if (catRes.success) {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    loadProjects(selectedCategory, searchQuery)
      .then(([projRes, catRes]) => {
        if (cancelled) return;
        setError(null);
        if (projRes.success) setProjects(projRes.data || []);
        if (catRes.success) setCategories(catRes.data || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load projects. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === selectedCategory) return;
    setLoading(true);
    setError(null);
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Direct Community Impact
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            SECT Community Projects
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            Discover transparent, measurable grassroots projects seeking patron support. Track funding goals and beneficiary outcomes in real-time.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingTop: '2rem' }}>
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            padding: '1.5rem 2rem',
            borderLeft: '6px solid var(--color-primary-600)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Presentation size={32} color="var(--color-primary-700)" />
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Online Programs &amp; Webinars</h2>
              <p style={{ color: 'var(--color-slate-600)', margin: 0 }}>
                Browse images from SECT&apos;s online program presentations and webinars.
              </p>
            </div>
          </div>
          <Link className="btn btn-primary" to="/projects/online-programs">
            Explore program archive
          </Link>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ transform: 'translateY(-2rem)', zIndex: 10, position: 'relative' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-slate-200)',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            {/* Category tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
              >
                All Projects
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px', maxWidth: '380px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} color="var(--color-slate-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.88rem' }}
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          {error && (
            <Alert type="error" title="Could not retrieve projects" onClose={() => setError(null)}>
              {error}
              <div style={{ marginTop: '0.5rem' }}>
                <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchProjects}>
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No projects found"
              description="There are currently no active projects matching your selected category or search term."
              actionText="Reset All Filters"
              onAction={() => {
                if (selectedCategory !== 'all') {
                  handleCategoryChange('all');
                } else {
                  fetchProjects({ category: 'all', query: '' });
                }
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="grid grid-cols-3">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
