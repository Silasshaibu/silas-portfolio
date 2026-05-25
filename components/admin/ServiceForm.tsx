'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ServiceFormData { icon: string; title: string; description: string; sortOrder: number; }

interface Props { defaultValues?: Partial<ServiceFormData>; serviceId?: number; }

const icons = ['Box', 'Settings', 'GitBranch', 'Heart', 'Camera', 'Play', 'Wrench', 'Star', 'Zap', 'Globe'];
const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm resize-none";

export default function ServiceForm({ defaultValues, serviceId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: defaultValues ?? { icon: 'Box', sortOrder: 0 },
  });

  const onSubmit = async (data: ServiceFormData) => {
    setSaving(true); setError('');
    try {
      const res = await fetch(
        serviceId ? `/api/admin/services/${serviceId}` : '/api/admin/services',
        { method: serviceId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, sortOrder: Number(data.sortOrder) }) }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      router.push('/admin/services'); router.refresh();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/services" className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--glass-bg)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-grotesk font-bold text-2xl text-white">{serviceId ? 'Edit Service' : 'New Service'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Title *</label>
          <input {...register('title', { required: 'Required' })} className={input} placeholder="3D Product Animation" />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Icon</label>
          <select {...register('icon')} className={input}>
            {icons.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Description *</label>
          <textarea {...register('description', { required: 'Required' })} rows={4} className={input} placeholder="What this service includes..." />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Sort Order</label>
          <input type="number" {...register('sortOrder')} className={input} placeholder="0" />
        </div>
        {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60">
          <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Service'}
        </button>
      </form>
    </div>
  );
}
