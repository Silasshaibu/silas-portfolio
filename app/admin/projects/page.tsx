'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminProjectsPage() {
  const [rows, setRows] = useState([]);
  const router = useRouter();

  const load = async () => {
    const res = await fetch('/api/admin/projects');
    if (res.ok) setRows(await res.json());
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <AdminTable
      title="Projects"
      newHref="/admin/projects/new"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'client', label: 'Client' },
        { key: 'featured', label: 'Featured' },
      ]}
      rows={rows}
      onDelete={onDelete}
      editHref={(id) => `/admin/projects/${id}`}
    />
  );
}
