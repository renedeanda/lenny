'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import InteractiveSpace from '@/components/InteractiveSpace';

export default function Home() {
  const router = useRouter();
  const [glitchActive, setGlitchActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasQuizResults, setHasQuizResults] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Check if user has completed the quiz
  useEffect(() => {
    const checkQuizCompletion = () => {
      try {
        const savedAnswers = localStorage.getItem('pm_quiz_answers');
        if (savedAnswers) {
          const answers = JSON.parse(savedAnswers);
          // Check if quiz has at least 7 answers (old quiz had 7, new has 10)
          const answerCount = Object.keys(answers).length;
          setHasQuizResults(answerCount >= 7);
        }
      } catch (e) {
        console.error('Error checking quiz completion:', e);
      }
    };

    checkQuizCompletion();
  }, []);

  const handleRetakeQuiz = () => {
    try {
      localStorage.removeItem('pm_quiz_answers');
      localStorage.removeItem('pm_map_name');
      setHasQuizResults(false);
      router.push('/quiz');
    } catch (e) {
      console.error('Error clearing quiz data:', e);
      router.push('/quiz');
    }
  };

  return (
    <main className="relative min-h-screen bg-void text-ash overflow-hidden font-mono">
      <InteractiveSpace />

      {/* Custom cursor */}
      <motion.div
        className="fixed w-8 h-8 border border-amber/30 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-5xl w-full space-y-16"
        >
          {/* System status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between text-xs text-amber/50 border-b border-amber/10 pb-2"
          >
            <span className="font-mono">SYSTEM.INIT</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
              ONLINE
            </span>
          </motion.div>

          {/* Title with glitch */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: 'spring', damping: 20 }}
              className="relative"
            >
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight ${
                  glitchActive ? 'animate-glitch' : ''
                }`}
              >
                <span className="text-amber drop-shadow-[0_0_30px_rgba(255,179,71,0.3)]">
                  DISCOVER YOUR
                </span>
                <br />
                <span className="text-ash">PRODUCT</span>
                <br />
                <span className="text-amber-dark">PHILOSOPHY</span>
              </h1>

              {/* Glitch layers */}
              {glitchActive && (
                <>
                  <h1
                    className="absolute top-0 left-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight opacity-70 mix-blend-screen"
                    style={{
                      color: '#dc143c',
                      transform: 'translate(-2px, 2px)',
                    }}
                  >
                    <span>DISCOVER YOUR</span>
                    <br />
                    <span>PRODUCT</span>
                    <br />
                    <span>PHILOSOPHY</span>
                  </h1>
                  <h1
                    className="absolute top-0 left-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight opacity-70 mix-blend-screen"
                    style={{
                      color: '#00d4ff',
                      transform: 'translate(2px, -2px)',
                    }}
                  >
                    <span>DISCOVER YOUR</span>
                    <br />
                    <span>PRODUCT</span>
                    <br />
                    <span>PHILOSOPHY</span>
                  </h1>
                </>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl text-ash-dark max-w-2xl leading-relaxed"
            >
              Find podcast episodes that match how you work—based on 303 episodes of Lenny's Podcast
            </motion.p>
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            {[
              { num: '01', text: 'Answer 10 questions about how you work' },
              { num: '02', text: 'Get your product philosophy profile' },
              { num: '03', text: 'Discover episodes that match your approach' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="relative group"
              >
                <div className="border border-amber/20 bg-void-light/50 p-6 backdrop-blur-sm hover:border-amber/40 transition-all duration-300">
                  <div className="text-3xl font-bold text-amber mb-3">{step.num}</div>
                  <div className="text-ash-dark group-hover:text-ash transition-colors">
                    {step.text}
                  </div>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber/0 via-amber/10 to-amber/0 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur" />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {hasQuizResults ? (
                <>
                  <button
                    onClick={() => router.push('/results')}
                    className="group relative px-12 py-5 bg-void-light border-2 border-amber text-amber font-bold text-lg tracking-wide hover:bg-amber hover:text-void transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      SEE YOUR RESULTS
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-amber opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>

                  <button
                    onClick={handleRetakeQuiz}
                    className="group relative px-12 py-5 bg-void-light border border-ash-darker text-ash-dark font-bold text-lg tracking-wide hover:border-amber hover:text-amber transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      RETAKE QUIZ
                      <span className="text-amber">↻</span>
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/quiz')}
                  className="group relative px-12 py-5 bg-void-light border-2 border-amber text-amber font-bold text-lg tracking-wide hover:bg-amber hover:text-void transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    START QUIZ
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="absolute inset-0 bg-amber opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              )}

              <button
                onClick={() => router.push('/explore')}
                className="group relative px-12 py-5 bg-void-light border border-ash-darker text-ash-dark font-bold text-lg tracking-wide hover:border-amber hover:text-amber transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  BROWSE EPISODES
                  <span className="text-amber">🔥</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-8 text-xs text-ash-dark">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-dark" />10 QUESTIONS
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-dark" />
                303 EPISODES
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-dark" />
                VERIFIED QUOTES
              </span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Corner coordinates */}
      <div className="fixed bottom-4 right-4 text-[10px] text-amber/30 font-mono z-30">
        [{Math.floor(mousePos.x)}, {Math.floor(mousePos.y)}]
      </div>
    </main>
  );
}
