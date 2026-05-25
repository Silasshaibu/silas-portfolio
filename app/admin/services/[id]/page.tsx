'use client';
import { useEffect, useState } from 'react';
import ServiceForm from '@/components/admin/ServiceForm';

export default function EditServicePage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    fetch(`/api/admin/services/${params.id}`).then(r => r.json()).then(s => setData({ ...s, sortOrder: s.sort_order }));
  }, [params.id]);
  if (!data) return <div className="p-8 text-[var(--text-secondary)]">Loading...</div>;
  return <ServiceForm defaultValues={data as never} serviceId={Number(params.id)} />;
}
