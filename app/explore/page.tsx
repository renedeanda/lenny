'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, Clock, Eye, Calendar, Flame, ExternalLink } from 'lucide-react';
import InteractiveSpace from '@/components/InteractiveSpace';
import { allEpisodes, getAllKeywords, searchEpisodes, sortEpisodes, SortOption } from '@/lib/episodesData';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  const allKeywords = useMemo(() => getAllKeywords(), []);

  const filteredAndSortedEpisodes = useMemo(() => {
    const filtered = searchEpisodes(searchQuery, selectedKeywords);
    return sortEpisodes(filtered, sortBy);
  }, [searchQuery, selectedKeywords, sortBy]);

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

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2 text-amber/60 text-xs tracking-wider">
              <Flame className="w-4 h-4" />
              <span>DATA EXPLORER</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-amber mb-4">
              303 EPISODES
            </h1>
            <p className="text-ash-dark text-lg max-w-2xl">
              Search, filter, and explore every conversation from Lenny's Podcast.
              Real insights from the world's best product leaders, builders, and founders.
            </p>
          </motion.div>

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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guests, topics, keywords..."
                  className="w-full bg-void-light border border-ash-darker text-ash pl-12 pr-4 py-4
                           focus:border-amber focus:outline-none transition-colors
                           placeholder:text-ash-darker"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 border transition-all flex items-center gap-2
                           ${showFilters
                             ? 'border-amber bg-amber/10 text-amber'
                             : 'border-ash-darker text-ash-dark hover:border-amber hover:text-amber'
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
                  className="px-4 py-4 bg-void-light border border-ash-darker text-ash
                           focus:border-amber focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="views-desc">Most Viewed</option>
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
                  className="border border-ash-darker bg-void-light p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-amber tracking-wider">FILTER BY TOPIC</div>
                    {selectedKeywords.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-crimson hover:text-crimson/80 transition-colors"
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
                        className={`px-3 py-1.5 text-sm border transition-all
                                 ${selectedKeywords.includes(keyword)
                                   ? 'border-amber bg-amber/20 text-amber'
                                   : 'border-ash-darker text-ash-dark hover:border-amber/50 hover:text-amber'
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
            className="mb-6 text-ash-dark text-sm"
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
            <AnimatePresence mode="popLayout">
              {filteredAndSortedEpisodes.map((episode, index) => (
                <motion.div
                  key={episode.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-ash-darker bg-void-light p-6 hover:border-amber
                           transition-all group relative overflow-hidden"
                >
                  {/* Hover Effect */}
                  <div className="absolute top-0 right-0 w-2 h-full bg-amber opacity-0
                                group-hover:opacity-100 transition-opacity" />

                  {/* Guest Name */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-amber group-hover:text-amber-dark transition-colors">
                      {episode.guest}
                    </h3>
                    {episode.youtubeUrl && (
                      <a
                        href={episode.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ash-darker hover:text-amber transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-ash-darker">
                    {episode.publishDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(episode.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    {episode.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {episode.duration}
                      </div>
                    )}
                    {episode.viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {episode.viewCount.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-ash leading-relaxed mb-4 line-clamp-4">
                    {episode.summary}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5">
                    {episode.keywords.slice(0, 4).map((keyword) => (
                      <span
                        key={keyword}
                        className={`px-2 py-0.5 text-xs border transition-colors
                                 ${selectedKeywords.includes(keyword)
                                   ? 'border-amber bg-amber/20 text-amber'
                                   : 'border-ash-darker text-ash-darker'
                                 }`}
                      >
                        {keyword}
                      </span>
                    ))}
                    {episode.keywords.length > 4 && (
                      <span className="px-2 py-0.5 text-xs text-ash-darker">
                        +{episode.keywords.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Listen CTA */}
                  <div className="mt-4 pt-4 border-t border-ash-darker">
                    <div className="flex items-center gap-2 text-amber text-sm group-hover:text-amber-dark transition-colors">
                      <Play className="w-4 h-4" />
                      <span>LISTEN TO EPISODE</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredAndSortedEpisodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-xl text-ash-dark mb-2">No episodes found</div>
              <div className="text-sm text-ash-darker mb-6">
                Try adjusting your search or filters
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-amber text-amber hover:bg-amber hover:text-void
                         transition-all"
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
            className="mt-16 pt-8 border-t border-ash-darker text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{allEpisodes.length}</div>
                <div className="text-xs text-ash-darker tracking-wider">TOTAL EPISODES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">{allKeywords.length}</div>
                <div className="text-xs text-ash-darker tracking-wider">UNIQUE TOPICS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">
                  {filteredAndSortedEpisodes.length}
                </div>
                <div className="text-xs text-ash-darker tracking-wider">RESULTS SHOWN</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber mb-1">
                  {selectedKeywords.length}
                </div>
                <div className="text-xs text-ash-darker tracking-wider">ACTIVE FILTERS</div>
              </div>
            </div>
            <div className="text-xs text-ash-darker">
              Data sourced from Lenny's Podcast transcripts
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
