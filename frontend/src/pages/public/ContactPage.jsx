import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { contactApi } from '../../api/contactApi';
import { trustProfileApi } from '../../api/trustProfileApi';
import { DONOR_CONTACT_PHONE } from '../../utils/trustContacts';
import { isValidEmail, isValidIndianPhone } from '../../utils/validators';
import { useNotification } from '../../hooks/useNotification';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ContactPage() {
  const { showSuccess, showError } = useNotification();
  const [trustProfile, setTrustProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);
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
        setProfileError(true);
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
    address: trustProfile?.address,
    landline: trustProfile?.phone_landline,
    mobiles: [...new Set([...(trustProfile?.phone_mobiles || []), DONOR_CONTACT_PHONE])],
    email: trustProfile?.email,
  };
  const socialLinks = [
    trustProfile?.facebook_url && { label: 'Facebook', url: trustProfile.facebook_url },
    trustProfile?.twitter_handle && {
      label: 'X',
      url: `https://x.com/${trustProfile.twitter_handle.replace(/^@/, '')}`
    },
    trustProfile?.linkedin_url && { label: 'LinkedIn', url: trustProfile.linkedin_url }
  ].filter(Boolean);

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
            Questions about our work, partnerships, or volunteering? Connect with our team.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1.75fr)', gap: '3.5rem' }} className="contact-grid">
            {/* Left: Office & Statutory Coordinates */}
            <div>
              {profileError && <p role="alert">Trust contact details are currently unavailable.</p>}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--color-slate-900)' }}>Trust Secretariat</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {details.address && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <MapPin size={22} />
                  <div><h4>Registered Office</h4><p>{details.address}</p></div>
                </div>}
                {details.email && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Mail size={22} />
                  <div><h4>Official Email</h4><a href={`mailto:${details.email}`}>{details.email}</a></div>
                </div>}
                {(details.landline || details.mobiles.length > 0) && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Phone size={22} />
                  <div>
                    <h4>Phone &amp; Mobile Numbers</h4>
                    {details.landline && <p>Landline: <a href={`tel:${details.landline}`}>{details.landline}</a></p>}
                    {details.mobiles.map((phone) => <p key={phone}><a href={`tel:${phone}`}>{phone}</a></p>)}
                  </div>
                </div>}
                {trustProfile?.whatsapp_numbers?.length > 0 && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <MessageCircle size={22} />
                  <div>
                    <h4>WhatsApp</h4>
                    {trustProfile.whatsapp_numbers.map((phone) => {
                      const digits = phone.replace(/\D/g, '');
                      const number = digits.startsWith('91') ? digits : `91${digits}`;
                      return <a key={phone} href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>Chat {phone}<ExternalLink size={12} /></a>;
                    })}
                  </div>
                </div>}
              </div>

              {trustProfile && <div style={{ backgroundColor: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-slate-200)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--color-slate-900)' }}>Official Trust Details</h4>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', lineHeight: '1.6' }}>
                  {trustProfile.trust_name && <div><strong>Trust Legal Name:</strong> {trustProfile.trust_name}</div>}
                  {trustProfile.pan && <div><strong>PAN:</strong> {trustProfile.pan}</div>}
                </div>
              </div>
              }

              {socialLinks.length > 0 && <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--color-slate-800)' }}>Stay Connected on Social Platforms</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {socialLinks.map(({ label, url }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-300)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>}
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
                    Thank you for reaching out{trustProfile?.trust_name ? ` to ${trustProfile.trust_name}` : ''}. Your message has been saved to our database.
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
