import { useEffect, useState, useRef, type FormEvent } from 'react';
import { Upload, Trash2, Image } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Button, Input, Card } from '../../components/ui';
import { getImageUrl } from '../../utils/image';
import type { Skill, ApiResponse } from '../../types';

interface SkillFormData {
  name: string;
  imageUrl: string;
  order: number;
}

const emptyForm: SkillFormData = {
  name: '',
  imageUrl: '',
  order: 0,
};

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<(SkillFormData & { id?: string }) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const res = await apiClient.get<ApiResponse<Skill[]>>('/api/skills');
      setSkills(res.data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(skill: Skill) {
    setEditing({
      id: skill.id,
      name: skill.name,
      imageUrl: skill.imageUrl,
      order: skill.order,
    });
  }

  function handleCreate() {
    setEditing({ ...emptyForm });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return;
    apiClient.delete(`/api/skills/${id}`).then(() => loadSkills());
  }

  function update(field: string, value: unknown) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiClient.post<{ success: boolean; data: { url: string } }>(
        '/api/upload/skill-image',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (editing) setEditing({ ...editing, imageUrl: res.data.data.url });
    } catch {
      // ignore
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      if (editing.id) {
        await apiClient.put(`/api/skills/${editing.id}`, editing);
      } else {
        await apiClient.post('/api/skills', editing);
      }
      setEditing(null);
      await loadSkills();
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
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">Skills</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">Manage your skill icons displayed on the homepage.</p>
        </div>
        <Button onClick={handleCreate}>New Skill</Button>
      </div>

      <div className="space-y-3">
        {skills.length === 0 && <p className="text-sm text-[var(--color-fg-muted)]">No skills yet.</p>}
        {skills.map((s) => (
          <Card key={s.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {s.imageUrl ? (
                <img src={import.meta.env.VITE_BASE_URL + s.imageUrl} alt={s.name} className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg-muted)]">
                  <Image className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-[var(--color-fg)]">{s.name}</span>
                <p className="text-xs text-[var(--color-fg-muted)]">Order: {s.order}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(s)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <h3 className="text-base font-semibold text-[var(--color-fg)] mb-6">
              {editing.id ? 'Edit Skill' : 'New Skill'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={editing.name} onChange={(e) => update('name', e.target.value)} required />
              <Input label="Order" type="number" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />

              {/* Skill icon upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Skill Icon</label>
                <div className="flex items-center gap-3">
                  {editing.imageUrl ? (
                    <div className="relative group">
                      <img src={getImageUrl(editing.imageUrl)} alt="Icon" className="w-12 h-12 object-contain border border-[var(--color-border)]" />
                      <button type="button" onClick={() => update('imageUrl', '')} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg-muted)]">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                  <Button type="button" variant="secondary" size="sm" isLoading={uploadingImage} onClick={() => imageInputRef.current?.click()}>
                    <Upload className="w-3 h-3" /> Upload
                  </Button>
                </div>
              </div>

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
