/**
 * Generates LLM-oriented and syndication files into /public.
 * Run from prebuild / predev so they ship with the static export.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://vlviewer.com';
const SITE_NAME = 'Voiceline Viewer';
const SITE_DESCRIPTION =
  'Browse, search, and listen to character voice lines, quotes, and conversations from Deadlock, Overwatch, and Apex Legends.';
const AUTHOR_NAME = 'Mcall';
const AUTHOR_URL = 'https://mcallbos.co';
const KOFI_URL = 'https://ko-fi.com/mcallbosco';

const GAMES = [
  {
    name: 'Deadlock',
    url: 'https://deadlock.vlviewer.com',
    description: "Voice lines and conversations for Valve's Deadlock.",
  },
  {
    name: 'Overwatch',
    url: 'https://overwatch.vlviewer.com',
    description: 'Voice lines and interactions for Overwatch.',
  },
  {
    name: 'Apex Legends',
    url: 'https://apex.vlviewer.com',
    description: 'Voice lines for Apex Legends.',
  },
];

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTRIBUTORS_FILE = path.join(ROOT, 'src', 'data', 'contributors.json');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absolutizeMarkdown(content) {
  return content
    .replace(/\]\((\/[^)]+)\)/g, `](${SITE_URL}$1)`)
    .replace(/src="(\/[^"]+)"/g, `src="${SITE_URL}$1"`);
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(POSTS_DIR, fileName);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const parsed = matter(raw);
      return {
        slug,
        raw,
        content: parsed.content,
        title: parsed.data.title || slug,
        date: parsed.data.date || '',
        game: parsed.data.game || '',
        description: parsed.data.description || '',
        image: parsed.data.image || '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function loadContributorNames() {
  if (!fs.existsSync(CONTRIBUTORS_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(CONTRIBUTORS_FILE, 'utf8'));
    return data.map((c) => c.login || c.name).filter(Boolean);
  } catch {
    return [];
  }
}

function writeFile(relPath, contents) {
  const dest = path.join(PUBLIC_DIR, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, contents);
  console.log(`Wrote ${relPath}`);
}

function buildLlmsTxt(posts) {
  const blogLinks = posts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description} (${post.game}, ${post.date})\n` +
        `- [${post.title} (markdown)](${SITE_URL}/blog/${post.slug}.md): Markdown source for the same post`
    )
    .join('\n');

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} (VLViewer) is a fan-made archive of in-game voice lines and character interactions. This domain hosts project updates, contributor credits, and links to each game's viewer. The voice-line browsers themselves live on game-specific subdomains.

Created by [${AUTHOR_NAME}](${AUTHOR_URL}). AI crawlers and agents are welcome; see ${SITE_URL}/robots.txt. Prefer markdown twins (\`.md\`) and this file over scraping rendered HTML when both exist.

## Pages

- [Home](${SITE_URL}/): Game picker linking to each voice-line viewer
- [Home (markdown)](${SITE_URL}/index.md): Markdown version of the home page
- [Blog](${SITE_URL}/blog): Project updates, new lines, and patch notes
- [Blog (markdown)](${SITE_URL}/blog.md): Markdown index of blog posts
- [Contributors](${SITE_URL}/contributors): Deadlock transcription contributors
- [Contributors (markdown)](${SITE_URL}/contributors.md): Markdown version of the contributors page
- [RSS feed](${SITE_URL}/feed.xml): Blog RSS
- [Full LLM dump](${SITE_URL}/llms-full.txt): This overview plus the full text of every blog post
- [Sitemap](${SITE_URL}/sitemap.xml): All indexable URLs

## Game viewers

${GAMES.map((game) => `- [${game.name} Voiceline Viewer](${game.url}): ${game.description}`).join('\n')}

## Blog posts

${blogLinks}

## Optional

- [Author site](${AUTHOR_URL})
- [Ko-fi](${KOFI_URL})
- [Social preview image](${SITE_URL}/og.png)
`;
}

function buildLlmsFullTxt(posts) {
  const articles = posts
    .map((post) => {
      const imageLine = post.image
        ? `\nFeatured image: ${post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`}`
        : '';
      return `## ${post.title}

- URL: ${SITE_URL}/blog/${post.slug}
- Markdown: ${SITE_URL}/blog/${post.slug}.md
- Date: ${post.date}
- Category: ${post.game}
- Description: ${post.description}${imageLine}

${absolutizeMarkdown(post.content).trim()}
`;
    })
    .join('\n---\n\n');

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

This file is a full-text companion to ${SITE_URL}/llms.txt. It repeats the site overview and inlines every blog post so agents can answer questions without extra fetches.

Created by [${AUTHOR_NAME}](${AUTHOR_URL}).

## Site

- Home: ${SITE_URL}/
- Blog: ${SITE_URL}/blog
- Contributors: ${SITE_URL}/contributors
- Game viewers: ${GAMES.map((game) => `${game.name} ${game.url}`).join('; ')}

## Blog posts

${articles}
`;
}

function buildRss(posts) {
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : '';
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.game)}</category>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  const latest = posts[0]?.date ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(`Updates and new voice lines for ${SITE_NAME}.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${latest}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function buildIndexMd() {
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Pick a game to browse character voice lines, quotes, and conversations.

## Games

${GAMES.map((game) => `- [${game.name}](${game.url}): ${game.description}`).join('\n')}

## More

- [Blog](${SITE_URL}/blog)
- [Contributors](${SITE_URL}/contributors)
- [LLM overview](${SITE_URL}/llms.txt)

Created by [${AUTHOR_NAME}](${AUTHOR_URL}).
`;
}

function buildBlogIndexMd(posts) {
  const list = posts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}) (${post.date}, ${post.game}): ${post.description}`
    )
    .join('\n');

  return `# ${SITE_NAME} Blog

Updates, new voice lines, and site news.

${list}

RSS: ${SITE_URL}/feed.xml
`;
}

function buildContributorsMd(names) {
  const list =
    names.length > 0
      ? names.map((name) => `- ${name}`).join('\n')
      : '- Contributor names are generated at build time.';

  return `# ${SITE_NAME} Contributors

A thank-you page for everyone who has contributed to the Deadlock transcriptions project.

${list}

HTML: ${SITE_URL}/contributors
`;
}

const posts = loadPosts();
const contributorNames = loadContributorNames();

writeFile('llms.txt', buildLlmsTxt(posts));
writeFile('llms-full.txt', buildLlmsFullTxt(posts));
writeFile('feed.xml', buildRss(posts));
writeFile('index.md', buildIndexMd());
writeFile('blog.md', buildBlogIndexMd(posts));
writeFile('contributors.md', buildContributorsMd(contributorNames));

for (const post of posts) {
  writeFile(`blog/${post.slug}.md`, absolutizeMarkdown(post.raw));
}
