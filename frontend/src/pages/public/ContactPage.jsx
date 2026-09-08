import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { contactApi } from '../../api/contactApi';
import { isValidEmail, isValidIndianPhone } from '../../utils/validators';
import { useNotification } from '../../hooks/useNotification';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function ContactPage() {
  const { showSuccess, showError } = useNotification();
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
      showSuccess('Your message was received by SECT secretariat.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      showError(err.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container">
          <span className="section-badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fef08a' }}>
            Reach Out
          </span>
          <h1 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Contact & Volunteer Secretariat
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-slate-300)', maxWidth: '720px' }}>
            Have questions about our educational scholarships, solar projects, or wish to partner with SECT? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)', gap: '3.5rem' }} className="contact-grid">
            {/* Left: Office Details */}
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Trust Secretariat</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-emerald" style={{ width: '46px', height: '46px' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Registered Head Office</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                      Plot 42/B, Chandrasekharpur, Near Infocity,<br />
                      Bhubaneswar, Odisha 751024, India
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-amber" style={{ width: '46px', height: '46px' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Email Inquiries</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                      contact@sect-trust.org<br />
                      donations@sect-trust.org
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-teal" style={{ width: '46px', height: '46px' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Helpline & Phone</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                      +91 (0674) 274-8890<br />
                      +91 94370 12345 (Donor Assistance)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="stat-icon-wrap stat-icon-slate" style={{ width: '46px', height: '46px' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Secretariat Hours</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)' }}>
                      Monday – Saturday: 9:30 AM – 5:30 PM<br />
                      Closed on National Holidays
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="card card-padded">
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
                    Thank you for reaching out to Saraswati Educational & Charitable Trust. Our team will review your inquiry and respond promptly.
                  </p>
                  <Button variant="primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Send Us a Message</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.75rem' }}>
                    Whether you are an individual patron, volunteer, or CSR partner, fill in the details below.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <Input
                      label="Your Name"
                      placeholder="e.g. Ananya Mohapatra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="ananya@example.com"
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
                      placeholder="e.g. Solar project request / Volunteering"
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
                    Submit Inquiry
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
