import { useLocation } from 'react-router-dom';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="text-4xl font-semibold text-[var(--color-fg)]">404</h1>
      <p className="text-sm text-[var(--color-fg-muted)] mt-4">
        Page not found: <code className="text-[var(--color-accent)]">{location.pathname}</code>
      </p>
      <a
        href="/"
        className="mt-8 text-xs text-[var(--color-accent)] hover:underline"
      >
        &larr; Back to home
      </a>
    </div>
  );
}
