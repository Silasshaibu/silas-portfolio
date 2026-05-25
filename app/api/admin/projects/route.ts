import { NextRequest, NextResponse } from 'next/server';
import { dbGetProjects, dbCreateProject } from '@/lib/admin-db';

export async function GET() {
  try {
    const projects = await dbGetProjects();
    return NextResponse.json(projects);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await dbCreateProject({
      slug: data.slug,
      title: data.title,
      category: data.category,
      client: data.client,
      tools: data.tools ?? [],
      thumbnail: data.thumbnail ?? '',
      videoUrl: data.videoUrl ?? '',
      description: data.description ?? '',
      challenge: data.challenge ?? '',
      solution: data.solution ?? '',
      result: data.result ?? '',
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
