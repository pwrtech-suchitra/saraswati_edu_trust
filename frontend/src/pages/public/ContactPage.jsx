import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle, Building2, ShieldCheck, ExternalLink } from 'lucide-react';
import { contactApi } from '../../api/contactApi';
import { trustProfileApi } from '../../api/trustProfileApi';
import { isValidEmail, isValidIndianPhone } from '../../utils/validators';
import { useNotification } from '../../hooks/useNotification';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
export default function ContactPage() {
  const { showSuccess, showError } = useNotification();
  const [trustProfile, setTrustProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await trustProfileApi.getProfile();
        if (res.success && res.data) {
          setTrustProfile(res.data);
        }
      } catch (err) {
        console.error('Error loading trust profile for contact page:', err);
      }
    }
    loadProfile();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !isValidEmail(formData.email)) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || !isValidIndianPhone(formData.phone)) errs.phone = 'Valid 10-digit Indian phone is required';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.length < 15) errs.message = 'Message must be at least 15 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please correct the errors in the inquiry form.');
      return;
    }

    setLoading(true);
    try {
      await contactApi.submitInquiry(formData);
      setSubmitted(true);
      showSuccess('Your message was successfully recorded in the trust database.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      showError(err.message || 'Failed to submit inquiry to database');
    } finally {
      setLoading(false);
    }
  };

  const details = {
    address: trustProfile?.address || 'K-8-82, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha-751029',
    landline: trustProfile?.phone_landline || '0674-2954256',
    mobiles: trustProfile?.phone_mobiles || ['9937159760', '9438747172'],
    email: trustProfile?.email || 'strust12@gmail.com',
  };

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Reach Out
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Contact & Secretariat Coordinates
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            Have questions about our renewable energy programs, rural schools, or wish to partner under Mission Sustainable India? Connect with our team.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1.75fr)', gap: '3.5rem' }} className="contact-grid">
            {/* Left: Office & Statutory Coordinates */}
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--color-slate-900)' }}>Trust Secretariat</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Registered Office */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-emerald" style={{ width: '46px', height: '46px' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Registered Corporate Office</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0, lineHeight: '1.5' }}>
                      {details.address}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-amber" style={{ width: '46px', height: '46px' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Official Email</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                      <a href={`mailto:${details.email}`} style={{ color: 'var(--color-primary-700)', fontWeight: 600 }}>
                        {details.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Landline & Mobiles */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-teal" style={{ width: '46px', height: '46px' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Phone & Mobile Numbers</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0, lineHeight: '1.5' }}>
                      Landline: <strong>{details.landline}</strong><br />
                      Mobile: {details.mobiles.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Direct WhatsApp Links */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>WhatsApp Direct Chat</h4>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {details.mobiles.map((mob, idx) => (
                        <a
                          key={idx}
                          href={`https://wa.me/91${mob}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Chat +91 {mob}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secretariat Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-slate" style={{ width: '46px', height: '46px' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Secretariat Working Hours</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', margin: 0 }}>
                      Monday – Saturday: 9:30 AM – 5:30 PM (IST)
                    </p>
                  </div>
                </div>
              </div>

              {/* Statutory Credentials Box */}
              <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-slate-200)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={20} color="var(--color-primary-700)" />
                  <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--color-slate-900)' }}>Official Statutory Credentials</h4>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', lineHeight: '1.6' }}>
                  <div><strong>Trust Legal Name:</strong> Saraswati Educational & Charitable Trust</div>
                  <div><strong>Tax Exemption:</strong> Section 80G Certified Non-Profit</div>
                  <div><strong>Official Enquiries:</strong> Assistance for grants & CSR available via secretariat email</div>
                </div>
              </div>

              {/* Social Channels (Page 5 of PDF) */}
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--color-slate-800)' }}>Stay Connected on Social Platforms</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-300)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}
                  >
                    Facebook: Saraswati Educational Charitable Trust
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-300)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}
                  >
                    X/Twitter: @saraswati_trust
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-300)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}
                  >
                    LinkedIn: Saraswati Educational Charitable Trust
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="card card-padded" style={{ boxShadow: 'var(--shadow-md)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-100)',
                      color: 'var(--color-primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Message Submitted Successfully</h3>
                  <p style={{ color: 'var(--color-slate-600)', maxWidth: '420px', margin: '0 auto 2rem' }}>
                    Thank you for reaching out to Saraswati Educational &amp; Charitable Trust. Your message has been saved to our database and our secretariat will respond promptly.
                  </p>
                  <Button variant="primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Send Us an Inquiry</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.75rem' }}>
                    Whether you are an individual patron, volunteer, or Gram Panchayat representative, submit your inquiry below.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <Input
                      label="Your Full Name"
                      placeholder="e.g. Ramesh Chandra Das"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <Input
                      label="Phone Number (10 digits)"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      required
                    />

                    <Input
                      label="Inquiry Subject"
                      placeholder="e.g. Rural Solar project / Volunteer / Agriculture"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      error={errors.subject}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Your Message <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <textarea
                      rows="4"
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Describe your inquiry, project proposal, or query in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <div className="form-error">{errors.message}</div>}
                  </div>

                  <Button type="submit" variant="primary" size="lg" loading={loading} icon={Send} style={{ width: '100%' }}>
                    Submit Inquiry to Secretariat
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 850px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
