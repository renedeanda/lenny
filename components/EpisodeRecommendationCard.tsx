'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Quote, Lightbulb } from 'lucide-react';
import { EpisodeAlignment } from '@/lib/recommendations';
import { ZoneId } from '@/lib/types';

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
  const isPrimary = variant === 'primary';
  const isContrarian = variant === 'contrarian';

  // Get the most relevant quote to display
  const displayQuote = episode.matchingQuotes?.[0];

  // Get top 3 zones for this episode (sorted by influence)
  const topZones = Object.entries(episode.episodeZones || {})
    .filter(([_, value]) => value > 0.1) // Only show zones with >10% influence
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([zone]) => zone as ZoneId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/episodes/${episode.slug}`}
        className={`block p-6 border-2 transition-all hover:bg-void ${
          isContrarian
            ? 'border-crimson/30 bg-crimson/5 hover:border-crimson'
            : 'border-ash-darker bg-void-light hover:border-amber'
        }`}
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-xl font-bold transition-colors ${
              isContrarian
                ? 'text-crimson group-hover:text-crimson/80'
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
              <div className="flex-shrink-0 ml-4 px-3 py-1 bg-crimson/10 border border-crimson/30 text-crimson text-xs font-mono">
                PERSPECTIVE
              </div>
            )}
          </div>
          <p className="text-sm text-ash-dark line-clamp-2">
            {episode.title}
          </p>

          {/* Zone Badges */}
          {topZones.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
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

        {/* Match Reason - Enhanced with quote snippets */}
        {episode.matchReason && (
          <div className={`mb-4 flex items-start gap-2 ${
            isContrarian ? 'text-crimson/80' : 'text-ash'
          }`}>
            {isContrarian && (
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed">
              {episode.matchReason}
            </p>
          </div>
        )}

        {/* Matching Quote Preview */}
        {displayQuote && displayQuote.text && (
          <div className={`border-l-2 pl-4 mb-4 ${
            isContrarian ? 'border-crimson/30' : 'border-amber/30'
          }`}>
            <div className="flex items-start gap-2">
              <Quote className={`w-4 h-4 flex-shrink-0 mt-1 ${
                isContrarian ? 'text-crimson' : 'text-amber'
              }`} />
              <p className="text-sm text-ash-dark italic line-clamp-3">
                "{displayQuote.text.length > 200
                  ? displayQuote.text.substring(0, 197) + '...'
                  : displayQuote.text}"
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`flex items-center gap-2 text-sm font-mono group-hover:gap-3 transition-all ${
          isContrarian ? 'text-crimson' : 'text-amber'
        }`}>
          <span>{isPrimary ? 'Listen to Episode' : 'Explore This Perspective'}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}
