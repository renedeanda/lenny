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
  {
    slug: 'feedback',
    name: 'Feedback',
    description: "How top product leaders give and receive feedback effectively. Frameworks for radical candor, performance reviews, and building feedback loops from Lenny's Podcast.",
    relatedTopics: ['communication', 'leadership', 'collaboration', 'trust'],
  },
  {
    slug: 'vision',
    name: 'Product Vision',
    description: "Crafting and communicating a compelling product vision. How the best PMs align teams around a shared future from Lenny's Podcast guests.",
    relatedTopics: ['strategy', 'leadership', 'storytelling', 'differentiation'],
  },
  {
    slug: 'onboarding',
    name: 'User Onboarding',
    description: "Designing great user onboarding experiences that drive activation and retention. Tactics and frameworks from growth experts on Lenny's Podcast.",
    relatedTopics: ['retention', 'growth', 'user-experience', 'product-design'],
  },
  {
    slug: 'positioning',
    name: 'Positioning',
    description: "Product positioning, messaging, and finding your category. How top product marketers differentiate their products, from Lenny's Podcast.",
    relatedTopics: ['differentiation', 'storytelling', 'strategy', 'competition'],
  },
  {
    slug: 'simplicity',
    name: 'Simplicity',
    description: "The art of simplicity in product design and strategy. How the best product teams reduce complexity and focus on what matters, from Lenny's Podcast.",
    relatedTopics: ['focus', 'product-design', 'craft', 'quality'],
  },
  {
    slug: 'collaboration',
    name: 'Collaboration',
    description: "Cross-functional collaboration between product, design, and engineering. How great teams work together from Lenny's Podcast guests.",
    relatedTopics: ['alignment', 'communication', 'team-building', 'trust'],
  },
  {
    slug: 'resilience',
    name: 'Resilience',
    description: "Building resilience as a product leader. How top PMs and founders navigate failure, setbacks, and uncertainty from Lenny's Podcast.",
    relatedTopics: ['mindset', 'failure', 'self-awareness', 'growth-mindset'],
  },
  {
    slug: 'iteration',
    name: 'Iteration',
    description: "The power of rapid iteration in product development. How the best teams ship fast, learn faster, and continuously improve from Lenny's Podcast.",
    relatedTopics: ['velocity', 'experimentation', 'execution', 'shipping'],
  },
  {
    slug: 'trust',
    name: 'Building Trust',
    description: "Building trust with users, teams, and stakeholders. How great product leaders earn and maintain trust from Lenny's Podcast guests.",
    relatedTopics: ['leadership', 'collaboration', 'communication', 'culture'],
  },
  {
    slug: 'first-principles',
    name: 'First Principles',
    description: "Thinking from first principles in product management. How top leaders break down problems and challenge assumptions, from Lenny's Podcast.",
    relatedTopics: ['decision-making', 'strategy', 'innovation', 'contrarian'],
  },
  {
    slug: 'ai-strategy',
    name: 'AI Strategy',
    description: "How product leaders think about AI strategy, adoption, and integrating AI into their products. Strategic frameworks for the AI era from Lenny's Podcast.",
    relatedTopics: ['AI', 'ai-product-strategy', 'ai-adoption', 'strategy'],
  },
  {
    slug: 'ai-agents',
    name: 'AI Agents',
    description: "Building and deploying AI agents in products. How product teams approach agentic AI, autonomous workflows, and the future of AI-powered products from Lenny's Podcast.",
    relatedTopics: ['agents', 'AI', 'ai-workflows', 'automation'],
  },
  {
    slug: 'ai-tools',
    name: 'AI Tools & Workflows',
    description: "Using AI tools to supercharge product development workflows. How PMs and builders leverage AI for productivity, coding, and decision-making from Lenny's Podcast.",
    relatedTopics: ['AI', 'ai-workflows', 'automation', 'productivity'],
  },
  {
    slug: 'future-of-work',
    name: 'Future of Work',
    description: "How AI and technology are reshaping product management and the workplace. Perspectives on the future of PM, remote work, and human-AI collaboration from Lenny's Podcast.",
    relatedTopics: ['AI', 'automation', 'ai-vs-human', 'future'],
  },
  {
    slug: 'product-craft',
    name: 'Product Craft & Taste',
    description: "Developing product taste and craft — the intangible skill that separates great PMs from good ones. How top product leaders think about quality, detail, and design intuition from Lenny's Podcast.",
    relatedTopics: ['craft', 'quality', 'product-design', 'simplicity'],
  },
  {
    slug: 'systems-thinking',
    name: 'Systems Thinking',
    description: "Thinking in systems as a product manager. How the best PMs see connections, second-order effects, and design holistic solutions from Lenny's Podcast guests.",
    relatedTopics: ['first-principles', 'mental-models', 'frameworks', 'decision-making'],
  },
];

// --- Performance: Module-level caches ---
// Build inverted index once: theme -> quotes
let _themeIndex: Map<string, Quote[]> | null = null;
// Build episode lookup once: slug -> episode
let _episodeMap: Map<string, { guest: string; title: string }> | null = null;

function getThemeIndex(): Map<string, Quote[]> {
  if (_themeIndex) return _themeIndex;
  _themeIndex = new Map();
  const allQuotes = getAllVerifiedQuotes();
  for (const quote of allQuotes) {
    for (const theme of quote.themes) {
      const existing = _themeIndex.get(theme);
      if (existing) {
        existing.push(quote);
      } else {
        _themeIndex.set(theme, [quote]);
      }
    }
  }
  return _themeIndex;
}

function getEpisodeMap(): Map<string, { guest: string; title: string }> {
  if (_episodeMap) return _episodeMap;
  _episodeMap = new Map();
  for (const ep of allEpisodes) {
    _episodeMap.set(ep.slug, { guest: ep.guest, title: ep.title });
  }
  return _episodeMap;
}

/**
 * Get quotes for a given topic (matches theme name or related topics).
 * Primary-tagged quotes (directly tagged with topic slug) are returned first,
 * then related-topic quotes. This ensures each topic page has distinct
 * featured quotes rather than the same quotes appearing everywhere.
 * Uses inverted index for O(themes) instead of O(all_quotes).
 */
export function getQuotesForTopic(topicSlug: string): Quote[] {
  const topic = TOPIC_PAGES.find(t => t.slug === topicSlug);
  if (!topic) return [];

  const themeIndex = getThemeIndex();

  // Phase 1: Collect primary quotes (directly tagged with this topic slug)
  const seen = new Set<string>();
  const primary: Quote[] = [];
  const primaryQuotes = themeIndex.get(topicSlug);
  if (primaryQuotes) {
    for (const q of primaryQuotes) {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        primary.push(q);
      }
    }
  }

  // Phase 2: Collect related quotes (from relatedTopics, excluding duplicates)
  const related: Quote[] = [];
  for (const theme of topic.relatedTopics) {
    const quotes = themeIndex.get(theme);
    if (!quotes) continue;
    for (const q of quotes) {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        related.push(q);
      }
    }
  }

  // Return primary first, then related — ensures featured quotes are distinct
  return [...primary, ...related];
}

/**
 * Get episodes that are most relevant to a topic
 * Uses episode map for O(1) lookups instead of O(n) find()
 */
export function getEpisodesForTopic(topicSlug: string): Array<{
  slug: string;
  guest: string;
  title: string;
  quoteCount: number;
}> {
  const quotes = getQuotesForTopic(topicSlug);
  const episodeMap = getEpisodeMap();

  // Count quotes per episode
  const episodeCounts = new Map<string, number>();
  for (const quote of quotes) {
    const slug = quote.source.slug;
    episodeCounts.set(slug, (episodeCounts.get(slug) || 0) + 1);
  }

  // Map to episode data and sort by quote count
  return Array.from(episodeCounts.entries())
    .map(([slug, count]) => {
      const ep = episodeMap.get(slug);
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
