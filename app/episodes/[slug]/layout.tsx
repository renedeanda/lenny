import { Metadata } from 'next';
import { getEpisodeBySlug } from '@/lib/allEpisodes';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const episode = getEpisodeBySlug(params.slug);
  
  if (!episode) {
    return {
      title: 'Episode Not Found - PM Philosophy Map',
    };
  }

  const title = `${episode.guest} - Lenny's Podcast | PM Philosophy Map`;
  const description = episode.description || `Listen to ${episode.guest} on Lenny's Podcast`;
  const ogImageUrl = `/og/${episode.slug}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pmphilosophy.com/episodes/${episode.slug}`,
      siteName: 'PM Philosophy Map',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${episode.guest} on Lenny's Podcast`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@lennysan',
    },
  };
}

export default function EpisodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
