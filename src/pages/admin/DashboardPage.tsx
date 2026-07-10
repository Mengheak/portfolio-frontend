import { useEffect, useState } from 'react';
import { FolderKanban, Briefcase, Users, Eye, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '../../api/client';
import { Card } from '../../components/ui';
import type { DashboardStats, ApiResponse } from '../../types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    apiClient.get<ApiResponse<DashboardStats>>('/api/stats/dashboard')
      .then((r) => setStats(r.data.data))
      .catch(() => {});
  }, []);

  if (!stats) return <div className="text-sm text-[var(--color-fg-muted)]">Loading...</div>;

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-fg)]">Dashboard</h2>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">Overview of your portfolio.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 border border-[var(--color-border)] shrink-0">
            <Eye className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Visitors Today</p>
            <p className="text-2xl font-semibold text-[var(--color-fg)] mt-0.5">{stats.todayVisitors}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 border border-[var(--color-border)] shrink-0">
            <Activity className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Total Visitors</p>
            <p className="text-2xl font-semibold text-[var(--color-fg)] mt-0.5">{stats.totalVisitors}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 border border-[var(--color-border)] shrink-0">
            <FolderKanban className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Projects</p>
            <p className="text-2xl font-semibold text-[var(--color-fg)] mt-0.5">{stats.projects}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 border border-[var(--color-border)] shrink-0">
            <Briefcase className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Experience</p>
            <p className="text-2xl font-semibold text-[var(--color-fg)] mt-0.5">{stats.experience}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 border border-[var(--color-border)] shrink-0">
            <Users className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Admin Users</p>
            <p className="text-2xl font-semibold text-[var(--color-fg)] mt-0.5">{stats.adminUsers}</p>
          </div>
        </Card>
      </div>

      {/* Visitor chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-fg)]">Visitor Fluctuation</h3>
            <p className="text-2xs text-[var(--color-fg-muted)] mt-0.5">Last 30 days &middot; {todayDate}</p>
          </div>
          <div className="flex items-center gap-4 text-2xs text-[var(--color-fg-muted)]">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              Visitors
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chart} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--color-fg-muted)' }}
                tickFormatter={(v: string) => {
                  const d = new Date(v + 'T00:00:00');
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--color-fg-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0',
                  fontSize: '12px',
                  color: 'var(--color-fg)',
                }}
                labelFormatter={(v) => {
                  const d = new Date(String(v) + 'T00:00:00');
                  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#visitorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
