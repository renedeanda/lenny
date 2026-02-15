'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Clock, ChevronDown } from 'lucide-react';
import { TOPIC_PAGES, getQuotesForTopic, getEpisodesForTopic } from '@/lib/topics';
import { trackTopicViewed, trackTopicLoadMore } from '@/lib/analytics';
import TopNav from '@/components/TopNav';

const EPISODES_PER_PAGE = 12;

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_PAGE);

  const topic = useMemo(() => TOPIC_PAGES.find(t => t.slug === slug), [slug]);
  const quotes = useMemo(() => getQuotesForTopic(slug), [slug]);
  const episodes = useMemo(() => getEpisodesForTopic(slug), [slug]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-void text-ash font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber mb-4">Topic Not Found</h1>
          <Link href="/explore" className="text-ash-dark hover:text-amber transition-colors">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  // Get featured quotes — prioritize primary-tagged quotes (first in array)
  // and diverse speakers. Primary quotes come first from getQuotesForTopic,
  // so taking unique speakers in order naturally favors primary-tagged ones.
  const featuredQuotes = useMemo(() => {
    const seen = new Set<string>();
    return quotes.filter(q => {
      if (seen.has(q.speaker)) return false;
      seen.add(q.speaker);
      return true;
    }).slice(0, 8);
  }, [quotes]);

  // Related topics with their own pages
  const relatedTopics = useMemo(() =>
    TOPIC_PAGES.filter(t => topic.relatedTopics.includes(t.slug)),
    [topic]
  );

  // Track topic page view
  useEffect(() => {
    if (topic) {
      trackTopicViewed(slug, quotes.length, episodes.length);
    }
  }, [slug, topic, quotes.length, episodes.length]);

  const visibleEpisodes = episodes.slice(0, visibleCount);
  const remainingCount = Math.max(0, episodes.length - visibleCount);
  const hasMore = remainingCount > 0;

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <TopNav />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-12 md:pt-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/topics" className="text-ash-dark hover:text-amber transition-colors text-sm flex items-center gap-2" aria-label="Browse all topics">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All Topics
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="text-xs text-ash-dark font-mono tracking-wider">TOPIC</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-amber mb-4">
            {topic.name}
          </h1>
          <p className="text-lg text-ash-dark leading-relaxed max-w-3xl">
            {topic.description}
          </p>
          <div className="flex gap-4 mt-4 text-sm text-ash-dark">
            <span className="px-3 py-1 border border-ash-darker">{quotes.length} quotes</span>
            <span className="px-3 py-1 border border-ash-darker">{episodes.length} episodes</span>
          </div>
        </motion.div>

        {/* Empty state when no quotes match */}
        {quotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 border border-ash-darker bg-void-light p-8 text-center"
          >
            <p className="text-ash-dark text-sm">
              No curated quotes match this topic yet. Check out the{' '}
              <Link href="/explore/insights" className="text-amber hover:underline">
                curated insights
              </Link>{' '}
              page for all available quotes.
            </p>
          </motion.div>
        )}

        {/* Featured Quotes */}
        {featuredQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-amber mb-6">Notable Quotes</h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {featuredQuotes.map((quote) => {
                const episodeUrl = quote.timestamp
                  ? `/episodes/${quote.source.slug}?t=${quote.timestamp}`
                  : `/episodes/${quote.source.slug}`;
                return (
                  <Link
                    key={quote.id}
                    href={episodeUrl}
                    className="block border border-ash-darker bg-void-light p-5 hover:border-amber transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Quote className="w-4 h-4 text-amber/60 flex-shrink-0 mt-1" aria-hidden="true" />
                      <p className="text-sm text-ash italic leading-relaxed break-words">
                        &ldquo;{quote.text}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber font-bold">{quote.speaker}</span>
                      {quote.timestamp && (
                        <span className="text-xs text-ash-dark flex items-center gap-1 group-hover:text-amber transition-colors">
                          <Clock className="w-3 h-3" />
                          {quote.timestamp}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Episodes covering this topic */}
        {episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber">
                Episodes on {topic.name}
              </h2>
              <span className="text-xs text-ash-dark font-mono">
                Showing {visibleEpisodes.length} of {episodes.length}
              </span>
            </div>
            <div className="space-y-3">
              {visibleEpisodes.map((ep, i) => (
                <Link
                  key={ep.slug}
                  href={`/episodes/${ep.slug}`}
                  className="flex items-center justify-between p-4 border border-ash-darker bg-void-light hover:border-amber transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ash group-hover:text-amber transition-colors">
                      {ep.guest}
                    </div>
                    <div className="text-sm text-ash-dark line-clamp-1">
                      {ep.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-4">
                    <span className="text-xs text-ash-dark font-mono">{ep.quoteCount} {ep.quoteCount === 1 ? 'quote' : 'quotes'}</span>
                    <ArrowRight className="w-4 h-4 text-ash-dark group-hover:text-amber transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <motion.button
                onClick={() => {
                  const nextPage = Math.floor(visibleCount / EPISODES_PER_PAGE) + 1;
                  trackTopicLoadMore(slug, nextPage);
                  setVisibleCount(prev => prev + EPISODES_PER_PAGE);
                }}
                className="mt-6 w-full p-4 border border-amber/30 bg-amber/5 text-amber font-mono text-sm hover:bg-amber/10 hover:border-amber/50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Show {Math.min(remainingCount, EPISODES_PER_PAGE)} more episodes
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-amber mb-6">Related Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {relatedTopics.map(related => (
                <Link
                  key={related.slug}
                  href={`/topics/${related.slug}`}
                  className="p-3 md:p-4 border border-ash-darker bg-void-light text-center hover:border-amber transition-all group"
                >
                  <div className="font-bold text-ash group-hover:text-amber transition-colors text-sm">
                    {related.name}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
