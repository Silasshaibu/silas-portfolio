'use client';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState([]);
  const load = async () => { const r = await fetch('/api/admin/testimonials'); if (r.ok) setRows(await r.json()); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: number) => { await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' }); load(); };
  return (
    <AdminTable
      title="Testimonials"
      newHref="/admin/testimonials/new"
      columns={[{ key: 'name', label: 'Name' }, { key: 'company', label: 'Company' }, { key: 'platform', label: 'Platform' }, { key: 'rating', label: 'Rating' }]}
      rows={rows}
      onDelete={onDelete}
      editHref={(id) => `/admin/testimonials/${id}`}
    />
  );
}
