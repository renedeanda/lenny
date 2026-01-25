'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Home, Compass, Flame, CheckCircle } from 'lucide-react';

export default function Footer() {
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

    // Re-check when window regains focus (after completing quiz)
    const handleFocus = () => checkQuizCompletion();
    window.addEventListener('focus', handleFocus);

    // Listen for storage changes (when quiz completes in same window)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pm_quiz_answers') {
        checkQuizCompletion();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Custom event for same-window updates
    const handleQuizUpdate = () => checkQuizCompletion();
    window.addEventListener('quizUpdated', handleQuizUpdate);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('quizUpdated', handleQuizUpdate);
    };
  }, []);

  return (
    <footer className="relative z-20 border-t-2 border-ash-darker bg-void-light/50 backdrop-blur-sm font-mono">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">NAVIGATION</h3>
            <nav className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              {hasQuizResults ? (
                <Link
                  href="/results"
                  className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  View Your Results
                </Link>
              ) : (
                <Link
                  href="/quiz"
                  className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
                >
                  <Flame className="w-4 h-4" />
                  Take the Quiz
                </Link>
              )}
              <Link
                href="/explore"
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <Compass className="w-4 h-4" />
                Explore Episodes
              </Link>
            </nav>
          </div>

          {/* About */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">ABOUT</h3>
            <p className="text-ash-dark text-sm leading-relaxed">
              Discover your product philosophy through a quiz built from 299 episodes of <span className="text-amber">Lenny's Podcast</span>.
              Get personalized episode recommendations that match how you work.
            </p>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">OPEN SOURCE</h3>
            <a
              href="https://github.com/renedeanda/lenny"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm mb-4"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <p className="text-ash-darker text-xs">
              MIT License • Built with Next.js, React Three Fiber & Framer Motion
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-ash-darker/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ash-darker">
            <div>
              © 2026 <a href="https://renedeanda.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">René DeAnda</a>
              {' '} • <a href="https://github.com/ChatPRD/lennys-podcast-transcripts" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">Data from Lenny's Podcast</a>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.lennysnewsletter.com/podcast"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                Original Podcast
              </a>
              <span>•</span>
              <a
                href="https://github.com/renedeanda/lenny/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
