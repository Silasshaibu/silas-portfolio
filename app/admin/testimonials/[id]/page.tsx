'use client';
import { useEffect, useState } from 'react';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    fetch(`/api/admin/testimonials/${params.id}`).then(r => r.json()).then(t => setData({ ...t, sortOrder: t.sort_order }));
  }, [params.id]);
  if (!data) return <div className="p-8 text-[var(--text-secondary)]">Loading...</div>;
  return <TestimonialForm defaultValues={data as never} testimonialId={Number(params.id)} />;
}
