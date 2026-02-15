import { Metadata } from 'next';
import { BreadcrumbSchema, EpisodeListSchema } from '@/components/StructuredData';
import { allEpisodes } from '@/lib/allEpisodes';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Explore 294 Episodes | Lenny\'s Podcast',
  description: 'Browse 294 episodes from Lenny\'s Podcast featuring product leaders, growth experts, and innovators. Searchable transcripts, verified quotes, and insights.',
  keywords: [
    'product management',
    'growth',
    'leadership',
    'podcasts',
    'transcripts',
    'Lenny Rachitsky',
    'product leaders',
    'startup advice'
  ],
  openGraph: {
    title: 'Explore 294 Episodes | Lenny\'s Podcast',
    description: 'Browse 294 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    url: `${baseUrl}/explore`,
    siteName: "Lenny's Podcast PM Philosophy",
    images: [
      {
        url: `${baseUrl}/explore-og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Explore Lenny\'s Podcast Episodes'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore 294 Episodes | Lenny\'s Podcast',
    description: 'Browse 294 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    images: [`${baseUrl}/explore-og-image.png`]
  }
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Explore Episodes', url: '/explore' },
        ]}
      />
      <EpisodeListSchema
        episodes={allEpisodes.slice(0, 20).map(ep => ({
          slug: ep.slug,
          guest: ep.guest,
          title: ep.title,
        }))}
        listName="Lenny's Podcast Episodes"
        listDescription="Browse 294 episodes from Lenny's Podcast featuring top product leaders, growth experts, and innovators."
      />
      {children}
    </>
  );
}
