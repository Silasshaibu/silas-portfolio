'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm";

const coreFields = [
  { key: 'email', label: 'Contact Email', placeholder: 'silasshaibu30bg@gmail.com' },
  { key: 'tagline', label: 'Hero Tagline', placeholder: 'Bringing Engineering & Products to Life in 3D' },
  { key: 'subtext', label: 'Hero Subtext', placeholder: 'I design cinematic 3D animations...' },
];

type ContactLink = { label: string; value: string; href: string };

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [links, setLinks] = useState<ContactLink[]>([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      reset(data);
      try { setLinks(JSON.parse(data.contact_links ?? '[]')); } catch { setLinks([]); }
    });
  }, [reset]);

  const addLink = () => setLinks(l => [...l, { label: '', value: '', href: '' }]);
  const removeLink = (i: number) => setLinks(l => l.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof ContactLink, val: string) =>
    setLinks(l => l.map((link, idx) => idx === i ? { ...link, [field]: val } : link));

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true); setSaved(false);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, contact_links: JSON.stringify(links) }),
    });
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
        {coreFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">{label}</label>
            <input {...register(key)} className={input} placeholder={placeholder} />
          </div>
        ))}

        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white font-grotesk">Contact Links</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Shown in the Contact section and Footer</p>
            </div>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[rgba(0,212,255,0.15)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Link
            </button>
          </div>

          {links.length === 0 && (
            <p className="text-xs text-[var(--text-muted)] text-center py-6 border border-dashed border-[var(--glass-border)] rounded-lg">
              No links yet — click &quot;Add Link&quot; to add one.
            </p>
          )}

          <div className="space-y-3">
            {links.map((link, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#0e0e0e] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    value={link.label}
                    onChange={e => updateLink(i, 'label', e.target.value)}
                    className={input}
                    placeholder="Label (e.g. LinkedIn)"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="pl-6 space-y-2">
                  <input
                    value={link.value}
                    onChange={e => updateLink(i, 'value', e.target.value)}
                    className={input}
                    placeholder="Display text (e.g. linkedin.com/in/yourname)"
                  />
                  <input
                    value={link.href}
                    onChange={e => updateLink(i, 'href', e.target.value)}
                    className={input}
                    placeholder="URL (e.g. https://linkedin.com/in/yourname)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
