import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--color-border)] mt-32">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-fg-muted)]">
          &copy; {new Date().getFullYear()} Chheang Mengheak
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          Back to top
          <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
}
