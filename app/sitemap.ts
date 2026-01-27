import { MetadataRoute } from 'next';
import { allEpisodes } from '@/lib/allEpisodes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Episode pages (all 295)
  const episodePages: MetadataRoute.Sitemap = allEpisodes.map((episode) => ({
    url: `${baseUrl}/episodes/${episode.slug}`,
    lastModified: episode.publishDate ? new Date(episode.publishDate) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...episodePages];
}
