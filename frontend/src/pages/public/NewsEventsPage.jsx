import React, { useState, useEffect } from 'react';
import { contentApi } from '../../api/contentApi';
import NewsCard from '../../components/cards/NewsCard';
import EventCard from '../../components/cards/EventCard';
import { Spinner } from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';
import { isValidEmail, isValidIndianPhone } from '../../utils/validators';

export default function NewsEventsPage() {
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', attendees: '1' });
  const [regErrors, setRegErrors] = useState({});
  const [submittingReg, setSubmittingReg] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(false);
      try {
        const [newsRes, eventsRes] = await Promise.all([
          contentApi.getNews(),
          contentApi.getEvents(),
        ]);
        if (newsRes.success) setNews(newsRes.data || []);
        if (eventsRes.success) setEvents(eventsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!regForm.name.trim()) errs.name = 'Full name is required';
    if (!regForm.email.trim() || !isValidEmail(regForm.email)) errs.email = 'Valid email is required';
    if (!regForm.phone.trim() || !isValidIndianPhone(regForm.phone)) errs.phone = 'Valid 10-digit phone is required';

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      return;
    }

    setSubmittingReg(true);
    try {
      await contentApi.registerForEvent(selectedEvent.id, regForm);
      showSuccess(`You are registered for ${selectedEvent.title}! Confirmation sent to ${regForm.email}`);
      setSelectedEvent(null);
      setRegForm({ name: '', email: '', phone: '', attendees: '1' });
    } catch {
      showError('Failed to register. Please try again.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Updates & Community
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            News, Press Releases & Events
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            Follow SECT’s field achievements, project inaugurations, community workshops, and volunteer drives.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <section style={{ transform: 'translateY(-2rem)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '0.5rem',
              display: 'inline-flex',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-slate-200)',
            }}
          >
            <button
              onClick={() => setActiveTab('news')}
              className={`btn ${activeTab === 'news' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.65rem 1.75rem' }}
            >
              Press Releases & News
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.65rem 1.75rem' }}
            >
              Upcoming Events & Drives
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          {loading ? (
            <Spinner text="Loading updates..." />
          ) : activeTab === 'news' ? (
            <div className="grid grid-cols-2">
              {news.map((item) => (
                <NewsCard key={item.id} article={item} onReadMore={(art) => setSelectedArticle(art)} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} onRegister={(e) => setSelectedEvent(e)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Article Modal */}
      <Modal
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || 'Press Release'}
      >
        {selectedArticle && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
              <span>Category: <strong>{selectedArticle.category}</strong></span>
              <span>Published: <strong>{selectedArticle.date}</strong></span>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-slate-700)', marginBottom: '1.5rem' }}>
              {selectedArticle.content}
            </p>
            <div style={{ textAlign: 'right' }}>
              <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Event Registration Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Register: ${selectedEvent.title}` : 'Event Registration'}
      >
        {selectedEvent && (
          <form onSubmit={handleRegisterSubmit}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.25rem' }}>
              Date: <strong>{selectedEvent.date}</strong> | Location: <strong>{selectedEvent.location}</strong>
            </p>

            <Input
              label="Full Name"
              placeholder="Your Name"
              value={regForm.name}
              onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              error={regErrors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={regForm.email}
              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              error={regErrors.email}
              required
            />

            <Input
              label="Mobile Number (10 digits)"
              type="tel"
              placeholder="9876543210"
              value={regForm.phone}
              onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              error={regErrors.phone}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submittingReg}>
                Confirm Free Seat
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
