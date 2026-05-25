import { NextRequest, NextResponse } from 'next/server';
import { dbGetProject, dbUpdateProject, dbDeleteProject } from '@/lib/admin-db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await dbGetProject(Number(params.id));
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const project = await dbUpdateProject(Number(params.id), {
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
    return NextResponse.json(project);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbDeleteProject(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
