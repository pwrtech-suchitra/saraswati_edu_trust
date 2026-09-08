import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  HeartHandshake,
  Users,
  MessageSquareText,
  FileBarChart,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Donation Ledger', path: '/admin/donations', icon: HeartHandshake },
    { label: 'User Roles', path: '/admin/users', icon: Users },
    { label: 'Inquiries Inbox', path: '/admin/inquiries', icon: MessageSquareText },
    { label: 'Reports & 80G', path: '/admin/reports', icon: FileBarChart },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar Desktop & Mobile */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-slate-900)',
          color: 'var(--color-slate-300)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.25s ease-in-out',
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--color-primary-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>SECT Admin</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-400)' }}>Operations Portal</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-slate-400)',
              cursor: 'pointer',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-white)' : 'var(--color-slate-400)',
                  backgroundColor: isActive ? 'var(--color-primary-700)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* View public website link */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--color-slate-300)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
              marginBottom: '0.75rem',
            }}
          >
            <span>View Public Website</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-menu-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-slate-700)',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-500)' }}>
              Saraswati Trust Management Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                Role: {user?.role || 'ADMIN'}
              </div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-100)',
                color: 'var(--color-primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .admin-menu-toggle {
            display: block !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
