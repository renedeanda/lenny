'use client';

import Link from 'next/link';
import { Home, Compass, Flame, CheckCircle, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopNav() {
  const [hasQuizResults, setHasQuizResults] = useState(false);

  useEffect(() => {
    const checkQuizCompletion = () => {
      try {
        const savedAnswers = localStorage.getItem('pm_quiz_answers');
        if (savedAnswers) {
          const answers = JSON.parse(savedAnswers);
          const answerCount = Object.keys(answers).length;
          setHasQuizResults(answerCount >= 7);
        } else {
          setHasQuizResults(false);
        }
      } catch (e) {
        console.error('Error checking quiz completion:', e);
      }
    };

    // Check on mount
    checkQuizCompletion();

    // Listen for quiz updates
    const handleQuizUpdate = () => checkQuizCompletion();
    window.addEventListener('quizUpdated', handleQuizUpdate);

    return () => {
      window.removeEventListener('quizUpdated', handleQuizUpdate);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-void/80 backdrop-blur-md border-b border-ash-darker/30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-amber hover:text-amber-dark transition-colors text-sm font-bold tracking-wider"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">PM PHILOSOPHY</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </Link>
            <Link
              href="/topics"
              className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
            >
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Topics</span>
            </Link>

            {hasQuizResults ? (
              <Link
                href="/results"
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Results</span>
              </Link>
            ) : (
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-3 py-1.5 bg-amber/10 border border-amber/30 text-amber hover:bg-amber hover:text-void transition-all text-sm font-bold"
              >
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Quiz</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
