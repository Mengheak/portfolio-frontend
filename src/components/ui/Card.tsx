import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] ${
        hover
          ? 'hover:bg-[var(--color-card-hover)] transition-colors duration-200'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
