import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Shield, User, LogOut, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Activities', path: '/activities' },
    { label: 'Projects', path: '/projects' },
    { label: 'News & Events', path: '/news-events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Documents', path: '/documents' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-slate-200)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo & Name */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <img src="/logo.png" alt="SECT Logo" style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", boxShadow: "var(--shadow-sm)", border: "2px solid white" }} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-primary-900)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              SECT
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', fontWeight: 600, letterSpacing: '0.02em' }}>
              Charitable Trust
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.4rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary-600)' : 'var(--color-slate-600)',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.35rem 0',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/donate">
            <Button variant="amber" size="sm" icon={Heart}>
              Donate
            </Button>
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" icon={Shield}>
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" size="sm" icon={User}>
                  Profile
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Log Out"
                style={{ padding: '0.4rem 0.5rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="desktop-nav-auth" style={{ display: 'none' }}>
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-slate-700)',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.4rem',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-slate-200)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 850,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--color-slate-800)',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--color-slate-100)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" style={{ width: '100%' }}>
                Login
              </Button>
            </Link>
          ) : (
            <Button variant="danger" size="sm" onClick={handleLogout} icon={LogOut}>
              Sign Out
            </Button>
          )}
        </div>
      )}

      {/* Responsive media style */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-nav-auth { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
