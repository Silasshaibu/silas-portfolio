'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
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

interface Project { id: number; title: string; category: string; client: string; featured: boolean; sort_order: number; }

function SortableRow({ project, onDelete, editHref }: { project: Project; onDelete: (id: number) => void; editHref: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

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
      <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[220px] truncate text-sm">{project.title}</td>
      <td className="px-4 py-3 text-[var(--text-secondary)] text-sm capitalize">{project.category}</td>
      <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[180px] truncate text-sm">{project.client}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${project.featured ? 'bg-green-400/10 text-green-400' : 'bg-[var(--glass-bg)] text-[var(--text-muted)]'}`}>
          {project.featured ? 'Featured' : 'Normal'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link href={editHref} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.08)] transition-colors" aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => { if (confirm('Delete this project?')) onDelete(project.id); }}
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex(p => p.id === active.id);
    const newIndex = projects.findIndex(p => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);

    await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: reordered.map((p, i) => ({ id: p.id, sort_order: i + 1 })) }),
    });
  };

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-grotesk font-bold text-2xl text-white">Projects</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Drag rows to reorder</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#080808] text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {loading ? <AdminSpinner label="Loading projects..." /> : projects.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No projects yet. Click &ldquo;Add New&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="px-3 py-3 w-8"><span className="sr-only">Drag handle</span></th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {projects.map(project => (
                    <SortableRow
                      key={project.id}
                      project={project}
                      onDelete={onDelete}
                      editHref={`/admin/projects/${project.id}`}
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
