import { projects } from '@/lib/projects';

// Heavy local images worth warming in the background, grouped by project slug
// so the prefetcher can prioritise the neighbours of the current project.
export interface ProjectMedia {
  slug: string;
  images: string[];
}

function isLocal(url?: string): url is string {
  return !!url && url.startsWith('/');
}

export function getMediaManifest(): ProjectMedia[] {
  return projects.map((p) => {
    const urls: string[] = [];
    // Render first (it's the visible/LCP layer of the slider), then the rest.
    if (isLocal(p.renderUrl)) urls.push(p.renderUrl);
    if (isLocal(p.thumbnail)) urls.push(p.thumbnail);
    if (isLocal(p.wireframeUrl)) urls.push(p.wireframeUrl);
    for (const item of p.gallery ?? []) {
      if (isLocal(item.url)) urls.push(item.url);
      if (isLocal(item.urlB)) urls.push(item.urlB);
    }
    return { slug: p.slug, images: Array.from(new Set(urls)) };
  });
}
