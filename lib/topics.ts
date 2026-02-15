import { getAllVerifiedQuotes } from './verifiedQuotes';
import { allEpisodes } from './allEpisodes';
import { Quote } from './types';

/**
 * Top topics with enough content to warrant their own landing page.
 * Each needs a minimum quote count to generate quality pages.
 */
export interface TopicPage {
  slug: string;
  name: string;
  description: string;
  relatedTopics: string[];
}

/**
 * Curated topic definitions with SEO-friendly descriptions
 */
export const TOPIC_PAGES: TopicPage[] = [
  {
    slug: 'leadership',
    name: 'Leadership',
    description: "Insights on product leadership from Lenny's Podcast guests. Learn how top leaders like Brian Chesky, Claire Hughes Johnson, and others approach leading product teams.",
    relatedTopics: ['management', 'hiring', 'culture', 'team-building'],
  },
  {
    slug: 'strategy',
    name: 'Product Strategy',
    description: "Product strategy frameworks and thinking from top product leaders. Explore how guests on Lenny's Podcast approach strategic decision-making.",
    relatedTopics: ['prioritization', 'vision', 'differentiation', 'positioning'],
  },
  {
    slug: 'growth',
    name: 'Growth',
    description: "Growth strategies, tactics, and frameworks from growth experts featured on Lenny's Podcast. From product-led growth to experimentation.",
    relatedTopics: ['metrics', 'experimentation', 'retention', 'product-market-fit'],
  },
  {
    slug: 'decision-making',
    name: 'Decision Making',
    description: "How the best product managers and leaders make decisions. Frameworks, mental models, and real-world examples from Lenny's Podcast.",
    relatedTopics: ['prioritization', 'frameworks', 'strategy', 'execution'],
  },
  {
    slug: 'culture',
    name: 'Company Culture',
    description: "Building great product culture from leaders at Airbnb, Stripe, Linear, and more. Real stories and frameworks from Lenny's Podcast.",
    relatedTopics: ['hiring', 'leadership', 'team-building', 'management'],
  },
  {
    slug: 'hiring',
    name: 'Hiring & Teams',
    description: "How top companies hire and build product teams. Interview strategies, team structures, and hiring frameworks from Lenny's Podcast guests.",
    relatedTopics: ['culture', 'team-building', 'leadership', 'management'],
  },
  {
    slug: 'product-market-fit',
    name: 'Product-Market Fit',
    description: "Finding and measuring product-market fit. Stories and frameworks from founders and product leaders on Lenny's Podcast.",
    relatedTopics: ['growth', 'user-research', 'metrics', 'experimentation'],
  },
  {
    slug: 'experimentation',
    name: 'Experimentation',
    description: "A/B testing, experimentation frameworks, and data-driven product development. Insights from growth and product leaders on Lenny's Podcast.",
    relatedTopics: ['metrics', 'growth', 'decision-making', 'iteration'],
  },
  {
    slug: 'communication',
    name: 'Communication',
    description: "How great product leaders communicate. Storytelling, stakeholder management, and influence from Lenny's Podcast guests.",
    relatedTopics: ['storytelling', 'alignment', 'leadership', 'collaboration'],
  },
  {
    slug: 'prioritization',
    name: 'Prioritization',
    description: "Frameworks for what to build next. How top PMs and leaders prioritize from Lenny's Podcast episodes.",
    relatedTopics: ['focus', 'strategy', 'decision-making', 'execution'],
  },
  {
    slug: 'metrics',
    name: 'Metrics & Analytics',
    description: "Which metrics matter and how to use them. Data-driven product management insights from Lenny's Podcast guests.",
    relatedTopics: ['experimentation', 'growth', 'decision-making', 'retention'],
  },
  {
    slug: 'innovation',
    name: 'Innovation',
    description: "How the best product companies innovate. Creativity, disruption, and building the future from Lenny's Podcast.",
    relatedTopics: ['creativity', 'vision', 'AI', 'differentiation'],
  },
  {
    slug: 'user-research',
    name: 'User Research',
    description: "Talking to users and building what they need. User research methods and insights from Lenny's Podcast guests.",
    relatedTopics: ['product-market-fit', 'feedback', 'discovery', 'iteration'],
  },
  {
    slug: 'execution',
    name: 'Execution',
    description: "Shipping great products fast. Execution frameworks from operators and builders featured on Lenny's Podcast.",
    relatedTopics: ['velocity', 'iteration', 'focus', 'prioritization'],
  },
  {
    slug: 'career-growth',
    name: 'Career Growth',
    description: "Growing your product management career. Advice from VP Products, CPOs, and founders on Lenny's Podcast.",
    relatedTopics: ['career', 'self-awareness', 'learning', 'leadership'],
  },
  {
    slug: 'AI',
    name: 'AI & Product',
    description: "Building AI products, using AI in product development, and the future of AI from leaders featured on Lenny's Podcast.",
    relatedTopics: ['innovation', 'strategy', 'product-development', 'creativity'],
  },
  {
    slug: 'scaling',
    name: 'Scaling',
    description: "Scaling products, teams, and companies. Growth-stage challenges and solutions from Lenny's Podcast guests.",
    relatedTopics: ['growth', 'hiring', 'culture', 'execution'],
  },
  {
    slug: 'storytelling',
    name: 'Storytelling',
    description: "The art of product storytelling, positioning, and narrative from top communicators on Lenny's Podcast.",
    relatedTopics: ['communication', 'positioning', 'differentiation', 'vision'],
  },
  {
    slug: 'product-design',
    name: 'Product Design',
    description: "Design thinking, craft, and building beautiful products. Insights from designers and product leaders on Lenny's Podcast.",
    relatedTopics: ['craft', 'simplicity', 'quality', 'innovation'],
  },
  {
    slug: 'retention',
    name: 'Retention',
    description: "Keeping users engaged and reducing churn. Retention strategies from growth experts on Lenny's Podcast.",
    relatedTopics: ['growth', 'onboarding', 'metrics', 'product-market-fit'],
  },
];

/**
 * Get quotes for a given topic (matches theme name or related topics)
 */
export function getQuotesForTopic(topicSlug: string): Quote[] {
  const topic = TOPIC_PAGES.find(t => t.slug === topicSlug);
  if (!topic) return [];

  const allQuotes = getAllVerifiedQuotes();
  const matchingThemes = [topicSlug, ...topic.relatedTopics];

  return allQuotes.filter(q =>
    q.themes.some(t => matchingThemes.includes(t))
  );
}

/**
 * Get episodes that are most relevant to a topic
 */
export function getEpisodesForTopic(topicSlug: string): Array<{
  slug: string;
  guest: string;
  title: string;
  quoteCount: number;
}> {
  const quotes = getQuotesForTopic(topicSlug);

  // Count quotes per episode
  const episodeCounts = new Map<string, number>();
  for (const quote of quotes) {
    const slug = quote.source.slug;
    episodeCounts.set(slug, (episodeCounts.get(slug) || 0) + 1);
  }

  // Map to episode data and sort by quote count
  return Array.from(episodeCounts.entries())
    .map(([slug, count]) => {
      const ep = allEpisodes.find(e => e.slug === slug);
      return {
        slug,
        guest: ep?.guest || slug,
        title: ep?.title || '',
        quoteCount: count,
      };
    })
    .sort((a, b) => b.quoteCount - a.quoteCount);
}

/**
 * Get all topic slugs (for sitemap generation)
 */
export function getAllTopicSlugs(): string[] {
  return TOPIC_PAGES.map(t => t.slug);
}
