import React, { useState, useEffect } from 'react';
import { contentApi } from '../../api/contentApi';
import { Spinner } from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await contentApi.getGallery();
        if (res.success) setItems(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ['All', 'Education', 'Energy', 'Livelihood', 'Environment'];

  const filtered = activeFilter === 'All'
    ? items
    : items.filter((it) => it.category?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Visual Transparency
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            SECT Impact Photo Gallery
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            Witness genuine moments from our solar classroom installations, artisan handloom training workshops, and ecological drives across eastern India.
          </p>
        </div>
      </section>

      <section style={{ transform: 'translateY(-2rem)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '0.65rem 1.25rem',
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-slate-200)',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`btn btn-sm ${activeFilter === cat ? 'btn-primary' : 'btn-outline'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          {loading ? (
            <Spinner text="Loading photo gallery..." />
          ) : (
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActivePhoto(item)}
                  className="card"
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                >
                  <div style={{ height: '280px', overflow: 'hidden', backgroundColor: 'var(--color-slate-100)' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-slate-800)' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        title={activePhoto?.title || 'Photo View'}
        maxWidth="720px"
      >
        {activePhoto && (
          <div>
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              style={{ width: '100%', borderRadius: 'var(--border-radius-md)', maxHeight: '480px', objectFit: 'contain', backgroundColor: 'var(--color-slate-100)', marginBottom: '1rem' }}
            />
            <p style={{ color: 'var(--color-slate-600)', fontSize: '0.95rem' }}>
              Category: <strong>{activePhoto.category}</strong>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
