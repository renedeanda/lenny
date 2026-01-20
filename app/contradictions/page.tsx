'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveSpace from '@/components/InteractiveSpace';
import { getRelevantContradictions, Selection, Contradiction } from '@/lib/contradictions';
import { ZoneId } from '@/lib/types';
import { Flame, Swords } from 'lucide-react';

function ContradictionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zone, setZone] = useState<ZoneId | null>(null);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const zoneParam = searchParams.get('zone') as ZoneId;
    const answersParam = searchParams.get('answers');

    if (!zoneParam || !answersParam) {
      router.push('/quiz');
      return;
    }

    setZone(zoneParam);
    setContradictions(getRelevantContradictions(zoneParam, 5));
  }, [searchParams, router]);

  const handleSelection = (selection: Selection) => {
    if (isTransitioning) return;

    const contradiction = contradictions[currentIndex];
    const updatedSelections = { ...selections, [contradiction.id]: selection };
    setSelections(updatedSelections);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentIndex < contradictions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      } else {
        // All contradictions complete - navigate to results
        const contradictionsParam = encodeURIComponent(JSON.stringify(updatedSelections));
        const answersParam = searchParams.get('answers');
        const nameParam = searchParams.get('name') || '';
        const roleParam = searchParams.get('role') || '';
        router.push(`/results?answers=${answersParam}&contradictions=${contradictionsParam}&name=${nameParam}&role=${roleParam}`);
      }
    }, 600);
  };

  if (!zone || contradictions.length === 0) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-amber text-xl animate-pulse">LOADING DEBATES...</div>
        </div>
      </main>
    );
  }

  const contradiction = contradictions[currentIndex];
  const progress = ((currentIndex + 1) / contradictions.length) * 100;

  return (
    <main className="min-h-screen bg-void text-ash overflow-hidden font-mono">
      <InteractiveSpace />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="h-1 bg-ash-darker/30">
          <motion.div
            className="h-full bg-gradient-to-r from-amber via-crimson to-amber"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-amber/60 text-sm">
            <Swords className="w-5 h-5" />
            <span>CONTRADICTION {currentIndex + 1} OF {contradictions.length}</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={contradiction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl space-y-8"
          >
            {/* Topic */}
            <div className="text-center space-y-4">
              <div className="text-6xl">{contradiction.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-ash">
                {contradiction.topic}
              </h2>
              <p className="text-sm text-amber/60">
                FROM THE TRANSCRIPTS: Two opposing viewpoints
              </p>
            </div>

            {/* Debate Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Side A */}
              <motion.button
                onClick={() => handleSelection('a')}
                className="group relative p-8 border-2 border-amber/30 hover:border-amber bg-void-light/50 backdrop-blur-sm text-left transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTransitioning}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-6">
                  {/* Position */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-amber pr-4">
                      {contradiction.sideA.position}
                    </h3>
                    <Flame className="w-6 h-6 text-amber flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-ash leading-relaxed italic border-l-2 border-amber/30 pl-4">
                    "{contradiction.sideA.quote}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="pt-4 border-t border-ash-darker/30 space-y-2">
                    <div className="font-semibold text-ash">{contradiction.sideA.guest}</div>
                    <div className="text-sm text-ash-dark">{contradiction.sideA.company}</div>
                    <div className="text-xs text-ash-darker">
                      Episode: {contradiction.sideA.episode}
                    </div>
                    {contradiction.sideA.episodeSlug && (
                      <a
                        href={`/episodes/${contradiction.sideA.episodeSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-amber/60 hover:text-amber transition-colors"
                      >
                        <span>View Full Episode →</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* Side B */}
              <motion.button
                onClick={() => handleSelection('b')}
                className="group relative p-8 border-2 border-crimson/30 hover:border-crimson bg-void-light/50 backdrop-blur-sm text-left transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTransitioning}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-6">
                  {/* Position */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-crimson pr-4">
                      {contradiction.sideB.position}
                    </h3>
                    <Flame className="w-6 h-6 text-crimson flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-ash leading-relaxed italic border-l-2 border-crimson/30 pl-4">
                    "{contradiction.sideB.quote}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="pt-4 border-t border-ash-darker/30 space-y-2">
                    <div className="font-semibold text-ash">{contradiction.sideB.guest}</div>
                    <div className="text-sm text-ash-dark">{contradiction.sideB.company}</div>
                    <div className="text-xs text-ash-darker">
                      Episode: {contradiction.sideB.episode}
                    </div>
                    {contradiction.sideB.episodeSlug && (
                      <a
                        href={`/episodes/${contradiction.sideB.episodeSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-crimson/60 hover:text-crimson transition-colors"
                      >
                        <span>View Full Episode →</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Both option */}
            <motion.button
              onClick={() => handleSelection('both')}
              className="w-full py-4 border border-ash-darker/30 hover:border-ash transition-colors text-ash-dark hover:text-ash disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              disabled={isTransitioning}
            >
              <span className="flex items-center justify-center gap-2">
                <span>⚖️</span>
                <span>Both perspectives matter (context-dependent)</span>
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function ContradictionsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-void flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-amber text-xl animate-pulse">LOADING...</div>
        </div>
      </main>
    }>
      <ContradictionsContent />
    </Suspense>
  );
}
