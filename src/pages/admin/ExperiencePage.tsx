import { useEffect, useState, type FormEvent } from 'react';
import { apiClient } from '../../api/client';
import { Button, Input, Textarea, Card } from '../../components/ui';
import type { Experience, ApiResponse } from '../../types';

interface ExperienceFormData {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  order: number;
}

const emptyForm: ExperienceFormData = {
  company: '',
  role: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  order: 0,
};

export function ExperiencePage() {
  const [entries, setEntries] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<(ExperienceFormData & { id?: string }) | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const res = await apiClient.get<ApiResponse<Experience[]>>('/api/experience');
      setEntries(res.data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(entry: Experience) {
    setEditing({
      id: entry.id,
      company: entry.company,
      role: entry.role,
      description: entry.description,
      startDate: entry.startDate,
      endDate: entry.endDate,
      current: entry.current,
      order: entry.order,
    });
  }

  function handleCreate() {
    setEditing({ ...emptyForm });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return;
    apiClient.delete(`/api/experience/${id}`).then(() => loadEntries());
  }

  function update(field: string, value: unknown) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      if (editing.id) {
        await apiClient.put(`/api/experience/${editing.id}`, editing);
      } else {
        await apiClient.post('/api/experience', editing);
      }
      setEditing(null);
      await loadEntries();
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="text-sm text-[var(--color-fg-muted)]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">Experience</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">Manage your work experience timeline.</p>
        </div>
        <Button onClick={handleCreate}>New Entry</Button>
      </div>

      <div className="space-y-3">
        {entries.length === 0 && <p className="text-sm text-[var(--color-fg-muted)]">No entries yet.</p>}
        {entries.map((e) => (
          <Card key={e.id} className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-fg)]">{e.role}</span>
                <span className="text-xs text-[var(--color-fg-muted)]">at {e.company}</span>
                {e.current && <span className="text-2xs border border-[var(--color-accent)] text-[var(--color-accent)] px-1.5 py-0.5">Current</span>}
              </div>
              <p className="text-xs text-[var(--color-fg-muted)]">{e.startDate} &mdash; {e.current ? 'Present' : e.endDate}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(e)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <h3 className="text-base font-semibold text-[var(--color-fg)] mb-6">
              {editing.id ? 'Edit Experience' : 'New Experience'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Company" value={editing.company} onChange={(e) => update('company', e.target.value)} required />
                <Input label="Role" value={editing.role} onChange={(e) => update('role', e.target.value)} required />
              </div>
              <Textarea label="Description" value={editing.description} onChange={(e) => update('description', e.target.value)} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Start Date" type="month" value={editing.startDate} onChange={(e) => update('startDate', e.target.value)} required />
                <Input label="End Date" type="month" value={editing.endDate} onChange={(e) => update('endDate', e.target.value)} disabled={editing.current} />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
                <input type="checkbox" checked={editing.current} onChange={(e) => update('current', e.target.checked)} className="accent-[var(--color-accent)]" />
                Currently working here
              </label>
              <Input label="Order" type="number" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={isSaving}>Save</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
