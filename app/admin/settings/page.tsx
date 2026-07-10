'use client';
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

const input = "w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm resize-none";
const textarea = input + " resize-y";

type ContactLink = { label: string; value: string; href: string };

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--glass-border)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#0e0e0e] hover:bg-[#141414] transition-colors text-left"
      >
        <span className="font-grotesk font-semibold text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
      </button>
      {open && <div className="px-5 py-5 space-y-4 bg-[#0a0a0a]">{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Hero
  const [heroOverline, setHeroOverline] = useState('');
  const [tagline, setTagline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [heroStats, setHeroStats] = useState<string[]>([]);

  // ShowReel
  const [showreelVimeoId, setShowreelVimeoId] = useState('');
  const [showreelStats, setShowreelStats] = useState<string[]>([]);

  // About
  const [aboutHeadline, setAboutHeadline] = useState('');
  const [aboutBio1, setAboutBio1] = useState('');
  const [aboutBio2, setAboutBio2] = useState('');
  const [aboutBio3, setAboutBio3] = useState('');
  const [aboutSkills, setAboutSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [aboutPdfUrl, setAboutPdfUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  // Contact
  const [email, setEmail] = useState('');
  const [links, setLinks] = useState<ContactLink[]>([]);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setHeroOverline(data.hero_overline ?? '');
        setTagline(data.tagline ?? '');
        setSubtext(data.subtext ?? '');
        try { setHeroStats(JSON.parse(data.hero_stats ?? '[]')); } catch { setHeroStats([]); }
        setShowreelVimeoId(data.showreel_vimeo_id ?? '');
        try { setShowreelStats(JSON.parse(data.showreel_stats ?? '[]')); } catch { setShowreelStats([]); }
        setAboutHeadline(data.about_headline ?? '');
        setAboutBio1(data.about_bio_1 ?? '');
        setAboutBio2(data.about_bio_2 ?? '');
        setAboutBio3(data.about_bio_3 ?? '');
        try { setAboutSkills(JSON.parse(data.about_skills ?? '[]')); } catch { setAboutSkills([]); }
        setAboutPdfUrl(data.about_pdf_url ?? '');
        setProfilePhoto(data.profile_photo ?? '');
        setEmail(data.email ?? '');
        try { setLinks(JSON.parse(data.contact_links ?? '[]')); } catch { setLinks([]); }
      });
  }, []);

  const addLink = () => setLinks(l => [...l, { label: '', value: '', href: '' }]);
  const removeLink = (i: number) => setLinks(l => l.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof ContactLink, val: string) =>
    setLinks(l => l.map((link, idx) => idx === i ? { ...link, [field]: val } : link));

  const updateStat = (list: string[], setList: (v: string[]) => void, i: number, val: string) =>
    setList(list.map((s, idx) => idx === i ? val : s));
  const addStat = (list: string[], setList: (v: string[]) => void) => setList([...list, '']);
  const removeStat = (list: string[], setList: (v: string[]) => void, i: number) =>
    setList(list.filter((_, idx) => idx !== i));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaved(false); setSaveError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_overline: heroOverline,
          tagline,
          subtext,
          hero_stats: JSON.stringify(heroStats.filter(Boolean)),
          showreel_vimeo_id: showreelVimeoId,
          showreel_stats: JSON.stringify(showreelStats.filter(Boolean)),
          about_headline: aboutHeadline,
          about_bio_1: aboutBio1,
          about_bio_2: aboutBio2,
          about_bio_3: aboutBio3,
          about_skills: JSON.stringify(aboutSkills.filter(Boolean)),
          about_pdf_url: aboutPdfUrl,
          profile_photo: profilePhoto,
          email,
          contact_links: JSON.stringify(links),
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-grotesk font-bold text-2xl text-white">Site Content</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Edit every section of your portfolio from here</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Hero */}
        <Section title="Hero Section" defaultOpen>
          <Field label="Overline Text">
            <input value={heroOverline} onChange={e => setHeroOverline(e.target.value)} className={input} placeholder="[ 3D VISUALIZATION · MOTION DESIGN · ENGINEERING ]" />
          </Field>
          <Field label="Headline (H1)">
            <input value={tagline} onChange={e => setTagline(e.target.value)} className={input} placeholder="Bringing Engineering & Products to Life in 3D" />
          </Field>
          <Field label="Subtext">
            <textarea value={subtext} onChange={e => setSubtext(e.target.value)} rows={3} className={textarea} placeholder="I design cinematic 3D animations..." />
          </Field>
          <Field label="Stat Badges">
            <div className="space-y-2">
              {heroStats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={e => updateStat(heroStats, setHeroStats, i, e.target.value)} className={input} placeholder="50+ Projects" />
                  <button type="button" aria-label="Remove badge" title="Remove badge" onClick={() => removeStat(heroStats, setHeroStats, i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStat(heroStats, setHeroStats)} className="text-xs font-mono text-[var(--accent-primary)] hover:underline">+ Add Badge</button>
            </div>
          </Field>
        </Section>

        {/* ShowReel */}
        <Section title="ShowReel Section">
          <Field label="Video URL (Vimeo or YouTube)">
            <input value={showreelVimeoId} onChange={e => setShowreelVimeoId(e.target.value)} className={input} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/123456789" />
            <p className="text-xs text-[var(--text-muted)] mt-1">Paste a full YouTube or Vimeo URL.</p>
          </Field>
          <Field label="Stat Badges">
            <div className="space-y-2">
              {showreelStats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={e => updateStat(showreelStats, setShowreelStats, i, e.target.value)} className={input} placeholder="30+ Industrial Projects" />
                  <button type="button" aria-label="Remove badge" title="Remove badge" onClick={() => removeStat(showreelStats, setShowreelStats, i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStat(showreelStats, setShowreelStats)} className="text-xs font-mono text-[var(--accent-primary)] hover:underline">+ Add Badge</button>
            </div>
          </Field>
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field label="Profile Photo">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-[var(--glass-border)] overflow-hidden flex items-center justify-center bg-[rgba(0,212,255,0.1)] flex-shrink-0">
                {profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="font-grotesk font-bold text-lg text-[var(--accent-primary)]">SS</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  id="profile-upload"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setProfilePhoto(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                <label
                  htmlFor="profile-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] text-xs font-mono cursor-pointer hover:bg-[rgba(0,212,255,0.15)] transition-colors"
                >
                  Upload Photo
                </label>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={() => setProfilePhoto('')}
                    className="block text-xs text-red-400 hover:underline font-mono"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </Field>
          <Field label="Headline">
            <input value={aboutHeadline} onChange={e => setAboutHeadline(e.target.value)} className={input} placeholder="Engineering Thinking. Cinematic Vision." />
          </Field>
          <Field label="Bio Paragraph 1">
            <textarea value={aboutBio1} onChange={e => setAboutBio1(e.target.value)} rows={3} className={textarea} placeholder="First paragraph of your bio..." />
          </Field>
          <Field label="Bio Paragraph 2">
            <textarea value={aboutBio2} onChange={e => setAboutBio2(e.target.value)} rows={3} className={textarea} placeholder="Second paragraph of your bio..." />
          </Field>
          <Field label="Bio Paragraph 3">
            <textarea value={aboutBio3} onChange={e => setAboutBio3(e.target.value)} rows={3} className={textarea} placeholder="Third paragraph of your bio..." />
          </Field>
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Skills / Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {aboutSkills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-xs text-[var(--text-secondary)] font-mono">
                  {skill}
                  <button
                    type="button"
                    onClick={() => setAboutSkills(s => s.filter((_, idx) => idx !== i))}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors leading-none"
                    aria-label={`Remove ${skill}`}
                  >×</button>
                </span>
              ))}
              {aboutSkills.length === 0 && (
                <p className="text-xs text-[var(--text-muted)]">No skills yet — add one below.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); if (newSkill.trim()) { setAboutSkills(s => [...s, newSkill.trim()]); setNewSkill(''); } }
                }}
                className={input}
                placeholder="Type a skill and press Enter..."
              />
              <button
                type="button"
                onClick={() => { if (newSkill.trim()) { setAboutSkills(s => [...s, newSkill.trim()]); setNewSkill(''); } }}
                className="px-4 py-2 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[rgba(0,212,255,0.15)] transition-colors flex-shrink-0"
              >+ Add</button>
            </div>
          </div>
          <Field label="Portfolio PDF URL">
            <input value={aboutPdfUrl} onChange={e => setAboutPdfUrl(e.target.value)} className={input} placeholder="/portfolio.pdf" />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Contact Section">
          <Field label="Contact Email">
            <input value={email} onChange={e => setEmail(e.target.value)} className={input} placeholder="silasshaibu30bg@gmail.com" />
          </Field>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)]">CONTACT LINKS</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Shown in the Contact section and Footer</p>
              </div>
              <button type="button" onClick={addLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[rgba(0,212,255,0.15)] transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            {links.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] text-center py-6 border border-dashed border-[var(--glass-border)] rounded-lg">No links yet — click &quot;Add Link&quot; to add one.</p>
            )}
            <div className="space-y-3">
              {links.map((link, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0e0e0e] border border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} className={input} placeholder="Label (e.g. LinkedIn)" />
                    <button type="button" onClick={() => removeLink(i)} className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Remove link"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="pl-6 space-y-2">
                    <input value={link.value} onChange={e => updateLink(i, 'value', e.target.value)} className={input} placeholder="Display text (e.g. linkedin.com/in/yourname)" />
                    <input value={link.href} onChange={e => updateLink(i, 'href', e.target.value)} className={input} placeholder="URL (e.g. https://linkedin.com/in/yourname)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {saveError && <p className="text-xs text-red-400 font-mono">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}
