import { useEffect, useState } from 'react';
import { ExternalLink, Code2, ArrowUpRight } from 'lucide-react';
import { HeroSection } from '../components/public/HeroSection';
import { InfiniteMarquee } from '../components/public/InfiniteMarquee';
import { SectionHeader } from '../components/public/SectionHeader';
import { Card, Badge } from '../components/ui';
import { apiClient } from '../api/client';
import type { Profile, Project, Experience, Skill, ApiResponse } from '../types';

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiResponse<Profile>>('/api/profile/public').then((r) => setProfile(r.data.data)),
      apiClient.get<ApiResponse<Project[]>>('/api/projects/public').then((r) => setProjects(r.data.data)),
      apiClient.get<ApiResponse<Experience[]>>('/api/experience/public').then((r) => setExperience(r.data.data)),
      apiClient.get<ApiResponse<Skill[]>>('/api/skills/public').then((r) => setSkills(r.data.data)),
    ]).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection profile={profile} />

      <div className="relative">
        {/* Subtle floating gradient decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-[var(--color-accent)] opacity-[0.02] dark:opacity-[0.03] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-[var(--color-accent)] opacity-[0.02] dark:opacity-[0.03] blur-3xl" />
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 relative">
            <SectionHeader label="Tools" title="Skills & Technologies" />
            <InfiniteMarquee skills={skills} />
          </section>
        )}

        {/* Projects */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-16 sm:py-24 relative">
          <SectionHeader label="Work" title="Selected projects">
            A curated selection of things I've built.
          </SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <Card key={p.id} hover className="overflow-hidden group">
                {p.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={import.meta.env.VITE_BASE_URL+p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                      {p.title}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </h3>
                    <p className="text-sm text-[var(--color-fg-muted)] mt-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <div className="flex gap-4 pt-2">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Live Site
                    </a>
                  )}
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
                    >
                      <Code2 className="w-3 h-3" /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="max-w-6xl mx-auto px-6 py-16 sm:py-24 relative">
          <SectionHeader label="Background" title="Experience">
            My professional journey so far.
          </SectionHeader>
          <div className="space-y-8">
            {experience.map((e) => (
              <div key={e.id} className="relative pl-8 border-l border-[var(--color-border)]">
                <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-[var(--color-accent)] -translate-x-1/2" />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-fg)]">
                      {e.role}
                    </span>
                    <span className="text-xs text-[var(--color-fg-muted)]">
                      at {e.company}
                    </span>
                    {e.current && (
                      <span className="text-2xs border border-[var(--color-accent)] text-[var(--color-accent)] px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    {e.startDate} &mdash; {e.current ? 'Present' : e.endDate}
                  </p>
                  <p className="text-sm text-[var(--color-fg)] leading-relaxed">
                    {e.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <SectionHeader label="Connect" title="Get in touch">
            {profile?.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
              >
                {profile.contactEmail} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </SectionHeader>
        </section>
      </div>
    </>
  );
}
