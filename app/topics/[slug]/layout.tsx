import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOPIC_PAGES, getQuotesForTopic, getEpisodesForTopic } from '@/lib/topics';
import { getTakeawaysForTopic } from '@/lib/verifiedQuotes';
import { BreadcrumbSchema, EpisodeListSchema, safeJsonLd } from '@/components/StructuredData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPIC_PAGES.find(t => t.slug === slug);

  if (!topic) {
    return { title: 'Topic Not Found' };
  }

  const quotes = getQuotesForTopic(slug);
  const episodes = getEpisodesForTopic(slug);
  const takeawaysMeta = getTakeawaysForTopic(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

  const title = `${topic.name} - Insights from Lenny's Podcast | PM Philosophy`;
  const description = `${topic.description} ${quotes.length} curated quotes${takeawaysMeta.length > 0 ? `, ${takeawaysMeta.length} key takeaways` : ''} from ${episodes.length} episodes.`;

  return {
    title,
    description,
    keywords: [
      topic.name.toLowerCase(),
      ...topic.relatedTopics,
      "Lenny's Podcast",
      'product management',
      'PM insights',
    ],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/topics/${slug}`,
      siteName: "Lenny's Podcast PM Philosophy",
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@lennysan',
    },
    alternates: {
      canonical: `${baseUrl}/topics/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return TOPIC_PAGES.map(topic => ({ slug: topic.slug }));
}

export default async function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = TOPIC_PAGES.find(t => t.slug === slug);

  if (!topic) {
    notFound();
  }

  const episodes = getEpisodesForTopic(slug);
  const quotes = getQuotesForTopic(slug);
  const takeaways = getTakeawaysForTopic(slug);

  // FAQ schema for the topic
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What do top product leaders say about ${topic.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: quotes.slice(0, 3).map(q => `${q.speaker}: "${q.text}"`).join(' '),
        },
      },
      {
        '@type': 'Question',
        name: `Which Lenny's Podcast episodes cover ${topic.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${episodes.length} episodes cover ${topic.name.toLowerCase()}, including: ${episodes.slice(0, 5).map(e => e.guest).join(', ')}.`,
        },
      },
      ...(takeaways.length > 0 ? [{
        '@type': 'Question' as const,
        name: `What are the key takeaways about ${topic.name.toLowerCase()} from Lenny's Podcast?`,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: takeaways.slice(0, 5).map(t => t.text).join(' '),
        },
      }] : []),
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Topics', url: '/topics' },
          { name: topic.name, url: `/topics/${slug}` },
        ]}
      />
      <EpisodeListSchema
        episodes={episodes.slice(0, 20)}
        listName={`${topic.name} Episodes - Lenny's Podcast`}
        listDescription={topic.description}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      {children}
    </>
  );
}
