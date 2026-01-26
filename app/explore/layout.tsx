import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Explore 295 Episodes | Lenny\'s Podcast',
  description: 'Browse 295 episodes from Lenny\'s Podcast featuring product leaders, growth experts, and innovators. Searchable transcripts, verified quotes, and insights.',
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
    title: 'Explore 295 Episodes | Lenny\'s Podcast',
    description: 'Browse 295 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    url: `${baseUrl}/explore`,
    siteName: 'PM Philosophy Quiz',
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
    title: 'Explore 295 Episodes | Lenny\'s Podcast',
    description: 'Browse 295 episodes with searchable transcripts, verified quotes, and insights from product and growth leaders.',
    images: [`${baseUrl}/explore-og-image.png`]
  }
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
