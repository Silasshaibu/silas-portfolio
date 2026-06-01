'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, GripVertical, Star } from 'lucide-react';
import AdminSpinner from '@/components/admin/AdminSpinner';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Testimonial { id: number; name: string; company: string; platform: string; rating: number; quote: string; sort_order: number; }

function SortableRow({ t, onDelete, editHref }: { t: Testimonial; onDelete: (id: number) => void; editHref: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: t.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--glass-bg)] transition-colors"
    >
      <td className="px-3 py-3 w-8">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors touch-none"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-3 text-[var(--text-secondary)] text-sm font-medium">{t.name}</td>
      <td className="px-4 py-3 text-[var(--text-secondary)] text-sm max-w-[180px] truncate">{t.company}</td>
      <td className="px-4 py-3 text-sm max-w-[200px] truncate text-[var(--text-muted)] italic">&ldquo;{t.quote}&rdquo;</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(t.rating) ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${t.platform === 'Fiverr' ? 'bg-[rgba(29,191,115,0.1)] text-[#1dbf73]' : t.platform === 'LinkedIn' ? 'bg-[rgba(10,102,194,0.1)] text-[#0a66c2]' : 'bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)]'}`}>
          {t.platform}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link href={editHref} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.08)] transition-colors" aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => { if (confirm('Delete this testimonial?')) onDelete(t.id); }}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials');
    if (res.ok) setTestimonials(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex(t => t.id === active.id);
    const newIndex = testimonials.findIndex(t => t.id === over.id);
    const reordered = arrayMove(testimonials, oldIndex, newIndex);
    setTestimonials(reordered);

    await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: reordered.map((t, i) => ({ id: t.id, sort_order: i + 1 })) }),
    });
  };

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-grotesk font-bold text-2xl text-white">Testimonials</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Drag rows to reorder · {testimonials.length} reviews</p>
        </div>
        <Link href="/admin/testimonials/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#080808] text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {loading ? <AdminSpinner label="Loading testimonials..." /> : testimonials.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No testimonials yet. Click &ldquo;Add New&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="px-3 py-3 w-8"><span className="sr-only">Drag handle</span></th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Quote</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={testimonials.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {testimonials.map(t => (
                    <SortableRow key={t.id} t={t} onDelete={onDelete} editHref={`/admin/testimonials/${t.id}`} />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      )}
    </div>
  );
}
