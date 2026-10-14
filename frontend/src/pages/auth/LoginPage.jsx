import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { isValidEmail } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim() || !isValidEmail(email)) errs.email = 'Valid email is required';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      showSuccess(`Welcome back, ${res.data.user.name}!`);
      if (from) {
        navigate(from, { replace: true });
      } else if (res.data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      showError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', minHeight: '75vh' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card card-padded" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-teal-600) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Shield size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Sign In to SECT</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)' }}>
              Access your donor receipts, certificates, or management panel.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              required
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--color-slate-200)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-400)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Demo Fill
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@sect.org', 'admin123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('mrinmayee@example.com', 'donor123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                Donor Demo
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-slate-600)' }}>
            New patron or supporter?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
              Register account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
