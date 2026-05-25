'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminServicesPage() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const res = await fetch('/api/admin/services');
    if (res.ok) setRows(await res.json());
  };
  useEffect(() => { load(); }, []);

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <AdminTable
      title="Services"
      newHref="/admin/services/new"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'icon', label: 'Icon' },
        { key: 'sort_order', label: 'Order' },
      ]}
      rows={rows}
      onDelete={onDelete}
      editHref={(id) => `/admin/services/${id}`}
    />
  );
}
