'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { generateRecommendations, getBlindSpotDescription } from '@/lib/recommendations';
import { zones } from '@/lib/zones';
import { QuizAnswers, ZoneId } from '@/lib/types';
import PhilosophyInsightCard from '@/components/PhilosophyInsightCard';
import EpisodeRecommendationCard from '@/components/EpisodeRecommendationCard';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { answers, userName } = useMemo(() => {
    let answersParam = searchParams.get('answers');
    const nameParam = searchParams.get('name');

    // Try localStorage if not in URL
    if (!answersParam) {
      answersParam = localStorage.getItem('pm_quiz_answers');
    }

    return {
      answers: answersParam ? JSON.parse(decodeURIComponent(answersParam)) as QuizAnswers : {},
      userName: nameParam || localStorage.getItem('pm_map_name') || 'Your'
    };
  }, [searchParams]);

  // Generate recommendations using new algorithm
  const recommendations = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;
    return generateRecommendations(answers);
  }, [answers]);

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
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleRetake = () => {
    router.push('/');
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-void text-ash flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber mb-4">No quiz answers found</h1>
          <p className="text-ash-dark mb-6">Take the quiz to discover your philosophy</p>
          <button
            onClick={handleRetake}
            className="px-8 py-4 border-2 border-amber text-amber font-mono font-bold hover:bg-amber hover:text-void transition-all"
          >
            TAKE THE QUIZ
          </button>
        </div>
      </div>
    );
  }

  const { userProfile, primary, contrarian } = recommendations;

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
            BASED ON 7 QUESTIONS
          </div>
          <div className="text-xs text-amber font-mono">
            {primary.length + contrarian.length} EPISODE{primary.length + contrarian.length !== 1 ? 'S' : ''} MATCHED
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-amber mb-2">
          {userName !== 'Your' ? `${userName}'s` : 'Your'} Product Philosophy
        </h1>
        <p className="text-ash-dark text-lg">
          And the podcast episodes that match how you work
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Personal Philosophy Summary */}
        <div id="philosophy-card">
          <PhilosophyInsightCard userProfile={userProfile} />
        </div>

        {/* Primary Recommendations */}
        {primary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-amber mb-2">
                Episodes For You
              </h2>
              <p className="text-ash-dark">
                Based on your philosophy, these episodes will resonate with how you work
              </p>
            </div>

            <div className="grid gap-6">
              {primary.map((episode, index) => (
                <EpisodeRecommendationCard
                  key={episode.slug}
                  episode={episode}
                  index={index}
                  variant="primary"
                />
              ))}
            </div>

            {primary.length < 5 && (
              <div className="mt-4 p-4 border border-ash-darker bg-void-light">
                <p className="text-sm text-ash-dark">
                  More episodes coming soon! We're currently building a library of {primary.length} curated episodes.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Contrarian Recommendations */}
        {contrarian.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-crimson mb-2">
                Perspectives to Explore
              </h2>
              <p className="text-ash-dark">
                {getBlindSpotDescription(userProfile.blindSpotZone)}
              </p>
            </div>

            <div className="grid gap-6">
              {contrarian.map((episode, index) => (
                <EpisodeRecommendationCard
                  key={episode.slug}
                  episode={episode}
                  index={index}
                  variant="contrarian"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Philosophy Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border border-ash-darker bg-void-light p-6"
        >
          <h3 className="text-xl font-bold text-amber mb-4">Your Philosophy Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(userProfile.zonePercentages)
              .sort((a, b) => b[1] - a[1])
              .map(([zoneId, percentage], index) => {
                const zone = zones[zoneId as ZoneId];
                const isPrimary = zoneId === userProfile.primaryZone;

                return (
                  <div key={zoneId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={isPrimary ? 'text-xl' : 'text-sm opacity-70'}>
                          {zone.icon}
                        </span>
                        <span className={`text-sm font-mono ${isPrimary ? 'text-amber font-bold' : 'text-ash-dark'}`}>
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
                      transition={{ delay: 0.8 + index * 0.05 }}
                    >
                      <motion.div
                        className={`h-full rounded-full ${isPrimary ? 'bg-amber' : 'bg-ash-darker'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.9 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                      />
                    </motion.div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center pt-8"
        >
          <button
            onClick={handleDownload}
            className="px-8 py-4 bg-amber text-void font-mono font-bold hover:bg-amber-dark transition-all hover:scale-105 active:scale-95"
          >
            📥 DOWNLOAD YOUR RESULTS
          </button>
          <button
            onClick={handleCopyLink}
            className="px-8 py-4 border-2 border-amber text-amber font-mono font-bold hover:bg-amber hover:text-void transition-all hover:scale-105 active:scale-95"
          >
            SHARE YOUR RESULTS
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
          transition={{ delay: 1 }}
          className="text-center py-8 border-t border-ash-darker mt-12"
        >
          <div className="text-xs text-ash-darker font-mono">
            Based on {Object.keys(answers).length} questions and 303 episodes of Lenny's Podcast
          </div>
          <div className="text-xs text-ash-darker font-mono mt-2">
            Built for the PM community
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
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <div className="text-ash-dark font-mono text-sm">Analyzing your philosophy...</div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
