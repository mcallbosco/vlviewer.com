import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist on Voiceline Viewer.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
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

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          That URL does not exist. Try the home page, blog, or a game viewer.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
            Home
          </Link>
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-medium">
            Blog
          </Link>
          <Link href="/contributors" className="text-blue-400 hover:text-blue-300 font-medium">
            Contributors
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 py-6 mt-12" style={{ backgroundColor: 'var(--bg-footer)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              Created by <a href="https://mcallbos.co" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Mcall</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
