'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hash, ArrowRight } from 'lucide-react';
import { TOPIC_PAGES, getQuotesForTopic, getEpisodesForTopic } from '@/lib/topics';
import TopNav from '@/components/TopNav';
import { useMemo } from 'react';

// Group topics by category for better browsing
const CATEGORIES: { label: string; slugs: string[] }[] = [
  {
    label: 'AI & Technology',
    slugs: ['AI', 'ai-strategy', 'ai-agents', 'ai-tools', 'future-of-work'],
  },
  {
    label: 'Strategy & Decision Making',
    slugs: ['strategy', 'decision-making', 'prioritization', 'first-principles', 'systems-thinking', 'positioning', 'vision'],
  },
  {
    label: 'Growth & Metrics',
    slugs: ['growth', 'product-market-fit', 'experimentation', 'metrics', 'retention', 'onboarding'],
  },
  {
    label: 'Leadership & Culture',
    slugs: ['leadership', 'culture', 'hiring', 'communication', 'storytelling', 'collaboration', 'trust', 'feedback'],
  },
  {
    label: 'Craft & Execution',
    slugs: ['execution', 'product-design', 'product-craft', 'innovation', 'iteration', 'simplicity', 'scaling'],
  },
  {
    label: 'Personal Growth',
    slugs: ['career-growth', 'resilience'],
  },
];

export default function TopicsPage() {
  const topicStats = useMemo(() => {
    const stats = new Map<string, { quotes: number; episodes: number }>();
    for (const topic of TOPIC_PAGES) {
      const quotes = getQuotesForTopic(topic.slug);
      const episodes = getEpisodesForTopic(topic.slug);
      stats.set(topic.slug, { quotes: quotes.length, episodes: episodes.length });
    }
    return stats;
  }, []);

  // Collect any topics not in the categories above
  const categorizedSlugs = new Set(CATEGORIES.flatMap(c => c.slugs));
  const uncategorized = TOPIC_PAGES.filter(t => !categorizedSlugs.has(t.slug));

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <TopNav />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-12 md:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="text-xs text-ash-dark font-mono tracking-wider">BROWSE</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-amber mb-4">
            Topics
          </h1>
          <p className="text-lg text-ash-dark leading-relaxed max-w-3xl">
            {TOPIC_PAGES.length} curated topics from Lenny&apos;s Podcast.
            Each page surfaces the best quotes and episodes for that theme.
          </p>
        </motion.div>

        {/* Categories */}
        {CATEGORIES.map((category, catIdx) => {
          const topics = category.slugs
            .map(s => TOPIC_PAGES.find(t => t.slug === s))
            .filter(Boolean) as typeof TOPIC_PAGES;

          if (topics.length === 0) return null;

          return (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIdx * 0.05 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-4 h-4 text-amber/60" aria-hidden="true" />
                <h2 className="text-sm text-amber font-bold tracking-wider uppercase">
                  {category.label}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topics.map(topic => {
                  const stats = topicStats.get(topic.slug);
                  return (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="group border border-ash-darker bg-void-light p-4 hover:border-amber transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-ash group-hover:text-amber transition-colors">
                          {topic.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-ash-dark group-hover:text-amber transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-ash-dark leading-relaxed line-clamp-2 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex gap-3 text-xs text-ash-darker">
                        <span>{stats?.quotes || 0} quotes</span>
                        <span>{stats?.episodes || 0} episodes</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Uncategorized topics (safety net) */}
        {uncategorized.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4 text-amber/60" aria-hidden="true" />
              <h2 className="text-sm text-amber font-bold tracking-wider uppercase">
                More Topics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {uncategorized.map(topic => {
                const stats = topicStats.get(topic.slug);
                return (
                  <Link
                    key={topic.slug}
                    href={`/topics/${topic.slug}`}
                    className="group border border-ash-darker bg-void-light p-4 hover:border-amber transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-ash group-hover:text-amber transition-colors">
                        {topic.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-ash-dark group-hover:text-amber transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-ash-dark leading-relaxed line-clamp-2 mb-3">
                      {topic.description}
                    </p>
                    <div className="flex gap-3 text-xs text-ash-darker">
                      <span>{stats?.quotes || 0} quotes</span>
                      <span>{stats?.episodes || 0} episodes</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
