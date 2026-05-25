'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface TestimonialFormData { quote: string; name: string; company: string; platform: string; rating: number; sortOrder: number; }
interface Props { defaultValues?: Partial<TestimonialFormData>; testimonialId?: number; }
const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm resize-none";

export default function TestimonialForm({ defaultValues, testimonialId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<TestimonialFormData>({
    defaultValues: defaultValues ?? { platform: 'Direct', rating: 5, sortOrder: 0 },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setSaving(true); setError('');
    try {
      const res = await fetch(
        testimonialId ? `/api/admin/testimonials/${testimonialId}` : '/api/admin/testimonials',
        { method: testimonialId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, rating: Number(data.rating), sortOrder: Number(data.sortOrder) }) }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      router.push('/admin/testimonials'); router.refresh();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/testimonials" className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--glass-bg)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-grotesk font-bold text-2xl text-white">{testimonialId ? 'Edit Testimonial' : 'New Testimonial'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Quote *</label>
          <textarea {...register('quote', { required: 'Required' })} rows={4} className={input} placeholder="What the client said..." />
          {errors.quote && <p className="text-xs text-red-400 mt-1">{errors.quote.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Name *</label>
            <input {...register('name', { required: 'Required' })} className={input} placeholder="Thomas K." />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Company *</label>
            <input {...register('company', { required: 'Required' })} className={input} placeholder="Manufacturing Client, Germany" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Platform</label>
            <select {...register('platform')} className={input}>
              <option value="Fiverr">Fiverr</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Direct">Direct</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Rating</label>
            <select {...register('rating')} className={input}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Sort Order</label>
            <input type="number" {...register('sortOrder')} className={input} placeholder="0" />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60">
          <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Testimonial'}
        </button>
      </form>
    </div>
  );
}
