import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import JsonLd from '@/components/JsonLd';
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  DEFAULT_TITLE,
  KOFI_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  absoluteUrl,
} from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#111827',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  category: 'Games',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': absoluteUrl('/feed.xml'),
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_SHORT_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Voiceline Viewer — Deadlock, Overwatch, and Apex Legends voice lines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og.png'],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: [SITE_SHORT_NAME, 'VLViewer.com'],
      description: SITE_DESCRIPTION,
      inLanguage: 'en-US',
      publisher: { '@id': `${SITE_URL}/#author` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
      sameAs: [AUTHOR_URL, KOFI_URL, 'https://github.com/mcallbosco'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="describedby" href={absoluteUrl('/llms.txt')} />
        <link rel="alternate" type="text/plain" href={absoluteUrl('/llms.txt')} title="LLM site overview" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <JsonLd data={websiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
