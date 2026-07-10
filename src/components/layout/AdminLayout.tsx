import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { Button } from '../ui/Button';
import type { Profile, ApiResponse } from '../../types';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiClient
      .get<ApiResponse<Profile>>('/api/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const avatarSrc = profile?.avatarUrl
    ? import.meta.env.VITE_BASE_URL + profile.avatarUrl
    : null;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-[var(--color-bg)] border-r border-[var(--color-border)] transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6 bg-[var(--color-card)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-medium text-[var(--color-fg)]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-[var(--color-fg)]">
                  {profile?.name || user?.email || 'Admin'}
                </p>
                {user?.email && profile?.name && (
                  <p className="text-2xs text-[var(--color-fg-muted)]">{user.email}</p>
                )}
              </div>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-xs font-medium text-[var(--color-fg-muted)]">
                  {(profile?.name || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
