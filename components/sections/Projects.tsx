import ProjectsClient from '@/components/sections/ProjectsClient';
import { dbGetProjects, mapDbProject } from '@/lib/admin-db';
import { projects as staticProjects } from '@/lib/projects';
import type { Project } from '@/types';

export default async function Projects() {
  let items: Project[] = staticProjects;
  try {
    const rows = await dbGetProjects();
    if (rows.length > 0) items = rows.map((r) => mapDbProject(r as Record<string, unknown>));
  } catch {
    /* fall back to static */
  }
  return <ProjectsClient projects={items} />;
}
