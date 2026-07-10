import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProfilePage } from './pages/admin/ProfilePage';
import { ProjectsPage } from './pages/admin/ProjectsPage';
import { SkillsPage } from './pages/admin/SkillsPage';
import { ExperiencePage } from './pages/admin/ExperiencePage';
import { UsersPage } from './pages/admin/UsersPage';
import { ApiEndpointsPage } from './pages/admin/ApiEndpointsPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/skills" element={<SkillsPage />} />

          <Route path="/admin/experience" element={<ExperiencePage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/api-endpoints" element={<ApiEndpointsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
