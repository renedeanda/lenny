'use client';

import { useState, useMemo, useEffect, memo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, Clock, Eye, Calendar, Flame, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import InteractiveSpace from '@/components/InteractiveSpace';
import TopNav from '@/components/TopNav';
import { allEpisodes, getAllKeywords, searchEpisodes, sortEpisodes, SortOption, Episode } from '@/lib/allEpisodes';
import { getVerifiedEpisodeSlugs } from '@/lib/verifiedQuotes';
import { generateRecommendations, EpisodeAlignment } from '@/lib/recommendations';
import { QuizAnswers } from '@/lib/types';
import EpisodeRecommendationCard from '@/components/EpisodeRecommendationCard';

const STORAGE_KEY = 'lenny-explore-filters';
const EPISODES_PER_PAGE = 24;

// Helper to safely get initial state from localStorage
function getInitialState() {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export default function ExplorePage() {
  const router = useRouter();
  const initialState = getInitialState();
  const [searchQuery, setSearchQuery] = useState(initialState?.searchQuery || '');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialState?.selectedKeywords || []);
  const [sortBy, setSortBy] = useState<SortOption>(initialState?.sortBy || 'date-desc');
  const [showFilters, setShowFilters] = useState(initialState?.showFilters || false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRecommendations, setShowRecommendations] = useState(initialState?.showRecommendations ?? false);
  const [recommendations, setRecommendations] = useState<{ primary: EpisodeAlignment[], contrarian: EpisodeAlignment[] } | null>(null);
  const hasMounted = useRef(false);

  // Save to localStorage only after initial mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        searchQuery,
        selectedKeywords,
        sortBy,
        showFilters,
        showRecommendations
      }));
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }, [searchQuery, selectedKeywords, sortBy, showFilters, showRecommendations]);

  // Check if user has quiz results and generate recommendations
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('pm_quiz_answers');
      if (savedAnswers) {
        const answers: QuizAnswers = JSON.parse(savedAnswers);
        const answerCount = Object.keys(answers).length;
        if (answerCount >= 7) {
          const recs = generateRecommendations(answers);
          setRecommendations({ primary: recs.primary, contrarian: recs.contrarian });
          // Only show recommendations by default if user hasn't explicitly hidden them
          if (initialState?.showRecommendations === undefined) {
            setShowRecommendations(false); // Default to hidden
          }
        }
      }
    } catch (e) {
      console.error('Error loading recommendations:', e);
    }
  }, []);

  const allKeywords = useMemo(() => getAllKeywords(), []);

  // Precompute enrichment data once (avoids 302 lookups per render)
  const enrichedSlugs = useMemo(() => {
    const slugs = getVerifiedEpisodeSlugs();
    return new Set(slugs);
  }, []);

  const filteredAndSortedEpisodes = useMemo(() => {
    const filtered = searchEpisodes(searchQuery, { keywords: selectedKeywords });
    return sortEpisodes(filtered, sortBy);
  }, [searchQuery, selectedKeywords, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKeywords, sortBy]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Paginate results
  const totalPages = Math.ceil(filteredAndSortedEpisodes.length / EPISODES_PER_PAGE);
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
    const endIndex = startIndex + EPISODES_PER_PAGE;
    return filteredAndSortedEpisodes.slice(startIndex, endIndex);
  }, [filteredAndSortedEpisodes, currentPage]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedKeywords([]);
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2 text-amber text-xs tracking-wider">
              <Flame className="w-4 h-4" />
              <span>DATA EXPLORER</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-amber mb-4">
              299 EPISODES
            </h1>
            <p className="text-ash text-lg max-w-2xl leading-relaxed">
              Search, filter, and explore every conversation from Lenny's Podcast.
              Real insights from the world's best product leaders, builders, and founders.
            </p>

            {/* Recommendations Toggle */}
            {recommendations && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setShowRecommendations(!showRecommendations)}
                className={`mt-6 px-6 py-3 border-2 font-bold text-sm tracking-wider transition-all flex items-center gap-2 ${
                  showRecommendations
                    ? 'border-amber bg-amber text-void'
                    : 'border-amber/50 bg-amber/10 text-amber hover:border-amber'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {showRecommendations ? 'HIDE' : 'SHOW'} YOUR RECOMMENDATIONS
                <span className="text-xs opacity-75">
                  ({recommendations.primary.length + recommendations.contrarian.length})
                </span>
              </motion.button>
            )}

            {/* Take Quiz CTA for non-quiz takers */}
            {!recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 px-6 py-4 border border-amber/30 bg-amber/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber" />
                    <div>
                      <div className="text-sm font-bold text-amber">Get personalized recommendations</div>
                      <div className="text-xs text-ash-dark mt-1">Take the quiz to discover episodes that match your philosophy</div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/quiz')}
                    className="px-4 py-2 bg-amber text-void font-bold text-sm hover:bg-amber-dark transition-all whitespace-nowrap"
                  >
                    TAKE QUIZ →
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Recommendations Section */}
          {showRecommendations && recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 space-y-8"
            >
              {/* Primary Recommendations */}
              {recommendations.primary.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-amber mb-2">Episodes For You</h2>
                    <p className="text-ash-dark text-sm">Based on your quiz results, these episodes will resonate with how you work</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {recommendations.primary.slice(0, 4).map((episode, index) => (
                      <EpisodeRecommendationCard
                        key={episode.slug}
                        episode={episode}
                        index={index}
                        variant="primary"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Contrarian Recommendations */}
              {recommendations.contrarian.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-crimson mb-2">Perspectives to Explore</h2>
                    <p className="text-ash-dark text-sm">These episodes offer different viewpoints that might expand your thinking</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {recommendations.contrarian.slice(0, 2).map((episode, index) => (
                      <EpisodeRecommendationCard
                        key={episode.slug}
                        episode={episode}
                        index={index}
                        variant="contrarian"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t-2 border-ash-darker pt-8">
                <p className="text-center text-sm text-ash-dark">
                  Browse all episodes below or{' '}
                  <Link href="/results" className="text-amber hover:text-amber-dark transition-colors">
                    view your full results
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guests, topics, keywords..."
                  className="w-full bg-void-light border-2 border-ash-darker text-ash pl-12 pr-4 py-4
                           focus:border-amber focus:outline-none transition-colors
                           placeholder:text-ash-dark"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 border-2 transition-all flex items-center gap-2
                           ${showFilters
                      ? 'border-amber bg-amber/10 text-amber'
                      : 'border-ash-darker text-ash hover:border-amber hover:text-amber'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">FILTERS</span>
                  {selectedKeywords.length > 0 && (
                    <span className="bg-amber text-void rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {selectedKeywords.length}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-4 bg-void-light border-2 border-ash-darker text-ash
                           focus:border-amber focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="views-desc">Most Viewed</option>
                  <option value="duration-desc">Longest First</option>
                  <option value="guest-asc">Guest A-Z</option>
                </select>
              </div>
            </div>

            {/* Keyword Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-2 border-ash-darker bg-void-light p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-amber tracking-wider">FILTER BY TOPIC</div>
                    {selectedKeywords.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-crimson hover:text-crimson/80 transition-colors font-bold"
                      >
                        CLEAR ALL
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {allKeywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => toggleKeyword(keyword)}
                        className={`px-3 py-2 text-sm border-2 transition-all font-medium
                                 ${selectedKeywords.includes(keyword)
                            ? 'border-amber bg-amber text-void'
                            : 'border-ash-darker text-ash bg-void-light hover:border-amber hover:text-amber'
                          }`}
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-amber text-sm font-bold"
          >
            {filteredAndSortedEpisodes.length} episode{filteredAndSortedEpisodes.length !== 1 ? 's' : ''} found
          </motion.div>

          {/* Episodes Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedEpisodes.map((episode, index) => (
              <EpisodeCard
                key={episode.slug}
                episode={episode}
                index={index}
                selectedKeywords={selectedKeywords}
                hasEnrichment={enrichedSlugs.has(episode.slug)}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && filteredAndSortedEpisodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 md:p-3 border-2 border-ash-darker text-ash hover:border-amber hover:text-amber
                           transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-ash-darker disabled:hover:text-ash"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 md:px-4 md:py-2 border-2 font-bold transition-all text-sm
                                 ${currentPage === pageNum
                            ? 'border-amber bg-amber text-void'
                            : 'border-ash-darker text-ash hover:border-amber hover:text-amber'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 md:p-3 border-2 border-ash-darker text-ash hover:border-amber hover:text-amber
                           transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-ash-darker disabled:hover:text-ash"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="text-xs md:text-sm text-ash-dark font-mono">
                Page {currentPage} of {totalPages}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {filteredAndSortedEpisodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-xl text-ash mb-2">No episodes found</div>
              <div className="text-sm text-ash-dark mb-6">
                Try adjusting your search or filters
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-3 border-2 border-amber text-amber hover:bg-amber hover:text-void
                         transition-all font-bold"
              >
                CLEAR FILTERS
              </button>
            </motion.div>
          )}

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t-2 border-ash-darker text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{allEpisodes.length}</div>
                <div className="text-xs text-ash tracking-wider">TOTAL EPISODES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{allKeywords.length}</div>
                <div className="text-xs text-ash tracking-wider">UNIQUE TOPICS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">
                  {filteredAndSortedEpisodes.length}
                </div>
                <div className="text-xs text-ash tracking-wider">RESULTS SHOWN</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">
                  {selectedKeywords.length}
                </div>
                <div className="text-xs text-ash tracking-wider">ACTIVE FILTERS</div>
              </div>
            </div>
            <a
              href="https://github.com/ChatPRD/lennys-podcast-transcripts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ash-dark cursor-pointer hover:underline"
            >
              Data sourced from Lenny&apos;s Podcast transcripts
            </a>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

const EpisodeCard = memo(function EpisodeCard({
  episode,
  index,
  selectedKeywords,
  hasEnrichment
}: {
  episode: Episode;
  index: number;
  selectedKeywords: string[];
  hasEnrichment: boolean;
}) {
  return (
    <div
      className="border-2 border-ash-darker bg-void-light p-6 hover:border-amber
               transition-all group relative overflow-hidden"
    >
      {/* Hover Effect */}
      <div className="absolute top-0 right-0 w-2 h-full bg-amber opacity-0
                    group-hover:opacity-100 transition-opacity" />

      {/* Guest Name */}
      <div className="mb-3">
        <Link href={`/episodes/${episode.slug}`}>
          <h3 className="text-xl font-bold text-amber group-hover:text-amber-dark transition-colors leading-tight cursor-pointer">
            {episode.guest}
          </h3>
        </Link>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-ash-dark">
        {episode.publishDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">
              {new Date(episode.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        {episode.duration && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{episode.duration}</span>
          </div>
        )}
        {episode.viewCount && (
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span className="font-mono">{episode.viewCount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Title/Description */}
      <p className="text-sm text-ash-dark leading-relaxed mb-4 line-clamp-3">
        {episode.description || episode.title}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {episode.keywords.slice(0, 6).map((keyword) => (
          <span
            key={keyword}
            className={`px-2 py-1 text-xs border transition-colors font-medium
                     ${selectedKeywords.includes(keyword)
                ? 'border-amber bg-amber text-void'
                : 'border-ash-darker text-ash-dark bg-void'
              }`}
          >
            {keyword}
          </span>
        ))}
        {episode.keywords.length > 6 && (
          <span className="px-2 py-1 text-xs text-ash-dark font-mono">
            +{episode.keywords.length - 6}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-ash-dark mb-4 pt-4 border-t border-ash-darker">
        <div className="font-mono">
          <span className="text-amber">{episode.dialogueCount}</span> transcript segments
        </div>
        {hasEnrichment && (
          <div className="font-mono flex items-center gap-1">
            <span className="text-amber">✓</span> curated quotes
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href={`/episodes/${episode.slug}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-amber bg-amber/10 text-amber hover:bg-amber hover:text-void transition-all font-bold text-sm"
        >
          <Play className="w-4 h-4" />
          VIEW EPISODE
        </Link>
        {episode.youtubeUrl && (
          <a
            href={episode.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 border-2 border-ash-darker text-ash hover:border-amber hover:text-amber transition-all"
            title="Watch on YouTube"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
});
