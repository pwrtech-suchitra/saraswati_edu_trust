import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ActivitiesPage from './pages/public/ActivitiesPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import NewsEventsPage from './pages/public/NewsEventsPage';
import GalleryPage from './pages/public/GalleryPage';
import DocumentsPage from './pages/public/DocumentsPage';
import ContactPage from './pages/public/ContactPage';
import DonatePage from './pages/public/DonatePage';
import PaymentSuccessPage from './pages/public/PaymentSuccessPage';
import PaymentFailurePage from './pages/public/PaymentFailurePage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminDonationsPage from './pages/admin/AdminDonationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Layout and Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/news-events" element={<NewsEventsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failure" element={<PaymentFailurePage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="donations" element={<AdminDonationsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
}
