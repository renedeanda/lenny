'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Quote, Shuffle, ChevronLeft, Search, X, Lightbulb, Zap, Clock } from 'lucide-react';
import InteractiveSpace from '@/components/InteractiveSpace';
import TopNav from '@/components/TopNav';
import { zones } from '@/lib/zones';
import { ZoneId } from '@/lib/types';
import { getAllVerifiedQuotes, getRegistryInfo, getAllTakeaways, getContrarianQuotes } from '@/lib/verifiedQuotes';
import {
  getFavoriteQuotes,
  toggleFavoriteQuote,
} from '@/lib/favorites';

type ContentTab = 'quotes' | 'takeaways' | 'contrarian';
const ZONE_IDS: ZoneId[] = ['velocity', 'perfection', 'discovery', 'data', 'intuition', 'alignment', 'chaos', 'focus'];
const ITEMS_PER_PAGE = 20;

export default function InsightsPage() {
  const [contentTab, setContentTab] = useState<ContentTab>('quotes');
  const [selectedZone, setSelectedZone] = useState<ZoneId | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteQuoteIds, setFavoriteQuoteIds] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [inspireQuote, setInspireQuote] = useState<ReturnType<typeof getAllVerifiedQuotes>[0] | null>(null);

  const allQuotes = useMemo(() => getAllVerifiedQuotes(), []);
  const allTakeaways = useMemo(() => getAllTakeaways(), []);
  const allContrarians = useMemo(() => getContrarianQuotes(), []);
  const registryInfo = useMemo(() => getRegistryInfo(), []);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = () => {
      const quoteIds = new Set(getFavoriteQuotes().map(f => f.quoteId));
      setFavoriteQuoteIds(quoteIds);
    };
    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  // Set initial inspire quote
  useEffect(() => {
    if (allQuotes.length > 0 && !inspireQuote) {
      const idx = Math.floor(Math.random() * allQuotes.length);
      setInspireQuote(allQuotes[idx]);
    }
  }, [allQuotes, inspireQuote]);

  // Shuffle inspire quote
  const shuffleInspire = useCallback(() => {
    if (allQuotes.length <= 1) return;
    let newIdx: number;
    let attempts = 0;
    do {
      newIdx = Math.floor(Math.random() * allQuotes.length);
      attempts++;
    } while (inspireQuote && allQuotes[newIdx].id === inspireQuote.id && attempts < 10);
    setInspireQuote(allQuotes[newIdx]);
  }, [allQuotes, inspireQuote]);

  // Filter quotes by zone, favorites, and search
  const filteredQuotes = useMemo(() => {
    let result = allQuotes;

    if (selectedZone === 'favorites') {
      result = result.filter(q => favoriteQuoteIds.has(q.id));
    } else if (selectedZone !== 'all') {
      result = result.filter(q => q.zones?.includes(selectedZone));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q =>
        q.text?.toLowerCase().includes(query) ||
        q.speaker?.toLowerCase().includes(query) ||
        q.themes?.some(t => t.toLowerCase().includes(query))
      );
    }

    return result;
  }, [allQuotes, selectedZone, favoriteQuoteIds, searchQuery]);

  // Filter takeaways by search
  const filteredTakeaways = useMemo(() => {
    if (!searchQuery.trim()) return allTakeaways;
    const query = searchQuery.toLowerCase();
    return allTakeaways.filter(t =>
      t.text.toLowerCase().includes(query) ||
      t.guest.toLowerCase().includes(query)
    );
  }, [allTakeaways, searchQuery]);

  // Filter contrarian takes by search
  const filteredContrarians = useMemo(() => {
    if (!searchQuery.trim()) return allContrarians;
    const query = searchQuery.toLowerCase();
    return allContrarians.filter(c =>
      c.quote.text.toLowerCase().includes(query) ||
      c.guest.toLowerCase().includes(query) ||
      c.why.toLowerCase().includes(query)
    );
  }, [allContrarians, searchQuery]);

  // Current filtered items based on active tab
  const currentFilteredCount = useMemo(() => {
    switch (contentTab) {
      case 'quotes': return filteredQuotes.length;
      case 'takeaways': return filteredTakeaways.length;
      case 'contrarian': return filteredContrarians.length;
    }
  }, [contentTab, filteredQuotes, filteredTakeaways, filteredContrarians]);

  // Paginated items
  const displayedQuotes = useMemo(() => filteredQuotes.slice(0, displayCount), [filteredQuotes, displayCount]);
  const displayedTakeaways = useMemo(() => filteredTakeaways.slice(0, displayCount), [filteredTakeaways, displayCount]);
  const displayedContrarians = useMemo(() => filteredContrarians.slice(0, displayCount), [filteredContrarians, displayCount]);

  const hasMore = displayCount < currentFilteredCount;

  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Reset pagination when filters or tab change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedZone, searchQuery, contentTab]);

  const handleToggleFavorite = (quote: typeof allQuotes[0]) => {
    const isFavorited = toggleFavoriteQuote({
      quoteId: quote.id,
      text: quote.text,
      speaker: quote.speaker,
      episodeSlug: quote.source.slug,
      timestamp: quote.timestamp
    });

    setFavoriteQuoteIds(prev => {
      const next = new Set(prev);
      if (isFavorited) {
        next.add(quote.id);
      } else {
        next.delete(quote.id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <InteractiveSpace />
      <TopNav />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors mb-6 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2 text-amber text-xs tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>CURATED INSIGHTS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-amber mb-3">
              {registryInfo.episodeCount} Curated Episodes
            </h1>
            <p className="text-ash text-base max-w-xl">
              {registryInfo.quoteCount.toLocaleString()} quotes, {allTakeaways.length.toLocaleString()} takeaways, and {allContrarians.length} contrarian takes — all verified from transcripts.
            </p>
          </motion.div>

          {/* Content Type Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex gap-1 border-b-2 border-ash-darker">
              <button
                onClick={() => setContentTab('quotes')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
                  contentTab === 'quotes'
                    ? 'border-amber text-amber'
                    : 'border-transparent text-ash-dark hover:text-ash'
                }`}
              >
                <Quote className="w-4 h-4" />
                Quotes
                <span className="text-xs opacity-60">{allQuotes.length}</span>
              </button>
              <button
                onClick={() => setContentTab('takeaways')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
                  contentTab === 'takeaways'
                    ? 'border-amber text-amber'
                    : 'border-transparent text-ash-dark hover:text-ash'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Takeaways
                <span className="text-xs opacity-60">{allTakeaways.length}</span>
              </button>
              <button
                onClick={() => setContentTab('contrarian')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
                  contentTab === 'contrarian'
                    ? 'border-rose-400 text-rose-400'
                    : 'border-transparent text-ash-dark hover:text-ash'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Contrarian Takes</span>
                <span className="sm:hidden">Contrarian</span>
                <span className="text-xs opacity-60">{allContrarians.length}</span>
              </button>
            </div>
          </motion.div>

          {/* Inspire Me Section — quotes tab only */}
          {contentTab === 'quotes' && inspireQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 border border-amber/30 bg-amber/5"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-amber text-xs tracking-wider flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  INSPIRE ME
                </span>
                <button
                  onClick={shuffleInspire}
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-amber text-amber text-sm hover:bg-amber hover:text-void transition-all active:scale-95"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline">SHUFFLE</span>
                </button>
              </div>
              <blockquote className="text-lg md:text-xl text-ash leading-relaxed mb-3">
                &ldquo;{inspireQuote.text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-amber font-bold">{inspireQuote.speaker}</span>
                  <Link
                    href={inspireQuote.timestamp
                      ? `/episodes/${inspireQuote.source.slug}?t=${inspireQuote.timestamp}`
                      : `/episodes/${inspireQuote.source.slug}`}
                    className="text-ash-dark hover:text-amber transition-colors ml-2 text-sm"
                  >
                    View Episode →
                  </Link>
                </div>
                <button
                  onClick={() => handleToggleFavorite(inspireQuote)}
                  className={`p-3 min-h-[44px] min-w-[44px] border transition-all ${
                    favoriteQuoteIds.has(inspireQuote.id)
                      ? 'border-rose-400 bg-rose-400/20 text-rose-400'
                      : 'border-ash-darker text-ash-dark hover:border-rose-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favoriteQuoteIds.has(inspireQuote.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber" />
              <input
                type="text"
                placeholder={
                  contentTab === 'quotes' ? 'Search quotes, speakers, themes...'
                  : contentTab === 'takeaways' ? 'Search takeaways, speakers...'
                  : 'Search contrarian takes, speakers...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-void-light border-2 border-ash-darker text-ash placeholder:text-ash-dark focus:border-amber focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-ash-dark hover:text-ash transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Zone Filter Pills — quotes tab only */}
          {contentTab === 'quotes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6 overflow-x-auto pb-2 -mx-4 px-4"
            >
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setSelectedZone('all')}
                  className={`px-4 py-2 min-h-[44px] border text-sm font-bold transition-all whitespace-nowrap ${
                    selectedZone === 'all'
                      ? 'border-amber bg-amber text-void'
                      : 'border-ash-darker text-ash hover:border-amber'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setSelectedZone('favorites')}
                  className={`px-4 py-2 min-h-[44px] border text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    selectedZone === 'favorites'
                      ? 'border-rose-400 bg-rose-400 text-void'
                      : 'border-ash-darker text-ash hover:border-rose-400'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  SAVED ({favoriteQuoteIds.size})
                </button>
                {ZONE_IDS.map(zoneId => {
                  const zone = zones[zoneId];
                  return (
                    <button
                      key={zoneId}
                      onClick={() => setSelectedZone(zoneId)}
                      className={`px-4 py-2 min-h-[44px] border text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                        selectedZone === zoneId
                          ? 'text-void'
                          : 'border-ash-darker text-ash hover:border-amber'
                      }`}
                      style={{
                        borderColor: selectedZone === zoneId ? zone.color : undefined,
                        backgroundColor: selectedZone === zoneId ? zone.color : undefined
                      }}
                    >
                      <span>{zone.icon}</span>
                      <span>{zone.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-4 text-sm text-ash-dark">
            {currentFilteredCount} {contentTab === 'quotes' ? 'quote' : contentTab === 'takeaways' ? 'takeaway' : 'take'}{currentFilteredCount !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {/* === QUOTES TAB === */}
          {contentTab === 'quotes' && (
            <div className="space-y-4">
              {displayedQuotes.map((quote, idx) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="p-4 border border-ash-darker bg-void-light hover:border-amber/50 transition-colors"
                >
                  <blockquote className="text-ash leading-relaxed mb-3">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-amber font-bold">{quote.speaker}</span>
                      <Link
                        href={quote.timestamp
                          ? `/episodes/${quote.source?.slug || ''}?t=${quote.timestamp}`
                          : `/episodes/${quote.source?.slug || ''}`}
                        className="text-ash-dark hover:text-amber transition-colors"
                      >
                        →
                      </Link>
                      {(quote.zones || []).slice(0, 1).map(zoneId => {
                        const zone = zones[zoneId];
                        if (!zone) return null;
                        return (
                          <span
                            key={zoneId}
                            className="px-2 py-0.5 text-xs border"
                            style={{ borderColor: zone.color, color: zone.color }}
                          >
                            {zone.icon} {zone.name}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(quote)}
                      className={`p-3 min-h-[44px] min-w-[44px] border transition-all ${
                        favoriteQuoteIds.has(quote.id)
                          ? 'border-rose-400 bg-rose-400/20 text-rose-400'
                          : 'border-ash-darker text-ash-dark hover:border-rose-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favoriteQuoteIds.has(quote.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* === TAKEAWAYS TAB === */}
          {contentTab === 'takeaways' && (
            <div className="space-y-4">
              {displayedTakeaways.map((takeaway, idx) => (
                <motion.div
                  key={`${takeaway.episodeSlug}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="p-4 border border-ash-darker bg-void-light hover:border-amber/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber/60 flex-shrink-0 mt-1" />
                    <p className="text-ash leading-relaxed">{takeaway.text}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber font-bold">{takeaway.guest}</span>
                    <Link
                      href={`/episodes/${takeaway.episodeSlug}`}
                      className="text-ash-dark hover:text-amber transition-colors"
                    >
                      View episode →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* === CONTRARIAN TAKES TAB === */}
          {contentTab === 'contrarian' && (
            <div className="space-y-4">
              {displayedContrarians.map((item, idx) => (
                <motion.div
                  key={`${item.quote.id}-contrarian`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="p-4 border border-ash-darker bg-void-light hover:border-rose-400/50 transition-colors"
                >
                  <blockquote className="text-ash leading-relaxed mb-3">
                    &ldquo;{item.quote.text}&rdquo;
                  </blockquote>
                  <div className="mb-3 px-3 py-2 bg-rose-400/5 border-l-2 border-rose-400/40">
                    <p className="text-sm text-ash-dark leading-relaxed">
                      <span className="text-rose-400 font-bold text-xs tracking-wider">WHY IT&apos;S CONTRARIAN</span>
                      <br />
                      {item.why}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber font-bold">{item.guest}</span>
                    <Link
                      href={item.quote.timestamp
                        ? `/episodes/${item.episodeSlug}?t=${item.quote.timestamp}`
                        : `/episodes/${item.episodeSlug}`}
                      className="text-ash-dark hover:text-amber transition-colors flex items-center gap-1"
                    >
                      {item.quote.timestamp && <Clock className="w-3 h-3" />}
                      {item.quote.timestamp || 'View episode'} →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {currentFilteredCount === 0 && (
            <div className="text-center py-16">
              <div className="text-xl text-ash mb-2">
                No {contentTab === 'quotes' ? 'quotes' : contentTab === 'takeaways' ? 'takeaways' : 'contrarian takes'} found
              </div>
              <div className="text-sm text-ash-dark mb-4">
                {selectedZone === 'favorites'
                  ? 'Click the heart icon on quotes to save them'
                  : 'Try a different search or filter'}
              </div>
              <button
                onClick={() => {
                  setSelectedZone('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 min-h-[48px] border border-amber text-amber hover:bg-amber hover:text-void transition-all font-bold"
              >
                SHOW ALL
              </button>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-8 py-4 min-h-[52px] border-2 border-amber text-amber hover:bg-amber hover:text-void transition-all font-bold"
              >
                LOAD MORE ({currentFilteredCount - displayCount} remaining)
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-ash-darker text-center text-sm text-ash-dark">
            <Link href="/explore" className="hover:text-amber transition-colors">
              ← Browse all episodes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
