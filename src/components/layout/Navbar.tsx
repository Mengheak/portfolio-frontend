import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden sm:flex fixed right-0  top-0 border-l border-[var(--color-accent)] h-full z-50 flex-col items-center justify-center gap-8 px-5">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-2xs font-medium uppercase tracking-[0.15em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors [writing-mode:vertical-rl]"
          >
            {l.label}
          </a>
        ))}
        <ThemeToggle />
        {isAuthenticated && (
          <Link
            to="/admin"
            className="text-2xs font-medium uppercase tracking-[0.15em] text-[var(--color-accent)] hover:underline [writing-mode:vertical-rl]"
          >
            Admin
          </Link>
        )}
        {/* Accent line */}
        <div className="h-12 w-px bg-[var(--color-border)]" />
      </nav>

      {/* Mobile: bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="flex items-center justify-around h-14 px-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-2xs font-medium uppercase tracking-[0.1em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          {isAuthenticated && (
            <Link
              to="/admin"
              className="text-2xs font-medium uppercase tracking-[0.1em] text-[var(--color-accent)]"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
