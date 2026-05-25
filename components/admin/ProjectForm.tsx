'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ProjectFormData {
  slug: string;
  title: string;
  category: string;
  client: string;
  tools: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
  sortOrder: number;
}

interface Props {
  defaultValues?: Partial<ProjectFormData>;
  projectId?: number;
}

export default function ProjectForm({ defaultValues, projectId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: defaultValues ?? { category: 'industrial', featured: false, sortOrder: 0 },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    setError('');
    const payload = {
      ...data,
      tools: data.tools.split(',').map((t) => t.trim()).filter(Boolean),
      sortOrder: Number(data.sortOrder),
    };
    try {
      const res = await fetch(
        projectId ? `/api/admin/projects/${projectId}` : '/api/admin/projects',
        {
          method: projectId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      router.push('/admin/projects');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--glass-bg)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-grotesk font-bold text-2xl text-white">
          {projectId ? 'Edit Project' : 'New Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Title *" error={errors.title?.message}>
            <input {...register('title', { required: 'Required' })} className={input} placeholder="Conveyor Belt System Animation" />
          </Field>
          <Field label="Slug *" error={errors.slug?.message}>
            <input {...register('slug', { required: 'Required' })} className={input} placeholder="conveyor-belt-system-animation" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Category *">
            <select {...register('category')} className={input}>
              <option value="industrial">Industrial & Engineering</option>
              <option value="product">Product Visualization</option>
              <option value="stylized">Stylized / Creative</option>
              <option value="medical">Medical & Dental</option>
            </select>
          </Field>
          <Field label="Client *" error={errors.client?.message}>
            <input {...register('client', { required: 'Required' })} className={input} placeholder="Manufacturing Client, Germany" />
          </Field>
        </div>

        <Field label="Tools (comma separated)" error={errors.tools?.message}>
          <input {...register('tools')} className={input} placeholder="Blender, After Effects, DaVinci Resolve" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Thumbnail URL">
            <input {...register('thumbnail')} className={input} placeholder="https://..." />
          </Field>
          <Field label="Video URL (Vimeo/YouTube)">
            <input {...register('videoUrl')} className={input} placeholder="https://vimeo.com/..." />
          </Field>
        </div>

        <Field label="Description *" error={errors.description?.message}>
          <textarea {...register('description', { required: 'Required' })} rows={3} className={input} placeholder="Short description of the project..." />
        </Field>

        <Field label="The Challenge">
          <textarea {...register('challenge')} rows={3} className={input} placeholder="What problem did the client have?" />
        </Field>

        <Field label="The Solution">
          <textarea {...register('solution')} rows={3} className={input} placeholder="How did you solve it?" />
        </Field>

        <Field label="The Result">
          <textarea {...register('result')} rows={3} className={input} placeholder="What was the outcome?" />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Sort Order">
            <input type="number" {...register('sortOrder')} className={input} placeholder="0" />
          </Field>
          <Field label="Featured">
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded accent-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Show as featured project</span>
            </label>
          </Field>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm resize-none";
