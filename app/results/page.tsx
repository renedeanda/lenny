'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { calculateZoneScores, getZonePercentages } from '@/lib/scoring';
import { zones, getZoneEpisodePercentage, TOTAL_EPISODES } from '@/lib/zones';
import { contradictions } from '@/lib/contradictions';
import { QuizAnswers, ZoneId } from '@/lib/types';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { answers, contradictionSelections, userName, userRole } = useMemo(() => {
    const answersParam = searchParams.get('answers');
    const contradictionsParam = searchParams.get('contradictions');
    const nameParam = searchParams.get('name');
    const roleParam = searchParams.get('role');

    return {
      answers: answersParam ? JSON.parse(decodeURIComponent(answersParam)) as QuizAnswers : {},
      contradictionSelections: contradictionsParam ? JSON.parse(decodeURIComponent(contradictionsParam)) : {},
      userName: nameParam || localStorage.getItem('pm_map_name') || 'Your',
      userRole: roleParam || localStorage.getItem('pm_map_role') || 'Product Manager'
    };
  }, [searchParams]);

  const zoneScores = useMemo(() => calculateZoneScores(answers), [answers]);
  const zonePercentages = useMemo(() => getZonePercentages(zoneScores), [zoneScores]);

  // Get primary zone (highest score)
  const primaryZoneId = useMemo(() => {
    return Object.entries(zonePercentages).reduce((a, b) =>
      zonePercentages[a[0] as ZoneId] > zonePercentages[b[0] as ZoneId] ? a : b
    )[0] as ZoneId;
  }, [zonePercentages]);

  // Get secondary zone (second highest)
  const secondaryZoneId = useMemo(() => {
    const sorted = Object.entries(zonePercentages)
      .sort((a, b) => zonePercentages[b[0] as ZoneId] - zonePercentages[a[0] as ZoneId]);
    return sorted[1][0] as ZoneId;
  }, [zonePercentages]);

  // Get blind spot (lowest score)
  const blindSpotZoneId = useMemo(() => {
    return Object.entries(zonePercentages).reduce((a, b) =>
      zonePercentages[a[0] as ZoneId] < zonePercentages[b[0] as ZoneId] ? a : b
    )[0] as ZoneId;
  }, [zonePercentages]);

  const primaryZone = zones[primaryZoneId];
  const secondaryZone = zones[secondaryZoneId];
  const blindSpotZone = zones[blindSpotZoneId];

  // Safe default for optional data
  const episodeCount = primaryZone.episodeCount ?? 0;

  const handleDownload = async () => {
    const cardElement = document.getElementById('philosophy-card');
    if (!cardElement) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `${userName.replace(/\s+/g, '-')}-pm-philosophy.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert('Link copied to clipboard!');
  };

  const handleRetake = () => {
    router.push('/');
  };

  const handleViewMap = () => {
    router.push(`/map?answers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  return (
    <div className="min-h-screen bg-void text-ash p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-ash-darker font-mono tracking-wider">
            ANALYSIS COMPLETE
          </div>
          <div className="text-xs text-amber font-mono">
            BASED ON 303 EPISODES
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-amber mb-2 font-mono">
          {userName !== 'Your' ? `${userName}'s` : 'YOUR'} PM PHILOSOPHY
        </h1>
        <div className="text-ash-dark font-mono text-sm">
          Derived from {Object.keys(answers).length} existential questions + {Object.keys(contradictionSelections).length} contradictions
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Primary Zone Card - Downloadable */}
        <motion.div
          id="philosophy-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-amber bg-void-light p-8 relative overflow-hidden group"
        >
          {/* User badge */}
          {userName !== 'Your' && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
              {userName} • {userRole}
            </div>
          )}
          <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
            {primaryZone.icon}
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="text-5xl">{primaryZone.icon}</div>
            <div>
              <div className="text-xs text-amber font-mono mb-1">PRIMARY PHILOSOPHY</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber mb-2">
                {primaryZone.name}
              </h2>
              <div className="text-xl text-ash-dark italic mb-4">
                "{primaryZone.tagline}"
              </div>
            </div>
          </div>

          <p className="text-lg text-ash leading-relaxed mb-6">
            {primaryZone.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ash-darker">
            <div>
              <div className="text-2xl font-bold text-amber font-mono">
                {zonePercentages[primaryZoneId]}%
              </div>
              <div className="text-xs text-ash-darker font-mono">ALIGNMENT</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber font-mono">
                {episodeCount}
              </div>
              <div className="text-xs text-ash-darker font-mono">EPISODES</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber font-mono">
                {getZoneEpisodePercentage(primaryZone)}%
              </div>
              <div className="text-xs text-ash-darker font-mono">OF CATALOG</div>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Superpower & Blind Spot */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-ash-darker bg-void-light p-6"
            >
              <h3 className="text-xs text-amber font-mono mb-4 tracking-wider">
                🔥 YOUR SUPERPOWER
              </h3>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{primaryZone.icon}</span>
                  <div className="text-xl font-bold text-amber">
                    {primaryZone.name}
                  </div>
                </div>
                <p className="text-sm text-ash-dark">
                  {primaryZone.tagline}
                </p>
              </div>

              <h3 className="text-xs text-crimson font-mono mb-4 tracking-wider">
                ⚠️ YOUR BLIND SPOT
              </h3>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl opacity-50">{blindSpotZone.icon}</span>
                  <div className="text-xl font-bold text-ash-dark">
                    {blindSpotZone.name}
                  </div>
                </div>
                <p className="text-sm text-ash-dark">
                  You might undervalue: {blindSpotZone.tagline.toLowerCase()}
                </p>
              </div>
            </motion.div>

            {/* From the Transcripts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-ash-darker bg-void-light p-6"
            >
              <h3 className="text-xs text-amber font-mono mb-4 tracking-wider flex items-center gap-2">
                🔥 FROM THE TRANSCRIPTS
              </h3>
              <blockquote className="text-lg text-ash leading-relaxed mb-4 italic border-l-2 border-amber pl-4">
                "{primaryZone.quote}"
              </blockquote>
              <div className="text-ash-dark">
                <div className="font-semibold text-amber">{primaryZone.quoteAuthor}</div>
                <div className="text-sm text-ash-darker">Episode: {primaryZone.episode}</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Philosophy Balance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-ash-darker bg-void-light p-6"
            >
              <h3 className="text-xs text-amber font-mono mb-4 tracking-wider">
                PHILOSOPHY BALANCE
              </h3>
              <div className="space-y-3">
                {Object.entries(zonePercentages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([zoneId, percentage], index) => {
                    const zone = zones[zoneId as ZoneId];
                    const isPrimary = zoneId === primaryZoneId;
                    const isSecondary = zoneId === secondaryZoneId;

                    return (
                      <div key={zoneId}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={isPrimary ? 'text-xl' : 'text-sm opacity-70'}>
                              {zone.icon}
                            </span>
                            <span className={`text-sm font-mono ${isPrimary ? 'text-amber font-bold' : isSecondary ? 'text-ash' : 'text-ash-dark'}`}>
                              {zone.name}
                            </span>
                          </div>
                          <span className={`text-sm font-mono ${isPrimary ? 'text-amber font-bold' : 'text-ash-dark'}`}>
                            {percentage}%
                          </span>
                        </div>
                        <motion.div
                          className="h-1.5 bg-ash-darker rounded-full overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <motion.div
                            className={`h-full rounded-full ${isPrimary ? 'bg-amber' : isSecondary ? 'bg-amber/60' : 'bg-ash-darker'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.5 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                          />
                        </motion.div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>

            {/* Leaders Who Think Like You */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-ash-darker bg-void-light p-6"
            >
              <h3 className="text-xs text-amber font-mono mb-4 tracking-wider">
                LEADERS WHO THINK LIKE YOU
              </h3>
              <div className="flex flex-wrap gap-2">
                {primaryZone.associatedGuests.map((guest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-3 py-1.5 bg-ash-darker border border-amber/30 text-ash text-sm font-mono hover:border-amber hover:text-amber transition-all cursor-default"
                  >
                    {guest}
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-ash-darker">
                <div className="text-xs text-ash-darker font-mono">
                  + {Math.max(episodeCount - primaryZone.associatedGuests.length, 0)} more guests across {episodeCount} episodes
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contradiction Stances */}
        {Object.keys(contradictionSelections).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border border-ash-darker bg-void-light p-6"
          >
            <h3 className="text-xs text-amber font-mono mb-4 tracking-wider">
              YOUR CONTRADICTION STANCES
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(contradictionSelections).map(([contradictionId, selection]: [string, any]) => {
                const contradiction = contradictions.find(c => c.id === contradictionId);
                if (!contradiction) return null;

                const isBothSides = selection === 'both';
                const selectedSide = isBothSides ? null : selection;

                return (
                  <div key={contradictionId} className="border border-ash-darker p-4">
                    <div className="text-sm font-bold text-amber mb-2">
                      {contradiction.topic}
                    </div>
                    {isBothSides ? (
                      <div className="text-sm text-ash-dark italic">
                        ⚖️ You see value in both perspectives
                      </div>
                    ) : (
                      <div className="text-sm text-ash">
                        <span className={selectedSide === 'a' ? 'text-amber' : 'text-crimson'}>
                          {selectedSide === 'a' ? '←' : '→'}
                        </span>
                        {' '}
                        {selectedSide === 'a' ? contradiction.sideA.guest : contradiction.sideB.guest}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center pt-8"
        >
          <button
            onClick={handleDownload}
            className="px-8 py-4 bg-amber text-void font-mono font-bold hover:bg-amber-dark transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>📥</span>
            DOWNLOAD YOUR CARD
          </button>
          <button
            onClick={handleCopyLink}
            className="px-8 py-4 border-2 border-amber text-amber font-mono font-bold hover:bg-amber hover:text-void transition-all hover:scale-105 active:scale-95"
          >
            COPY LINK TO SHARE
          </button>
          <button
            onClick={handleViewMap}
            className="px-8 py-4 border-2 border-amber text-amber font-mono font-bold hover:bg-amber hover:text-void transition-all hover:scale-105 active:scale-95"
          >
            VIEW YOUR MAP
          </button>
          <button
            onClick={handleExplore}
            className="px-8 py-4 border-2 border-ash-darker text-ash font-mono font-bold hover:bg-ash-darker hover:text-void transition-all hover:scale-105 active:scale-95"
          >
            EXPLORE ALL EPISODES
          </button>
          <button
            onClick={handleRetake}
            className="px-8 py-4 border border-ash-darker text-ash-dark font-mono hover:text-ash hover:border-ash transition-all"
          >
            RETAKE QUIZ
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-8 border-t border-ash-darker mt-12"
        >
          <div className="text-xs text-ash-darker font-mono">
            Based on analysis of 303 episodes of Lenny's Podcast
          </div>
          <div className="text-xs text-ash-darker font-mono mt-2">
            Built with 🔥 for the PM community
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void text-ash flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔥</div>
          <div className="text-ash-dark font-mono text-sm">Analyzing your philosophy...</div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
