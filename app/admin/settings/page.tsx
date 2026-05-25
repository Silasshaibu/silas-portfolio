'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';

const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm";

const fields = [
  { key: 'email', label: 'Contact Email', placeholder: 'silasshaibu30bg@gmail.com' },
  { key: 'whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/...' },
  { key: 'fiverr', label: 'Fiverr URL', placeholder: 'https://fiverr.com/...' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
  { key: 'artstation', label: 'ArtStation URL', placeholder: 'https://artstation.com/...' },
  { key: 'tagline', label: 'Hero Tagline', placeholder: 'Bringing Engineering & Products to Life in 3D' },
  { key: 'subtext', label: 'Hero Subtext', placeholder: 'I design cinematic 3D animations...' },
];

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => reset(data));
  }, [reset]);

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true); setSaved(false);
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="font-grotesk font-bold text-2xl text-white">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Update contact links and site content</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">{label}</label>
            <input {...register(key)} className={input} placeholder={placeholder} />
          </div>
        ))}

        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
