import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Presentation } from 'lucide-react';
import { Spinner } from '../../components/common/Loader';

export default function OnlineProgramsPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadImages() {
      try {
        const response = await fetch('/images/online-programs/manifest.json');
        if (!response.ok) {
          throw new Error('The online program images could not be loaded.');
        }
        const manifest = await response.json();
        if (!Array.isArray(manifest.images)) {
          throw new Error('The online program image list is invalid.');
        }
        if (active) setImages(manifest.images);
      } catch (requestError) {
        if (active) setError(requestError.message || 'The online program images could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadImages();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <Link to="/projects" style={{ color: 'var(--color-slate-300)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={17} />
            Projects
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Presentation size={28} color="#fef08a" />
            <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
              Program Archive
            </span>
          </div>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>Online Programs &amp; Webinars</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-slate-300)', maxWidth: '760px' }}>
            View the original presentation slides as full-page banners, in the same order as the PowerPoint.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <Spinner text="Loading program archive..." />
          ) : error ? (
            <p role="alert" className="form-error">{error}</p>
          ) : (
            <>
              <p style={{ color: 'var(--color-slate-600)', marginBottom: '1.5rem' }}>
                {images.length} complete slides from the presentation, shown in their original order.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {images.map((image) => (
                  <figure key={image.src} style={{ margin: 0, overflow: 'hidden', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-slate-200)', backgroundColor: 'white', boxShadow: 'var(--shadow-sm)' }}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <figcaption style={{ padding: '0.75rem 1rem', color: 'var(--color-slate-600)', fontSize: '0.9rem' }}>
                      Slide {image.number}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
