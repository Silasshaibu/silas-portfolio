'use client';

import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Column { key: string; label: string; }
interface Row { id: number; [key: string]: unknown; }

interface AdminTableProps {
  title: string;
  newHref: string;
  columns: Column[];
  rows: Row[];
  onDelete: (id: number) => void;
  editHref: (id: number) => string;
}

export default function AdminTable({ title, newHref, columns, rows, onDelete, editHref }: AdminTableProps) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-grotesk font-bold text-2xl text-white">{title}</h1>
        <Link
          href={newHref}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#080808] text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No items yet. Click &ldquo;Add New&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {columns.map(col => (
                  <th key={col.key} className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={`border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--glass-bg)] transition-colors ${i % 2 === 0 ? '' : 'bg-[rgba(255,255,255,0.01)]'}`}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">
                      {String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={editHref(row.id)}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.08)] transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this item?')) onDelete(row.id);
                        }}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
