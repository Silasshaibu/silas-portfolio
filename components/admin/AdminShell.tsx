'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderOpen, Wrench, Quote, Settings, LogOut, ExternalLink } from 'lucide-react';

const nav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[var(--border-subtle)] flex flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="px-5 py-5 border-b border-[var(--border-subtle)]">
          <p className="font-grotesk font-bold text-sm text-white">SILAS SHAIBU</p>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)] border border-[rgba(0,212,255,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--glass-bg)]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--border-subtle)] space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--glass-bg)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
