import Link from 'next/link';
import type { Metadata } from 'next';
import { getSortedPostsData } from '@/lib/blog';
import BlogList from '@/components/BlogList';
import JsonLd from '@/components/JsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageAlternates } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Updates, new voice lines, and site news for Voiceline Viewer — the Deadlock, Overwatch, and Apex Legends voice line archive.',
  alternates: pageAlternates('/blog', '/blog.md'),
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      'Updates, new voice lines, and site news for Voiceline Viewer.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white" style={{ backgroundColor: 'var(--bg-page)' }}>
      <header className="bg-gray-800 shadow-md" style={{ backgroundColor: 'var(--bg-header)' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400 leading-none">
            Voiceline Viewer
          </Link>
          <nav aria-label="Primary" className="flex space-x-6">
            <Link href="/contributors" className="text-gray-300 hover:text-white font-medium transition-colors">
              Contributors
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white font-medium transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${SITE_NAME} Blog`,
            description: SITE_DESCRIPTION,
            url: `${SITE_URL}/blog`,
            isPartOf: { '@id': `${SITE_URL}/#website` },
          }}
        />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 border-b border-gray-800 pb-4">Latest Updates</h1>
          <BlogList posts={allPostsData} />
        </div>
      </main>

      <footer className="bg-gray-800 py-6 mt-12" style={{ backgroundColor: 'var(--bg-footer)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 space-y-3">
            <p className="text-sm">
              Created by <a href="https://mcallbos.co" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Mcall</a>
            </p>
            <p className="pt-2">
              <a href="https://ko-fi.com/mcallbosco" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
                </svg>
                Buy me a coffee
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
