'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, GripVertical, Eye, EyeOff } from 'lucide-react';
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

interface Service { id: number; title: string; icon: string; description: string; hidden: boolean; sort_order: number; }

function SortableRow({ service, onDelete, onToggleDraft, editHref }: { service: Service; onDelete: (id: number) => void; onToggleDraft: (id: number) => void; editHref: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--glass-bg)] transition-colors ${service.hidden ? 'opacity-50' : ''}`}
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
      <td className="px-4 py-3 text-[var(--text-secondary)] text-sm font-medium">{service.title}</td>
      <td className="px-4 py-3 text-[var(--text-secondary)] text-sm font-mono">{service.icon}</td>
      <td className="px-4 py-3 text-sm max-w-[240px] truncate text-[var(--text-muted)]">{service.description}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${service.hidden ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
          {service.hidden ? 'Draft' : 'Live'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onToggleDraft(service.id)}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-yellow-400 hover:bg-[rgba(250,204,21,0.08)] transition-colors"
            aria-label={service.hidden ? 'Set Live' : 'Set Draft'}
            title={service.hidden ? 'Set Live' : 'Set Draft'}
          >
            {service.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <Link href={editHref} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.08)] transition-colors" aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => { if (confirm('Delete this service?')) onDelete(service.id); }}
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/services');
    if (res.ok) setServices(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex(s => s.id === active.id);
    const newIndex = services.findIndex(s => s.id === over.id);
    const reordered = arrayMove(services, oldIndex, newIndex);
    setServices(reordered);

    await fetch('/api/admin/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: reordered.map((s, i) => ({ id: s.id, sort_order: i + 1 })) }),
    });
  };

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    load();
  };

  const onToggleDraft = async (id: number) => {
    await fetch(`/api/admin/services/${id}`, { method: 'PATCH' });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-grotesk font-bold text-2xl text-white">Services</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Drag rows to reorder</p>
        </div>
        <Link href="/admin/services/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#080808] text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {loading ? <AdminSpinner label="Loading services..." /> : services.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No services yet. Click &ldquo;Add New&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="px-3 py-3 w-8"><span className="sr-only">Drag handle</span></th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Icon</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {services.map(service => (
                    <SortableRow
                      key={service.id}
                      service={service}
                      onDelete={onDelete}
                      onToggleDraft={onToggleDraft}
                      editHref={`/admin/services/${service.id}`}
                    />
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
