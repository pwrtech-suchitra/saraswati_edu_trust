import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { isValidEmail } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const { login, logout } = useAuth();
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
      if (!['ADMIN', 'SUPERADMIN'].includes(res.data.user.role)) {
        try {
          await logout();
        } catch {
          showError('This account does not have staff access. Please refresh the page before continuing.');
          return;
        }
        showError('This account does not have staff access.');
        return;
      }

      showSuccess(`Welcome back, ${res.data.user.name}!`);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      showError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
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
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Staff Sign In</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)' }}>
              This sign-in is only for authorized SECT staff. The public website and donations do not require an account.
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

        </div>
      </div>
    </div>
  );
}
