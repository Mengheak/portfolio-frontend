import { useEffect, useState, type FormEvent } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResponse } from '../../types';

interface AdminUser {
  _id: string;
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface CreateForm {
  email: string;
  password: string;
  name: string;
  title: string;
}

const emptyForm: CreateForm = { email: '', password: '', name: '', title: '' };

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await apiClient.get<ApiResponse<AdminUser[]>>('/api/users');
      setUsers(res.data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  function update(field: keyof CreateForm, value: string) {
    setForm({ ...form, [field]: value });
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await apiClient.post('/api/users', form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage('Admin account created successfully');
      await loadUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create user';
      setMessage(msg);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this admin account? All their portfolio data will be removed.')) return;
    try {
      await apiClient.delete(`/api/users/${id}`);
      await loadUsers();
    } catch {
      setMessage('Failed to delete user');
    }
  }

  if (isLoading) return <div className="text-sm text-[var(--color-fg-muted)]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">Admin Accounts</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">Create and manage admin users. Each admin gets their own portfolio.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="w-3.5 h-3.5" /> New Admin
        </Button>
      </div>

      {message && (
        <div className="border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <p className="text-xs text-[var(--color-accent)]">{message}</p>
        </div>
      )}

      {showForm && (
        <Card className="p-6">
          <h3 className="text-sm font-medium text-[var(--color-fg)] mb-4">Create New Admin</h3>
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} />
            <div className="flex gap-3">
              <Button type="submit" isLoading={isSaving}>Create</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {users.length === 0 && <p className="text-sm text-[var(--color-fg-muted)]">No admin accounts yet.</p>}
        {users.map((u) => (
          <Card key={u._id} className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-fg)]">{u.email}</span>
                {u._id === currentUser?.id && (
                  <span className="text-2xs border border-[var(--color-accent)] text-[var(--color-accent)] px-1.5 py-0.5">You</span>
                )}
              </div>
              <p className="text-xs text-[var(--color-fg-muted)]">
                Role: {u.role} &middot; Created: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => handleDelete(u._id)} disabled={u._id === currentUser?.id}>
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
