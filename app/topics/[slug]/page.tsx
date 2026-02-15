'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Hash } from 'lucide-react';
import { TOPIC_PAGES, getQuotesForTopic, getEpisodesForTopic } from '@/lib/topics';
import TopNav from '@/components/TopNav';

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;

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

  // Get featured quotes (top 6 by diversity of speakers)
  const featuredQuotes = useMemo(() => {
    const seen = new Set<string>();
    return quotes.filter(q => {
      if (seen.has(q.speaker)) return false;
      seen.add(q.speaker);
      return true;
    }).slice(0, 6);
  }, [quotes]);

  // Related topics with their own pages
  const relatedTopics = useMemo(() =>
    TOPIC_PAGES.filter(t => topic.relatedTopics.includes(t.slug)),
    [topic]
  );

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <TopNav />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-12 md:pt-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/explore" className="text-ash-dark hover:text-amber transition-colors text-sm flex items-center gap-2" aria-label="Back to explore episodes">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Explore
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
          <h1 className="text-4xl md:text-6xl font-bold text-amber mb-4">
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

        {/* Featured Quotes */}
        {featuredQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-amber mb-6">Notable Quotes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredQuotes.map((quote, i) => (
                <Link
                  key={quote.id}
                  href={`/episodes/${quote.source.slug}`}
                  className="block border border-ash-darker bg-void-light p-5 hover:border-amber transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Quote className="w-4 h-4 text-amber/60 flex-shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-sm text-ash italic leading-relaxed">
                      &ldquo;{quote.text.length > 200 ? `${quote.text.substring(0, 197)}...` : quote.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber font-bold">{quote.speaker}</span>
                    {quote.timestamp && (
                      <span className="text-xs text-ash-dark flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {quote.timestamp}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Episodes covering this topic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-amber mb-6">
            Episodes on {topic.name}
          </h2>
          <div className="space-y-3">
            {episodes.slice(0, 20).map((ep, i) => (
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
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs text-ash-dark font-mono">{ep.quoteCount} quotes</span>
                  <ArrowRight className="w-4 h-4 text-ash-dark group-hover:text-amber transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          {episodes.length > 20 && (
            <p className="mt-4 text-sm text-ash-dark text-center">
              And {episodes.length - 20} more {episodes.length - 20 === 1 ? 'episode' : 'episodes'}...
            </p>
          )}
        </motion.div>

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-amber mb-6">Related Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedTopics.map(related => (
                <Link
                  key={related.slug}
                  href={`/topics/${related.slug}`}
                  className="p-4 border border-ash-darker bg-void-light text-center hover:border-amber transition-all group"
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
