import { type ReactNode } from 'react';

interface SectionHeaderProps {
  label: string;
  title: string;
  children?: ReactNode;
}

export function SectionHeader({ label, title, children }: SectionHeaderProps) {
  return (
    <div className="mb-12 sm:mb-16">
      <span className="text-2xs font-medium uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        {label}
      </span>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-fg)] mt-3 leading-tight">
        {title}
      </h2>
      {children && (
        <p className="text-sm text-[var(--color-fg-muted)] mt-3 max-w-lg">
          {children}
        </p>
      )}
    </div>
  );
}
