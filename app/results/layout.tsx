import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Your PM Philosophy Results | Lenny\'s Podcast',
  description: 'Your product management philosophy profile with personalized episode recommendations from Lenny\'s Podcast. Discover which product leaders share your approach.',
  keywords: [
    'product management results',
    'PM philosophy profile',
    'podcast recommendations',
    'product leadership',
    'Lenny\'s Podcast',
    'episode recommendations',
    'Lenny Rachitsky'
  ],
  openGraph: {
    title: 'Your PM Philosophy Results | Lenny\'s Podcast',
    description: 'Your personalized product management philosophy profile with episode recommendations from top product leaders.',
    url: `${baseUrl}/results`,
    siteName: "Lenny's Podcast PM Philosophy",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'PM Philosophy Results'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your PM Philosophy Results | Lenny\'s Podcast',
    description: 'Your personalized product management philosophy profile with episode recommendations.',
    images: [`${baseUrl}/og-image.png`]
  },
  alternates: {
    canonical: `${baseUrl}/results`
  }
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Philosophy Quiz', url: '/quiz' },
          { name: 'Your Results', url: '/results' },
        ]}
      />
      {children}
    </>
  );
}
