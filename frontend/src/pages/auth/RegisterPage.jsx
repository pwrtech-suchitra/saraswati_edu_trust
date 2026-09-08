import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { isValidEmail, isValidIndianPhone, validatePassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !isValidEmail(formData.email)) errs.email = 'Valid email is required';
    if (formData.phone && !isValidIndianPhone(formData.phone)) errs.phone = 'Valid 10-digit Indian phone is required';

    const pwCheck = validatePassword(formData.password);
    if (!pwCheck.valid) errs.password = pwCheck.message;

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please correct the highlighted fields');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      showSuccess(res.message || 'Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card card-padded" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-amber-500) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <UserPlus size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Join SECT Community</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)' }}>
              Create an account to track donations and download annual 80G tax certificates.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              placeholder="e.g. Minati Behera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              icon={Phone}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              icon={Lock}
              required
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              Create Patron Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-slate-600)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
