import React, { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Guards
import AdminRoute from './components/auth/AdminRoute';

import { Spinner } from './components/common/Loader';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ActivitiesPage = lazy(() => import('./pages/public/ActivitiesPage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const OnlineProgramsPage = lazy(() => import('./pages/public/OnlineProgramsPage'));
const ProjectDetailPage = lazy(() => import('./pages/public/ProjectDetailPage'));
const NewsEventsPage = lazy(() => import('./pages/public/NewsEventsPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const DocumentsPage = lazy(() => import('./pages/public/DocumentsPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const DonatePage = lazy(() => import('./pages/public/DonatePage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminDonationsPage = lazy(() => import('./pages/admin/AdminDonationsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/AdminInquiriesPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));

export default function App() {
  return (
    <Suspense fallback={<Spinner text="Loading page..." />}>
      <Routes>
        <Route
          element={<PublicLayout />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/online-programs" element={<OnlineProgramsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/news-events" element={<NewsEventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/staff-login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
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
    </Suspense>
  );
}
