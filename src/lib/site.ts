export const SITE_URL = 'https://vlviewer.com';
export const SITE_NAME = 'Voiceline Viewer';
export const SITE_SHORT_NAME = 'VLViewer';
export const DEFAULT_TITLE =
  'Voiceline Viewer | Deadlock, Overwatch & Apex Voice Lines';
export const SITE_DESCRIPTION =
  'Browse, search, and listen to character voice lines, quotes, and conversations from Deadlock, Overwatch, and Apex Legends.';
export const AUTHOR_NAME = 'Mcall';
export const AUTHOR_URL = 'https://mcallbos.co';
export const KOFI_URL = 'https://ko-fi.com/mcallbosco';

export const GAMES = [
  {
    name: 'Deadlock',
    url: 'https://deadlock.vlviewer.com',
    description: "Valve's technically unreleased MOBA hybrid.",
  },
  {
    name: 'Overwatch',
    url: 'https://overwatch.vlviewer.com',
    description: "Blizzard's acclaimed hero shooter.",
  },
  {
    name: 'Apex Legends',
    url: 'https://apex.vlviewer.com',
    description: "Respawn's battle royale shooter.",
  },
] as const;

export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageAlternates(path: string, markdownPath: string) {
  return {
    canonical: absoluteUrl(path),
    types: {
      'application/rss+xml': absoluteUrl('/feed.xml'),
      'text/markdown': absoluteUrl(markdownPath),
    },
  };
}
