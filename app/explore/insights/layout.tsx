import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Curated Quotes & Insights | Lenny\'s Podcast',
  description: 'Search and explore curated quotes from Lenny\'s Podcast episodes. Filter by philosophy zone, save favorites, and discover insights from top product leaders.',
  keywords: [
    'product management quotes',
    'Lenny\'s Podcast quotes',
    'product leadership insights',
    'startup wisdom',
    'growth quotes',
    'PM philosophy',
    'curated insights',
    'Lenny Rachitsky'
  ],
  openGraph: {
    title: 'Curated Quotes & Insights | Lenny\'s Podcast',
    description: 'Search and explore curated quotes from top product leaders. Filter by philosophy zone and save your favorites.',
    url: `${baseUrl}/explore/insights`,
    siteName: "Lenny's Podcast PM Philosophy",
    images: [
      {
        url: `${baseUrl}/explore/insights/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Curated Quotes & Insights from Lenny\'s Podcast'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Quotes & Insights | Lenny\'s Podcast',
    description: 'Search and explore curated quotes from top product leaders.',
    images: [`${baseUrl}/explore/insights/opengraph-image`]
  },
  alternates: {
    canonical: `${baseUrl}/explore/insights`
  }
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Explore', url: '/explore' },
          { name: 'Curated Insights', url: '/explore/insights' },
        ]}
      />
      {children}
    </>
  );
}
