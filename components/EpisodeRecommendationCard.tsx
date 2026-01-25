'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { EpisodeAlignment } from '@/lib/recommendations';
import { ZoneId } from '@/lib/types';
import { trackRecommendationClicked } from '@/lib/analytics';

// Zone display names and colors
const ZONE_CONFIG: Record<ZoneId, { name: string; color: string }> = {
  velocity: { name: 'Speed', color: 'bg-amber/20 text-amber border-amber/40' },
  perfection: { name: 'Craft', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  discovery: { name: 'Discovery', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  data: { name: 'Data', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
  intuition: { name: 'Intuition', color: 'bg-pink-500/20 text-pink-400 border-pink-500/40' },
  alignment: { name: 'Alignment', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  chaos: { name: 'Adaptability', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  focus: { name: 'Focus', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
};

interface Props {
  episode: EpisodeAlignment;
  index: number;
  variant?: 'primary' | 'contrarian';
}

export default function EpisodeRecommendationCard({ episode, index, variant = 'primary' }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const isPrimary = variant === 'primary';
  const isContrarian = variant === 'contrarian';

  const handleCardClick = () => {
    const source = pathname?.includes('explore') ? 'explore' : 'results';
    trackRecommendationClicked(episode.slug, variant, source);
  };

  // Get the most relevant quote to display
  const displayQuote = episode.matchingQuotes?.[0];
  const quoteText = displayQuote?.text || '';
  const isLongQuote = quoteText.length > 150;

  // Get top 3 zones for this episode (sorted by influence)
  const topZones = Object.entries(episode.episodeZones || {})
    .filter(([_, value]) => value > 0.1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([zone]) => zone as ZoneId);

  // For contrarian cards, extract the "why" from the contrarian object
  const contrarianWhy = episode.contrarian?.why;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/episodes/${episode.slug}`}
        onClick={handleCardClick}
        className={`block p-6 border transition-all ${
          isContrarian
            ? 'border-rose-900/40 bg-rose-950/10 hover:border-rose-700/60 hover:bg-rose-950/20'
            : 'border-ash-darker bg-void-light hover:border-amber hover:bg-void'
        }`}
      >
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className={`text-xl font-bold transition-colors ${
              isContrarian
                ? 'text-rose-400 group-hover:text-rose-300'
                : 'text-amber group-hover:text-amber-dark'
            }`}>
              {episode.guest}
            </h3>
            {isPrimary && (
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
                RECOMMENDED
              </div>
            )}
            {isContrarian && (
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-rose-950/30 border border-rose-800/40 text-rose-400 text-xs font-mono">
                PERSPECTIVE
              </div>
            )}
          </div>
          <p className="text-sm text-ash-dark line-clamp-1">
            {episode.title}
          </p>

          {/* Zone Badges */}
          {topZones.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topZones.map(zone => (
                <span
                  key={zone}
                  className={`px-2 py-0.5 text-xs font-mono border ${ZONE_CONFIG[zone].color}`}
                >
                  {ZONE_CONFIG[zone].name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contrarian "Why" - Clean, separate from quote */}
        {isContrarian && contrarianWhy && (
          <p className="text-sm text-rose-300/80 mb-3 italic">
            {contrarianWhy}
          </p>
        )}

        {/* Quote Section with Expand/Collapse */}
        {quoteText && (
          <div className={`border-l-2 pl-4 mb-4 ${
            isContrarian ? 'border-rose-800/40' : 'border-amber/30'
          }`}>
            <div className="flex items-start gap-2">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-1 ${
                isContrarian ? 'text-rose-500/60' : 'text-amber/60'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ash italic">
                  {isExpanded || !isLongQuote
                    ? `"${quoteText}"`
                    : `"${quoteText.substring(0, 147)}..."`
                  }
                </p>
                {isLongQuote && (
                  <button
                    onClick={handleExpandClick}
                    className={`mt-2 flex items-center gap-1 text-xs font-mono transition-colors ${
                      isContrarian
                        ? 'text-rose-400/70 hover:text-rose-300'
                        : 'text-amber/70 hover:text-amber'
                    }`}
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Show more <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`flex items-center gap-2 text-sm font-mono group-hover:gap-3 transition-all ${
          isContrarian ? 'text-rose-400' : 'text-amber'
        }`}>
          <span>{isPrimary ? 'Listen to Episode' : 'Explore Perspective'}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
