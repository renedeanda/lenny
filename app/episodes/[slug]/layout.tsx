import { Metadata } from 'next';
import { getEpisodeBySlug } from '@/lib/allEpisodes';
import { getEpisodeEnrichment } from '@/lib/verifiedQuotes';
import { PodcastEpisodeSchema, EpisodeFAQSchema, BreadcrumbSchema } from '@/components/StructuredData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    return {
      title: 'Episode Not Found - Lenny\'s Podcast Philosophy',
    };
  }

  const enrichment = getEpisodeEnrichment(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';
  const ogImageUrl = `${baseUrl}/og/${episode.slug}.png`;

  // Build a rich description using curated takeaways when available
  let description = episode.description || `Listen to ${episode.guest} on Lenny's Podcast`;
  if (enrichment?.takeaways && enrichment.takeaways.length > 0) {
    const takeawayPreview = enrichment.takeaways.slice(0, 2).join(' ');
    description = `${episode.guest} on Lenny's Podcast: ${takeawayPreview}`.substring(0, 300);
  }

  const title = `${episode.guest} - Lenny's Podcast | PM Philosophy`;

  // Build rich keywords from episode keywords + enrichment themes
  const keywords = [
    ...(episode.keywords || []),
    ...(enrichment?.themes || []),
    episode.guest,
    "Lenny's Podcast",
    'product management',
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/episodes/${episode.slug}`,
      siteName: "Lenny's Podcast PM Philosophy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${episode.guest} on Lenny's Podcast`,
        },
      ],
      type: 'article',
      publishedTime: episode.publishDate || undefined,
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

export default async function EpisodeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  const enrichment = episode ? getEpisodeEnrichment(slug) : undefined;

  return (
    <>
      {/* Structured Data for SEO */}
      {episode && (
        <PodcastEpisodeSchema episode={episode} enrichment={enrichment} />
      )}
      {episode && enrichment && (
        <EpisodeFAQSchema episode={episode} enrichment={enrichment} />
      )}
      {episode && (
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: 'Explore Episodes', url: '/explore' },
            { name: episode.guest, url: `/episodes/${episode.slug}` },
          ]}
        />
      )}
      {children}
    </>
  );
}
