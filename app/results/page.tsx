'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { generateRecommendations, getBlindSpotDescription } from '@/lib/recommendations';
import { getRegistryInfo } from '@/lib/verifiedQuotes';
import { zones } from '@/lib/zones';
import { QuizAnswers, ZoneId } from '@/lib/types';
import PhilosophyInsightCard from '@/components/PhilosophyInsightCard';
import EpisodeRecommendationCard from '@/components/EpisodeRecommendationCard';
import QuizAnswersOverview from '@/components/QuizAnswersOverview';
import TopNav from '@/components/TopNav';
import { trackQuizCompleted, trackResultsShared, trackResultsDownloaded } from '@/lib/analytics';
import { ChevronDown, ChevronUp } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use state for client-side only data to avoid SSR hydration issues
  const [isClient, setIsClient] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [userName, setUserName] = useState('Your');
  // These must be declared before any early returns (React hooks rule)
  const [showAllPrimary, setShowAllPrimary] = useState(false);
  const [showAllContrarian, setShowAllContrarian] = useState(false);
  const [expandedZone, setExpandedZone] = useState<ZoneId | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load from localStorage only on client side
  useEffect(() => {
    setIsClient(true);
    try {
      const answersParam = localStorage.getItem('pm_quiz_answers');
      const nameParam = localStorage.getItem('pm_map_name');

      if (answersParam) {
        setAnswers(JSON.parse(answersParam) as QuizAnswers);
      }
      if (nameParam) {
        setUserName(nameParam);
      }
    } catch (error) {
      console.error('Error loading quiz answers from localStorage:', error);
    }
  }, []);

  // Generate recommendations using new algorithm
  // Only compute after client-side hydration is complete
  const recommendations = useMemo(() => {
    if (!isClient || Object.keys(answers).length === 0) return null;
    try {
      return generateRecommendations(answers);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return null;
    }
  }, [answers, isClient]);

  // Track quiz completion when results are first viewed
  const [hasTrackedCompletion, setHasTrackedCompletion] = useState(false);
  useEffect(() => {
    if (recommendations && !hasTrackedCompletion) {
      trackQuizCompleted(
        recommendations.userProfile.primaryZone,
        recommendations.userProfile.secondaryZone
      );
      setHasTrackedCompletion(true);
    }
  }, [recommendations, hasTrackedCompletion]);

  const handleDownload = async () => {
    const cardElement = document.getElementById('philosophy-card');
    if (!cardElement || !recommendations || isDownloading) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false
      });

      const link = document.createElement('a');
      const safeName = userName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-') || 'pm';
      link.download = `${safeName}-pm-philosophy.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      trackResultsDownloaded(recommendations.userProfile.primaryZone);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (!recommendations) return;

    const primaryZone = zones[recommendations.userProfile.primaryZone];
    const secondaryZone = zones[recommendations.userProfile.secondaryZone];

    // Craft engaging share text
    const shareText = `🎯 My PM Philosophy: ${primaryZone.name}

"${primaryZone.tagline}"

With a touch of ${secondaryZone.name} - discover yours:
${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: `My PM Philosophy: ${primaryZone.name}`,
        text: shareText,
      }).then(() => {
        trackResultsShared('native_share');
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareText);
      trackResultsShared('copy_link');
      alert('Copied to clipboard!');
    }
  };

  const handleRetake = () => {
    router.push('/');
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-void text-ash flex items-center justify-center p-4">
        <TopNav />
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <div className="text-ash-dark font-mono text-sm">Loading your philosophy...</div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-void text-ash flex items-center justify-center p-4">
        <TopNav />
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

  const { userProfile, primary, contrarian, byZone } = recommendations;

  // Show first 5 primary, expand to all 12
  const visiblePrimary = showAllPrimary ? primary : primary.slice(0, 5);
  const hiddenPrimaryCount = primary.length - 5;

  // Show first 3 contrarian, expand to all 6
  const visibleContrarian = showAllContrarian ? contrarian : contrarian.slice(0, 3);
  const hiddenContrarianCount = contrarian.length - 3;

  return (
    <div className="min-h-screen bg-void text-ash p-4 md:p-8 pt-20 md:pt-24">
      <TopNav />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <div className="text-xs text-ash-dark font-mono tracking-wider">
              PHILOSOPHY DISCOVERED
            </div>
          </div>
          <div className="px-3 py-1 bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
            {primary.length + contrarian.length} EPISODES MATCHED
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber mb-4 leading-tight">
          {userName !== 'Your' ? `${userName}'s` : 'Your'} Product Philosophy
        </h1>
        <p className="text-xl md:text-2xl text-ash leading-relaxed">
          Podcast episodes curated for how you work as a PM
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Personal Philosophy Summary */}
        <div id="philosophy-card">
          <PhilosophyInsightCard userProfile={userProfile} />
        </div>

        {/* Quiz Answers Overview */}
        <QuizAnswersOverview answers={answers} userName={userName} />

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
                Based on your philosophy, these {primary.length} episodes will resonate with how you work
              </p>
            </div>

            <div className="grid gap-6">
              {visiblePrimary.map((episode, index) => (
                <EpisodeRecommendationCard
                  key={episode.slug}
                  episode={episode}
                  index={index}
                  variant="primary"
                />
              ))}
            </div>

            {hiddenPrimaryCount > 0 && (
              <motion.button
                onClick={() => setShowAllPrimary(!showAllPrimary)}
                className="mt-6 w-full p-4 border border-amber/30 bg-amber/5 text-amber font-mono text-sm hover:bg-amber/10 hover:border-amber/50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {showAllPrimary ? (
                  <>Show fewer recommendations <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show {hiddenPrimaryCount} more recommendations <ChevronDown className="w-4 h-4" /></>
                )}
              </motion.button>
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
              <h2 className="text-3xl font-bold text-rose-400 mb-2">
                Perspectives to Explore
              </h2>
              <p className="text-ash-dark">
                {getBlindSpotDescription(userProfile.blindSpotZone)}
              </p>
            </div>

            <div className="grid gap-6">
              {visibleContrarian.map((episode, index) => (
                <EpisodeRecommendationCard
                  key={episode.slug}
                  episode={episode}
                  index={index}
                  variant="contrarian"
                />
              ))}
            </div>

            {hiddenContrarianCount > 0 && (
              <motion.button
                onClick={() => setShowAllContrarian(!showAllContrarian)}
                className="mt-6 w-full p-4 border border-rose-800/30 bg-rose-950/10 text-rose-400 font-mono text-sm hover:bg-rose-950/20 hover:border-rose-700/50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {showAllContrarian ? (
                  <>Show fewer perspectives <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show {hiddenContrarianCount} more perspectives <ChevronDown className="w-4 h-4" /></>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Explore by Zone */}
        {byZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-amber mb-2">
                Explore by Philosophy
              </h2>
              <p className="text-ash-dark">
                Dive deeper into specific areas of product thinking
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(userProfile.zonePercentages)
                .sort((a, b) => b[1] - a[1])
                .map(([zoneId, percentage]) => {
                  const zone = zones[zoneId as ZoneId];
                  const zoneEpisodes = byZone[zoneId as ZoneId] || [];
                  const isExpanded = expandedZone === zoneId;
                  const isPrimary = zoneId === userProfile.primaryZone;
                  const isSecondary = zoneId === userProfile.secondaryZone;

                  if (zoneEpisodes.length === 0) return null;

                  return (
                    <motion.div
                      key={zoneId}
                      className={`border transition-all ${
                        isExpanded
                          ? 'border-amber bg-void-light md:col-span-2'
                          : isPrimary
                          ? 'border-amber/50 bg-void-light hover:border-amber'
                          : 'border-ash-darker bg-void-light hover:border-ash-dark'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedZone(isExpanded ? null : zoneId as ZoneId)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${zone.name} episodes`}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{zone.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold font-mono ${isPrimary ? 'text-amber' : 'text-ash'}`}>
                                {zone.name}
                              </span>
                              {isPrimary && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber text-void">PRIMARY</span>
                              )}
                              {isSecondary && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold border border-amber/50 text-amber">SECONDARY</span>
                              )}
                            </div>
                            <span className="text-xs text-ash-dark">{zone.tagline}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-ash-dark font-mono">{zoneEpisodes.length} episodes</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-ash-dark" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-ash-dark" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3">
                          {zoneEpisodes.map((episode, index) => (
                            <EpisodeRecommendationCard
                              key={episode.slug}
                              episode={episode}
                              index={index}
                              variant="primary"
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Philosophy Breakdown - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border border-ash-darker bg-void-light p-8"
        >
          <h3 className="text-2xl font-bold text-amber mb-2">Your Philosophy Mix</h3>
          <p className="text-sm text-ash-dark mb-8">
            Your top approaches to product management
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(userProfile.zonePercentages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4) // Only show top 4 zones
              .map(([zoneId, percentage], index) => {
                const zone = zones[zoneId as ZoneId];
                const isPrimary = index === 0;
                const isSecondary = index === 1;

                if (percentage < 5) return null; // Skip very low percentages

                return (
                  <motion.div
                    key={zoneId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`border-2 p-5 transition-all ${
                      isPrimary
                        ? 'border-amber bg-amber/5'
                        : isSecondary
                        ? 'border-amber/50 bg-void'
                        : 'border-ash-darker bg-void'
                    }`}
                  >
                    {/* Badge */}
                    {(isPrimary || isSecondary) && (
                      <div className="mb-3">
                        <span className={`inline-block px-2 py-1 text-xs font-bold font-mono ${
                          isPrimary
                            ? 'bg-amber text-void'
                            : 'border border-amber/50 text-amber'
                        }`}>
                          {isPrimary ? 'PRIMARY' : 'SECONDARY'}
                        </span>
                      </div>
                    )}

                    {/* Zone Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{zone.icon}</span>
                        <div>
                          <div className={`font-bold font-mono ${
                            isPrimary ? 'text-amber text-lg' : 'text-ash'
                          }`}>
                            {zone.name}
                          </div>
                          <div className="text-xs text-ash-dark mt-0.5">
                            {zone.tagline}
                          </div>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold font-mono ${
                        isPrimary ? 'text-amber' : 'text-ash-dark'
                      }`}>
                        {percentage}%
                      </div>
                    </div>

                    {/* Description (only for top 2) */}
                    {(isPrimary || isSecondary) && (
                      <p className="text-sm text-ash-dark leading-relaxed">
                        {zone.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
          </div>

          {/* View Full Breakdown Link */}
          <div className="mt-6 text-center">
            <details className="text-sm text-ash-dark hover:text-amber transition-colors cursor-pointer">
              <summary className="font-mono font-bold list-none inline-flex items-center gap-2">
                <span>View all 8 zones</span>
                <span className="text-xs">▼</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-ash-darker grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {Object.entries(userProfile.zonePercentages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([zoneId, percentage]) => {
                    const zone = zones[zoneId as ZoneId];
                    return (
                      <div key={zoneId} className="text-center">
                        <div className="text-lg mb-1">{zone.icon}</div>
                        <div className="font-mono text-ash-dark">{zone.name}</div>
                        <div className="font-mono font-bold text-amber">{percentage}%</div>
                      </div>
                    );
                  })}
              </div>
            </details>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-6"
        >
          {/* Primary actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleShare}
              aria-label="Share your product philosophy results"
              className="px-10 py-5 bg-amber text-void font-mono font-bold hover:bg-amber-dark transition-all hover:scale-105 active:scale-95 text-lg"
            >
              SHARE YOUR PHILOSOPHY
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label={isDownloading ? 'Generating download...' : 'Download your results as an image'}
              className="px-10 py-5 border-2 border-amber text-amber font-mono font-bold hover:bg-amber hover:text-void transition-all hover:scale-105 active:scale-95 text-lg disabled:opacity-50 disabled:cursor-wait"
            >
              {isDownloading ? 'GENERATING...' : 'DOWNLOAD RESULTS'}
            </button>
          </div>

          {/* Secondary actions */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <button
              onClick={handleExplore}
              aria-label="Browse all podcast episodes"
              className="px-6 py-3 border border-ash-darker text-ash-dark font-mono hover:text-amber hover:border-amber transition-all"
            >
              Browse All Episodes
            </button>
            <button
              onClick={handleRetake}
              aria-label="Retake the philosophy quiz"
              className="px-6 py-3 border border-ash-darker text-ash-dark font-mono hover:text-amber hover:border-amber transition-all"
            >
              Retake Quiz
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8 border-t border-ash-darker mt-12"
        >
          <div className="text-xs text-ash-darker font-mono">
            Based on {Object.keys(answers).length} questions and {getRegistryInfo().episodeCount} curated episodes of Lenny's Podcast
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
