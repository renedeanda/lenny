import { TOTAL_EPISODES } from '@/lib/zones';
import { TOPIC_PAGES } from '@/lib/topics';

// Generated once at build time (static export): a short index for AI assistants, never the transcripts themselves.
export const dynamic = 'force-static';

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';
  const body = [
    "# Discover Your Product Philosophy",
    '',
    `> A 10-question quiz that recommends Lenny's Podcast episodes matching how you work as a product manager. Built from ${TOTAL_EPISODES} episodes, with quotes verified against the transcripts. By René DeAnda.`,
    '',
    '## Pages',
    '',
    `- [Quiz](${baseUrl}/quiz): ten questions, then episode recommendations`,
    `- [Explore episodes](${baseUrl}/explore): every episode, searchable, with verified quotes`,
    `- [Insights](${baseUrl}/explore/insights): patterns across the curated quotes`,
    `- [Topics](${baseUrl}/topics): episodes and quotes grouped by theme`,
    '',
    '## Topics',
    '',
    ...TOPIC_PAGES.map((topic) => `- [${topic.name}](${baseUrl}/topics/${topic.slug}): ${topic.description}`),
    '',
    `Every episode page is listed in ${baseUrl}/sitemap.xml.`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
