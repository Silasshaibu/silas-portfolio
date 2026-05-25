'use client';

import { useEffect, useState } from 'react';
import ProjectForm from '@/components/admin/ProjectForm';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/projects/${params.id}`)
      .then((r) => r.json())
      .then((p) => setData({
        ...p,
        tools: Array.isArray(p.tools) ? p.tools.join(', ') : p.tools,
        videoUrl: p.video_url,
        sortOrder: p.sort_order,
      }));
  }, [params.id]);

  if (!data) return <div className="p-8 text-[var(--text-secondary)]">Loading...</div>;

  return <ProjectForm defaultValues={data as never} projectId={Number(params.id)} />;
}
