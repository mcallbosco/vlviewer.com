import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';

const expected = fs.readdirSync('content/blog')
  .filter(name => name.endsWith('.md'))
  .map(name => ({
    slug: name.slice(0, -3),
    ...matter(fs.readFileSync(`content/blog/${name}`, 'utf8')).data,
  }));

// Check the URL and Origin variants actually requested by the game sites.
for (const origin of [null, 'https://deadlock.vlviewer.com', 'https://apex.vlviewer.com', 'https://overwatch.vlviewer.com']) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const url = `https://r2blog.vlviewer.com/blogs.json${origin ? `?_=${Date.now()}` : ''}`;
      const response = await fetch(url, {
        headers: origin ? { Origin: origin } : {},
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });
      assert(response.ok, `HTTP ${response.status}`);
      const feed = await response.json();
      for (const post of expected) {
        const actual = feed.posts.find(candidate => candidate.slug === post.slug);
        assert(actual, `Missing post ${post.slug}`);
        for (const [key, value] of Object.entries(post)) {
          assert.deepEqual(actual[key], value, `${post.slug}: stale ${key}`);
        }
      }
      console.log(`Verified ${expected.length} posts for ${origin || 'direct requests'}`);
      break;
    } catch (error) {
      if (attempt === 6) throw error;
      console.warn(`Feed not current for ${origin || 'direct requests'}; retrying (${attempt}/6).`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
