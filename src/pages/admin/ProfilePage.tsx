import { useEffect, useState, type FormEvent, useRef } from 'react';
import { Upload, Trash2, FileText, Image } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Button, Input, Textarea, Card } from '../../components/ui';
import type { Profile, ApiResponse } from '../../types';

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'avatar' | 'resume' | null>(null);

  useEffect(() => {
    apiClient
      .get<ApiResponse<Profile>>('/api/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setMessage('');
    try {
      await apiClient.put('/api/profile', profile);
      setMessage('Profile saved successfully');
    } catch {
      setMessage('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (field: 'avatarUrl' | 'resumeUrl', file: File) => {
    setUploading(field === 'avatarUrl' ? 'avatar' : 'resume');
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiClient.post<{ success: boolean; data: { url: string } }>(
        `/api/upload/${field === 'avatarUrl' ? 'avatar' : 'resume'}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      update(field, res.data.data.url);
      setMessage(`${field === 'avatarUrl' ? 'Avatar' : 'Resume'} uploaded`);
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const update = (field: keyof Profile, value: string | object) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateSocial = (field: string, value: string) => {
    setProfile((prev) =>
      prev
        ? { ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }
        : prev
    );
  };

  const clearField = (field: keyof Profile) => update(field, '');

  if (isLoading) return <div className="text-sm text-[var(--color-fg-muted)]">Loading...</div>;
  if (!profile) return <div className="text-sm text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-fg)]">Profile</h2>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          Edit your public profile information.
        </p>
      </div>

      {message && (
        <div className="border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
          <p className="text-xs text-[var(--color-accent)]">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <Input
            label="Title"
            value={profile.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </div>
        <Textarea
          label="Bio"
          value={profile.bio}
          onChange={(e) => update('bio', e.target.value)}
          rows={8}
        />

        {/* Avatar upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            Avatar Image
          </label>
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <div className="relative group">
                <img
                  src={import.meta.env.VITE_BASE_URL+profile.avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 object-cover border border-[var(--color-border)]"
                />
                <button
                  type="button"
                  onClick={() => clearField('avatarUrl')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg-muted)]">
                <Image className="w-6 h-6" />
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('avatarUrl', file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={uploading === 'avatar'}
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload className="w-3 h-3" />
              Upload
            </Button>
          </div>
        </div>

        {/* Resume upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            Resume File
          </label>
          <div className="flex items-center gap-3">
            {profile.resumeUrl ? (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-accent)]" />
                <a
                  href={import.meta.env.VITE_BASE_URL+profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-accent)] hover:underline"
                >
                  View resume
                </a>
                <button
                  type="button"
                  onClick={() => clearField('resumeUrl')}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-[var(--color-fg-muted)]">No file uploaded</span>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('resumeUrl', file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={uploading === 'resume'}
              onClick={() => resumeInputRef.current?.click()}
            >
              <Upload className="w-3 h-3" />
              Upload
            </Button>
          </div>
        </div>

        <Input
          label="Contact Email"
          type="email"
          value={profile.contactEmail}
          onChange={(e) => update('contactEmail', e.target.value)}
        />

        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
            Social Links
          </h3>
          <Input
            label="GitHub"
            value={profile.socialLinks.github}
            onChange={(e) => updateSocial('github', e.target.value)}
          />
          <Input
            label="LinkedIn"
            value={profile.socialLinks.linkedin}
            onChange={(e) => updateSocial('linkedin', e.target.value)}
          />
          <Input
            label="Facebook"
            value={profile.socialLinks.facebook}
            onChange={(e) => updateSocial('facebook', e.target.value)}
          />
          <Input
            label="Telegram"
            value={profile.socialLinks.telegram}
            onChange={(e) => updateSocial('telegram', e.target.value)}
          />
          <Input
            label="Phone"
            value={profile.socialLinks.phone}
            onChange={(e) => updateSocial('phone', e.target.value)}
          />
          <Input
            label="Website"
            value={profile.socialLinks.website}
            onChange={(e) => updateSocial('website', e.target.value)}
          />
        </Card>

        <Button type="submit" isLoading={isSaving}>
          Save Profile
        </Button>
      </form>
    </div>
  );
}
