import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FolderKanban, Briefcase, ArrowLeft, Users, Code2, Layers } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User, end: false },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, end: false },
  { to: '/admin/skills', label: 'Skills', icon: Layers, end: false },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase, end: false },
  { to: '/admin/api-endpoints', label: 'API Endpoints', icon: Code2, end: false },
];

export function AdminSidebar() {
  const { user } = useAuth();
  const isSuperadmin = user?.role === 'superadmin';

  return (
    <aside className="w-56 border-r border-[var(--color-border)] min-h-screen bg-[var(--color-bg-secondary)] shrink-0">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-[var(--color-fg)]">Admin Panel</h2>
        {isSuperadmin && <span className="text-2xs text-[var(--color-accent)] mt-0.5 block">Superadmin</span>}
      </div>
      <nav className="px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-colors ${
                isActive
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-card-hover)]'
              }`
            }
          >
            <link.icon className="w-3.5 h-3.5" />
            {link.label}
          </NavLink>
        ))}
        {isSuperadmin && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-colors ${
                isActive
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-card-hover)]'
              }`
            }
          >
            <Users className="w-3.5 h-3.5" />
            Users
          </NavLink>
        )}
      </nav>
      <div className="px-3 mt-8">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </NavLink>
      </div>
    </aside>
  );
}
