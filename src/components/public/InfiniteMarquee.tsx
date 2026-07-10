import { getImageUrl } from '../../utils/image';
import type { Skill } from '../../types';

interface InfiniteMarqueeProps {
  skills: Skill[];
}

export function InfiniteMarquee({ skills }: InfiniteMarqueeProps) {
  if (skills.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent pointer-events-none" />

      <div className="marquee-track flex gap-16 py-4">
        {/* First set */}
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col items-center gap-2 shrink-0 group"
          >
            <div className="w-14 h-14 flex items-center justify-center">
              {skill.imageUrl ? (
                <img
                  src={getImageUrl(skill.imageUrl)}
                  alt={skill.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-2xs text-[var(--color-fg-muted)]">
                  {skill.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-2xs text-[var(--color-fg-muted)] whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {skills.map((skill) => (
          <div
            key={`dup-${skill.id}`}
            className="flex flex-col items-center gap-2 shrink-0 group"
          >
            <div className="w-14 h-14 flex items-center justify-center">
              {skill.imageUrl ? (
                <img
                  src={getImageUrl(skill.imageUrl)}
                  alt={skill.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-2xs text-[var(--color-fg-muted)]">
                  {skill.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-2xs text-[var(--color-fg-muted)] whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
