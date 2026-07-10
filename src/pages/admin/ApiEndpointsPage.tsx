import { useEffect, useState } from 'react';
import { Code2, Shield, Unlock, ChevronDown, ChevronUp, FileJson, Terminal, Import } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Card } from '../../components/ui';
import type { RouteDoc, ApiResponse } from '../../types';

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    POST: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    PUT: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    DELETE: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-2xs font-mono font-bold border ${colors[method] || ''}`}>
      {method}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="text-xs text-[var(--color-fg-muted)] bg-[var(--color-bg)] p-3 overflow-x-auto border border-[var(--color-border)] font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

export function ApiEndpointsPage() {
  const [routes, setRoutes] = useState<RouteDoc[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    apiClient.get<ApiResponse<RouteDoc[]>>('/api/routes')
      .then((r) => setRoutes(r.data.data))
      .catch(() => {});
  }, []);

  const toggle = (i: number) => {
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const group = (method: string) => {
    const order = ['GET', 'POST', 'PUT', 'DELETE'];
    return order.indexOf(method);
  };

  const sorted = [...routes].sort((a, b) => {
    const catA = a.path.split('/')[2] || '';
    const catB = b.path.split('/')[2] || '';
    if (catA !== catB) return catA.localeCompare(catB);
    return group(a.method) - group(b.method);
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-fg)]">API Endpoints</h2>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          All available API routes. Use these endpoints to build the same portfolio functionality.
        </p>
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-[var(--color-fg-muted)]">Loading endpoints...</p>
      )}


      <div className='w-full bg-white/10 px-4 py-3 border border-[var(--color-border)]'>
        Base Url: <span className='text-[var(--color-accent)]'>{import.meta.env.VITE_BASE_URL}</span>
      </div>

      <div className="space-y-1">
        {sorted.map((route, i) => (
          <div key={i} className="border border-[var(--color-border)]">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-card-hover)] transition-colors"
            >
              <MethodBadge method={route.method} />
              <code className="flex-1 text-xs font-mono text-[var(--color-fg)]">{route.path}</code>
              {route.auth ? (
                <Shield className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
              ) : (
                <Unlock className="w-3 h-3 text-[var(--color-fg-muted)] shrink-0" />
              )}
              <span className="text-2xs text-[var(--color-fg-muted)] shrink-0">
                {route.auth ? route.roles.join(', ') : 'public'}
              </span>
              {expanded.has(i) ? (
                <ChevronUp className="w-3.5 h-3.5 text-[var(--color-fg-muted)] shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-fg-muted)] shrink-0" />
              )}
            </button>

            {expanded.has(i) && (
              <div className="px-4 pb-4 space-y-4 border-t border-[var(--color-border)] pt-3">
                <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                  {route.description}
                </p>

                {route.requestBody && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileJson className="w-3 h-3 text-[var(--color-accent)]" />
                      <span className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
                        Request Body
                      </span>
                      <span className="text-2xs text-[var(--color-fg-muted)]">(JSON)</span>
                    </div>
                    <CodeBlock code={route.requestBody} />
                  </div>
                )}

                {route.responseExample && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Terminal className="w-3 h-3 text-[var(--color-accent)]" />
                      <span className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
                        Response Example
                      </span>
                    </div>
                    <CodeBlock code={route.responseExample} />
                  </div>
                )}

                <div className="pt-1">
                  <p className="text-2xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)] mb-1">cURL Example</p>
                  <CodeBlock code={buildCurl(route)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Usage section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="text-sm font-medium text-[var(--color-fg)]">How to Build the Same Portfolio</h3>
        </div>
        <div className="space-y-3 text-xs text-[var(--color-fg-muted)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-fg)]">Authentication:</strong> First, call <code className="text-[var(--color-accent)]">POST /api/auth/login</code> with email and password. The response includes an <code className="text-[var(--color-accent)]">accessToken</code> (valid 15 min) and sets an httpOnly refresh cookie. Include the access token as <code className="text-[var(--color-accent)]">Authorization: Bearer &lt;token&gt;</code> for all authenticated requests.
          </p>
          <p>
            <strong className="text-[var(--color-fg)]">Public vs Admin:</strong> Routes marked as public can be called without authentication — these serve the homepage. Authenticated routes require a valid JWT. Some admin routes additionally check your <code className="text-[var(--color-accent)]">role</code> (admin vs superadmin).
          </p>
          <p>
            <strong className="text-[var(--color-fg)]">Typical Flow:</strong> Fetch profile, projects, and experience from public endpoints to render your portfolio. Use authenticated endpoints in an admin panel to manage content. Upload images/files via the upload endpoints, then use the returned URL in your profile/project data.
          </p>
          <p>
            <strong className="text-[var(--color-fg)]">Base URL:</strong> All endpoints are prefixed with <code className="text-[var(--color-accent)]">http://localhost:5000</code> in development. The frontend proxy handles this automatically.
          </p>
        </div>
      </Card>
    </div>
  );
}

function buildCurl(route: RouteDoc): string {
  const method = route.method;
  const url = `http://localhost:5000${route.path}`;
  let curl = `curl -X ${method} '${url}'`;

  if (route.auth) {
    curl += ` \\\n  -H 'Authorization: Bearer <access_token>'`;
  }
  curl += ` \\\n  -H 'Content-Type: application/json'`;

  if (route.requestBody && route.requestBody !== 'FormData with "file" field (image/*)' && route.requestBody !== 'FormData with "file" field (application/pdf)') {
    curl += ` \\\n  -d '${route.requestBody}'`;
  }

  if (route.method === 'POST' && route.path.includes('/upload')) {
    curl = `curl -X POST '${url}' \\\n  -H 'Authorization: Bearer <access_token>' \\\n  -F 'file=@/path/to/your/file'`;
  }

  return curl;
}
