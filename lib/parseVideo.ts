export function parseVideo(url: string): { vimeoId?: string; youtubeId?: string; thumbnailUrl?: string } {
  if (/youtu\.?be/.test(url)) {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? '';
    return { youtubeId: id, thumbnailUrl: id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : undefined };
  }
  return { vimeoId: url.split('/').pop() ?? '' };
}
