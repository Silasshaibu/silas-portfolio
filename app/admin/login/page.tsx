'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface LoginForm { email: string; password: string; }

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? 'Login failed');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
          <h1 className="font-grotesk font-bold text-2xl text-white">Admin Panel</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Silas Shaibu Portfolio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Required' })}
              className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm"
              placeholder="admin@email.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                {...register('password', { required: 'Required' })}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-[#141414] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[var(--accent-primary)] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
