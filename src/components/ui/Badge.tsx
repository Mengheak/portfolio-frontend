interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-2xs font-medium border border-[var(--color-border)] text-[var(--color-fg-muted)] ${className}`}
    >
      {children}
    </span>
  );
}
