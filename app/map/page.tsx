'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import InteractiveSpace from '@/components/InteractiveSpace';
import { calculateZoneScores, getPrimaryZone, getTopZones } from '@/lib/scoring';
import { zones, getZoneEpisodePercentage, TOTAL_EPISODES } from '@/lib/zones';
import { QuizAnswers, ZoneId } from '@/lib/types';
import { ArrowRight, Flame, TrendingUp, Users, Radio } from 'lucide-react';

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [primaryZone, setPrimaryZone] = useState<ZoneId | null>(null);
  const [topZones, setTopZones] = useState<Array<{ zone: ZoneId; score: number; percentage: number }>>([]);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const answersParam = searchParams.get('answers');
    if (!answersParam) {
      router.push('/quiz');
      return;
    }

    try {
      const answers: QuizAnswers = JSON.parse(decodeURIComponent(answersParam));
      const scores = calculateZoneScores(answers);
      const zone = getPrimaryZone(scores);
      const top = getTopZones(scores, 3);

      setPrimaryZone(zone);
      setTopZones(top);

      // Reveal after animation
      setTimeout(() => setIsRevealed(true), 2000);
    } catch (error) {
      console.error('Error parsing answers:', error);
      router.push('/quiz');
    }
  }, [searchParams, router]);

  if (!primaryZone) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-amber text-xl animate-pulse">ANALYZING YOUR PHILOSOPHY...</div>
          <div className="text-ash-dark text-sm">Mapping across {TOTAL_EPISODES} episodes</div>
        </div>
      </main>
    );
  }

  const zoneData = zones[primaryZone];
  const episodePercentage = getZoneEpisodePercentage(zoneData);

  const handleContinue = () => {
    const answersParam = searchParams.get('answers');
    router.push(`/contradictions?answers=${answersParam}&zone=${primaryZone}`);
  };

  return (
    <main className="min-h-screen bg-void text-ash overflow-hidden font-mono">
      <InteractiveSpace />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen px-4 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-5xl space-y-12"
        >
          {/* Reveal animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            className="text-center space-y-8"
          >
            {/* Zone icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 200 }}
              className="text-8xl"
            >
              {zoneData.icon}
            </motion.div>

            {/* "You are here" */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-amber/60 text-sm tracking-widest mb-4"
              >
                PHILOSOPHY IDENTIFIED
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="text-5xl md:text-6xl font-bold mb-4"
                style={{ color: zoneData.color }}
              >
                {zoneData.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-xl md:text-2xl text-ash-dark italic"
              >
                "{zoneData.tagline}"
              </motion.p>
            </div>
          </motion.div>

          {/* Details reveal */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Description */}
              <div className="bg-void-light/50 border border-ash-darker/30 p-8 backdrop-blur-sm">
                <p className="text-lg text-ash leading-relaxed">
                  {zoneData.description}
                </p>
              </div>

              {/* Guest quote - THE DATA SURFACES HERE */}
              <div className="border-l-4 pl-6 py-4" style={{ borderColor: zoneData.color }}>
                <div className="flex items-start gap-4 mb-4">
                  <Flame className="w-5 h-5 text-amber flex-shrink-0 mt-1" />
                  <div className="text-sm text-amber/60">FROM THE TRANSCRIPTS</div>
                </div>
                <blockquote className="text-xl md:text-2xl text-ash leading-relaxed mb-4 italic">
                  "{zoneData.quote}"
                </blockquote>
                <div className="text-ash-dark">
                  <div className="font-semibold">{zoneData.quoteAuthor}</div>
                  <div className="text-sm text-ash-darker">Episode: {zoneData.episode}</div>
                </div>
              </div>

              {/* Stats - SURFACE THE EPISODE DATA */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-void-light/30 border border-ash-darker/30 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="w-4 h-4 text-amber" />
                    <div className="text-amber/60 text-xs">EPISODE COVERAGE</div>
                  </div>
                  <div className="text-3xl font-bold text-ash">{zoneData.episodeCount}</div>
                  <div className="text-sm text-ash-dark mt-1">
                    {episodePercentage}% of {TOTAL_EPISODES} episodes
                  </div>
                </div>

                <div className="bg-void-light/30 border border-ash-darker/30 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-amber" />
                    <div className="text-amber/60 text-xs">YOUR STRENGTH</div>
                  </div>
                  <div className="text-3xl font-bold text-amber">{topZones[0].percentage}%</div>
                  <div className="text-sm text-ash-dark mt-1">Primary philosophy match</div>
                </div>

                <div className="bg-void-light/30 border border-ash-darker/30 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber" />
                    <div className="text-amber/60 text-xs">ALIGNMENT</div>
                  </div>
                  <div className="text-3xl font-bold text-crimson">{topZones.length}</div>
                  <div className="text-sm text-ash-dark mt-1">Top philosophical zones</div>
                </div>
              </div>

              {/* Your balance - show all zones */}
              <div className="bg-void-light/50 border border-ash-darker/30 p-8 backdrop-blur-sm">
                <div className="text-amber mb-6 text-sm tracking-wider">YOUR PHILOSOPHY BALANCE</div>
                <div className="space-y-4">
                  {topZones.map(({ zone, percentage }) => {
                    const z = zones[zone];
                    return (
                      <div key={zone} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{z.icon}</span>
                            <span className="text-ash">{z.name}</span>
                          </span>
                          <span className="font-mono text-amber">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-ash-darker/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: z.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Associated guests - MORE DATA */}
              <div className="bg-void-light/50 border border-ash-darker/30 p-8 backdrop-blur-sm">
                <div className="text-amber mb-4 text-sm tracking-wider">LEADERS WHO THINK LIKE YOU</div>
                <div className="flex flex-wrap gap-3">
                  {zoneData.associatedGuests.map((guest) => (
                    <div
                      key={guest}
                      className="px-4 py-2 bg-ash-darker/30 border border-amber/20 hover:border-amber/50 transition-colors"
                    >
                      <span className="text-ash text-sm">{guest}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-ash-darker">
                  Based on analysis of their episodes from Lenny's Podcast
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-4 pt-8">
                <button
                  onClick={handleContinue}
                  className="group relative px-12 py-5 bg-void-light border-2 border-amber text-amber font-bold text-lg tracking-wide hover:bg-amber hover:text-void transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    FACE CONTRADICTIONS
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="text-ash-darker text-sm text-center">
                  See how your philosophy holds up against<br />
                  contradictory viewpoints from other leaders
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}


export default function MapPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-void flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-amber text-xl animate-pulse">LOADING...</div>
        </div>
      </main>
    }>
      <MapContent />
    </Suspense>
  );
}
