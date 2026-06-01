import Link from 'next/link';
import { FolderOpen, Wrench, Quote, FileText, ArrowRight } from 'lucide-react';

const cards = [
  { label: 'Projects', desc: 'Add, edit or remove portfolio projects', href: '/admin/projects', icon: FolderOpen, color: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.2)' },
  { label: 'Services', desc: 'Manage services with draft/live toggle', href: '/admin/services', icon: Wrench, color: 'rgba(123,47,247,0.1)', border: 'rgba(123,47,247,0.2)' },
  { label: 'Testimonials', desc: 'Add and manage client reviews', href: '/admin/testimonials', icon: Quote, color: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  { label: 'Site Content', desc: 'Edit Hero, ShowReel, About, and Contact sections', href: '/admin/settings', icon: FileText, color: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-grotesk font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {cards.map(({ label, desc, href, icon: Icon, color, border }) => (
          <Link
            key={href}
            href={href}
            className="glass-card rounded-xl p-5 hover:border-[rgba(0,212,255,0.15)] hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color, border: `1px solid ${border}` }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </div>
            <h3 className="font-grotesk font-semibold text-white text-sm mb-1">{label}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
