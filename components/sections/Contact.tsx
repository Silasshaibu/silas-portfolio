'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MessageSquare, ExternalLink, Send, CheckCircle, AlertCircle, type LucideIcon } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { ContactFormData } from '@/types';

const projectTypes = [
  'Industrial Machine Animation',
  'Product Visualization',
  'Engineering Explainer',
  'Medical / Dental Animation',
  'CGI Advertising',
  'Motion Graphics',
  'Other',
];

type ContactLink = { label: string; value: string; href: string };

const iconMap: Record<string, LucideIcon> = {
  Email: Mail,
  WhatsApp: MessageSquare,
};
function getLinkIcon(label: string): LucideIcon {
  return iconMap[label] ?? ExternalLink;
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        try { setContactLinks(JSON.parse(data.contact_links ?? '[]')); } catch { /* keep empty */ }
      })
      .catch(() => { /* keep empty */ });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-padding bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <SectionLabel text="Contact" />
          <h2 className="font-grotesk font-bold text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)] mb-4">
            Let&apos;s Build Something{' '}
            <span className="gradient-text">Remarkable</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Whether you need a machine animated, a product visualized, or a complex process
            explained — I&apos;m ready.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <h3 className="font-grotesk font-semibold text-lg text-[var(--text-primary)] mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 glass-card rounded-xl hover:border-[rgba(0,212,255,0.2)] hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(0,212,255,0.15)] transition-colors">
                    {(() => { const Icon = getLinkIcon(link.label); return <Icon className="w-4 h-4 text-[var(--accent-primary)]" />; })()}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{link.label}</p>
                    <p className="text-sm text-[var(--text-primary)]">{link.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-2" htmlFor="name">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors text-sm"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-2" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors text-sm"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-2" htmlFor="projectType">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  {...register('projectType', { required: 'Please select a project type' })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors text-sm appearance-none"
                >
                  <option value="">Select project type...</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="text-xs text-red-400 mt-1">{errors.projectType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-2" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please write at least 20 characters' } })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors text-sm resize-none"
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                )}
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Message sent! I&apos;ll get back to you within 24 hours.
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Something went wrong. Please email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-lg font-medium text-sm bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
