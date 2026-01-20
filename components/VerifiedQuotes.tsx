'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote as QuoteIcon, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Quote, EpisodeEnrichment, ZoneId } from '@/lib/types';
import { zones } from '@/lib/zones';

interface VerifiedQuotesProps {
  enrichment: EpisodeEnrichment;
  onJumpToTranscript?: (lineStart: number) => void;
}

export default function VerifiedQuotes({ enrichment, onJumpToTranscript }: VerifiedQuotesProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Filter quotes by selected theme/zone
  const filteredQuotes = enrichment.keyQuotes.filter(quote => {
    if (selectedTheme && !quote.themes.includes(selectedTheme)) return false;
    if (selectedZone && !quote.zones.includes(selectedZone as ZoneId)) return false;
    return true;
  });

  // Get unique themes and zones from quotes
  const themes = Array.from(new Set(enrichment.keyQuotes.flatMap(q => q.themes)));
  const quoteZones = Array.from(new Set(enrichment.keyQuotes.flatMap(q => q.zones)));

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b-2 border-amber/20 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <QuoteIcon className="w-6 h-6 text-amber" />
          <h2 className="text-2xl font-bold text-amber">VERIFIED QUOTES</h2>
        </div>
        <p className="text-ash-dark text-sm">
          {enrichment.keyQuotes.length} verified quotes extracted from the transcript
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Theme Filter */}
        {themes.length > 0 && (
          <div>
            <label className="text-xs text-ash-dark uppercase tracking-wider mb-2 block">
              Filter by Theme
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTheme(null)}
                className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                  selectedTheme === null
                    ? 'bg-amber text-void'
                    : 'bg-void-light text-ash-dark hover:text-amber border border-ash-darker'
                }`}
              >
                All
              </button>
              {themes.map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme === selectedTheme ? null : theme)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                    theme === selectedTheme
                      ? 'bg-amber text-void'
                      : 'bg-void-light text-ash-dark hover:text-amber border border-ash-darker'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zone Filter */}
        {quoteZones.length > 0 && (
          <div>
            <label className="text-xs text-ash-dark uppercase tracking-wider mb-2 block">
              Philosophy Zone
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedZone(null)}
                className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                  selectedZone === null
                    ? 'bg-amber text-void'
                    : 'bg-void-light text-ash-dark hover:text-amber border border-ash-darker'
                }`}
              >
                All
              </button>
              {quoteZones.map(zoneId => {
                const zone = zones[zoneId as keyof typeof zones];
                return (
                  <button
                    key={zoneId}
                    onClick={() => setSelectedZone(zoneId === selectedZone ? null : zoneId)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                      zoneId === selectedZone
                        ? 'bg-amber text-void'
                        : 'bg-void-light text-ash-dark hover:text-amber border border-ash-darker'
                    }`}
                  >
                    {zone?.icon} {zone?.name.replace('The ', '').replace(' Nebula', '').replace(' Peak', '').replace(' Station', '').replace(' Constellation', '').replace(' Vortex', '').replace(' Galaxy', '').replace(' Cluster', '').replace(' Singularity', '')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quotes Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedTheme}-${selectedZone}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-4"
        >
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12 text-ash-dark">
              No quotes match the selected filters
            </div>
          ) : (
            filteredQuotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                index={index}
                onJumpToTranscript={onJumpToTranscript}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Takeaways */}
      {enrichment.takeaways.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-ash-darker">
          <div className="flex items-center gap-3 mb-6">
            <ChevronRight className="w-5 h-5 text-crimson" />
            <h3 className="text-xl font-bold text-amber">KEY TAKEAWAYS</h3>
          </div>
          <div className="space-y-4">
            {enrichment.takeaways.map((takeaway, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-void-light border border-ash-darker hover:border-amber/30 transition-colors"
              >
                <div className="text-amber font-bold text-sm flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p className="text-ash leading-relaxed">{takeaway}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface QuoteCardProps {
  quote: Quote;
  index: number;
  onJumpToTranscript?: (lineStart: number) => void;
}

function QuoteCard({ quote, index, onJumpToTranscript }: QuoteCardProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    const text = `"${quote.text}"\n\n— ${quote.speaker}\nLenny's Podcast`;
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleViewInTranscript = () => {
    if (onJumpToTranscript) {
      onJumpToTranscript(quote.source.lineStart);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative p-6 bg-void-light border-l-4 border-amber/30 hover:border-amber transition-all duration-300"
    >
      {/* Copy notification */}
      {showCopied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 px-3 py-1 bg-amber text-void text-xs font-bold"
        >
          COPIED
        </motion.div>
      )}

      {/* Quote Text */}
      <blockquote className="text-ash leading-relaxed mb-4 text-base">
        "{quote.text}"
      </blockquote>

      {/* Metadata */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 text-xs text-ash-dark">
          <div className="flex items-center gap-2">
            <span className="text-amber">—</span>
            <span className="font-semibold">{quote.speaker}</span>
          </div>
          {quote.timestamp && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{quote.timestamp}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewInTranscript}
            className="px-3 py-1 text-xs uppercase tracking-wider bg-void border border-ash-darker hover:border-amber hover:text-amber transition-colors"
          >
            View in Transcript
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs uppercase tracking-wider bg-void border border-ash-darker hover:border-amber hover:text-amber transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Themes/Zones Tags */}
      {(quote.themes.length > 0 || quote.zones.length > 0) && (
        <div className="mt-4 pt-4 border-t border-ash-darker flex flex-wrap gap-2">
          {quote.themes.map(theme => (
            <span
              key={theme}
              className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-void border border-ash-darker text-ash-dark"
            >
              {theme}
            </span>
          ))}
          {quote.zones.map(zoneId => {
            const zone = zones[zoneId as keyof typeof zones];
            return zone ? (
              <span
                key={zoneId}
                className="px-2 py-0.5 text-[10px] uppercase tracking-wider border text-ash-dark"
                style={{ borderColor: zone.color + '40', color: zone.color }}
              >
                {zone.icon} {zone.name.split(' ')[zone.name.split(' ').length - 1]}
              </span>
            ) : null;
          })}
        </div>
      )}
    </motion.div>
  );
}
