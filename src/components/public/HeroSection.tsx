import { ExternalLink, Code2, FileText, Phone, Send, Globe } from 'lucide-react';
import type { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  console.log(profile)
  if (!profile) return null;
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] dark:opacity-[0.1]">
        <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-small" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-small)" />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start relative">
        {profile.avatarUrl && (
          <div className="shrink-0">
            <img
              src={import.meta.env.VITE_BASE_URL+profile.avatarUrl}
              alt={profile.name}
              className="size-44 rounded-full sm:size-[300px] object-cover border border-[var(--color-border)]"
            />
          </div>
        )}
        <div className="max-w-3xl">
          <span className="text-2xs font-medium uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            {profile.title}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--color-fg)] mt-6 leading-[1.1] tracking-tight">
            {profile.name}
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-fg-muted)] mt-6 max-w-xl leading-relaxed">
            {profile.bio.split('\n')[0]}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <Code2 className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {profile.socialLinks.facebook && (
              <a
                href={profile.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Facebook
              </a>
            )}
            {profile.socialLinks.telegram && (
              <a
                href={profile.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <Send className="w-3.5 h-3.5" /> Telegram
              </a>
            )}
            {profile.socialLinks.phone && (
              <a
                href={`tel:${profile.socialLinks.phone}`}
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <Phone className="w-3.5 h-3.5" /> {profile.socialLinks.phone}
              </a>
            )}
            {profile.socialLinks.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {profile.resumeUrl && (
              <a
                href={import.meta.env.VITE_BASE_URL+profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors border-b border-[var(--color-border)] hover:border-[var(--color-fg)] pb-0.5"
              >
                <FileText className="w-3.5 h-3.5" /> Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
