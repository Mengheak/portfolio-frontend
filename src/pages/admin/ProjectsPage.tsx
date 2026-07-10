import { useEffect, useState, type FormEvent, useRef } from 'react';
import { Upload, Trash2, Image } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Button, Input, Textarea, Card, Badge } from '../../components/ui';
import { getImageUrl } from '../../utils/image';
import type { Project, ApiResponse } from '../../types';

interface ProjectFormData {
  title: string;
  description: string;
  body: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
}

const emptyForm: ProjectFormData = {
  title: '',
  description: '',
  body: '',
  technologies: [],
  imageUrl: '',
  liveUrl: '',
  repoUrl: '',
  featured: false,
  order: 0,
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectFormData & { id?: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res = await apiClient.get<ApiResponse<Project[]>>('/api/projects');
      setProjects(res.data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(project: Project) {
    setEditing({
      id: project.id,
      title: project.title,
      description: project.description,
      body: project.body,
      technologies: project.technologies,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      repoUrl: project.repoUrl,
      featured: project.featured,
      order: project.order,
    });
  }

  function handleCreate() {
    setEditing({ ...emptyForm });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    apiClient.delete(`/api/projects/${id}`).then(() => loadProjects());
  }

  function addTech() {
    if (!editing || !techInput.trim()) return;
    setEditing({ ...editing, technologies: [...editing.technologies, techInput.trim()] });
    setTechInput('');
  }

  function removeTech(t: string) {
    if (!editing) return;
    setEditing({ ...editing, technologies: editing.technologies.filter((x) => x !== t) });
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiClient.post<{ success: boolean; data: { url: string } }>(
        '/api/upload/project-image',
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
        await apiClient.put(`/api/projects/${editing.id}`, editing);
      } else {
        await apiClient.post('/api/projects', editing);
      }
      setEditing(null);
      await loadProjects();
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  }

  function update(field: string, value: unknown) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (isLoading) return <div className="text-sm text-[var(--color-fg-muted)]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">Projects</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">Manage your project showcase.</p>
        </div>
        <Button onClick={handleCreate}>New Project</Button>
      </div>

      <div className="space-y-3">
        {projects.length === 0 && <p className="text-sm text-[var(--color-fg-muted)]">No projects yet.</p>}
        {projects.map((p) => (
          <Card key={p.id} className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-fg)]">{p.title}</span>
                {p.featured && <span className="text-2xs border border-[var(--color-accent)] text-[var(--color-accent)] px-1.5 py-0.5">Featured</span>}
              </div>
              <p className="text-xs text-[var(--color-fg-muted)] line-clamp-1">{p.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {p.technologies.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <h3 className="text-base font-semibold text-[var(--color-fg)] mb-6">
              {editing.id ? 'Edit Project' : 'New Project'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title" value={editing.title} onChange={(e) => update('title', e.target.value)} required />
              <Textarea label="Description" value={editing.description} onChange={(e) => update('description', e.target.value)} required />
              <Textarea label="Body (Markdown)" value={editing.body} onChange={(e) => update('body', e.target.value)} />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Technologies</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-10 px-3 bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-fg)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    value={techInput} onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Add a tech..." />
                  <Button type="button" variant="secondary" size="sm" onClick={addTech}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {editing.technologies.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-2xs border border-[var(--color-border)] cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => removeTech(t)}>
                      {t} &times;
                    </span>
                  ))}
                </div>
              </div>

              {/* Project image upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Project Image</label>
                <div className="flex items-center gap-3">
                  {editing.imageUrl ? (
                    <div className="relative group">
                      <img src={getImageUrl(editing.imageUrl)} alt="Project" className="w-20 h-14 object-cover border border-[var(--color-border)]" />
                      <button type="button" onClick={() => update('imageUrl', '')} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-14 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg-muted)]">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                  <Button type="button" variant="secondary" size="sm" isLoading={uploadingImage} onClick={() => imageInputRef.current?.click()}>
                    <Upload className="w-3 h-3" /> Upload
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Live URL" value={editing.liveUrl} onChange={(e) => update('liveUrl', e.target.value)} />
                <Input label="Repo URL" value={editing.repoUrl} onChange={(e) => update('repoUrl', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Order" type="number" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
                <input type="checkbox" checked={editing.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-[var(--color-accent)]" />
                Featured project
              </label>

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
