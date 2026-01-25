'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveSpace from '@/components/InteractiveSpace';
import PersonalizationModal from '@/components/PersonalizationModal';
import { questions } from '@/lib/questions';
import { QuizAnswers, AnswerId } from '@/lib/types';
import { ArrowLeft, Flame, User } from 'lucide-react';
import { trackQuizStarted, trackQuizProgress, trackQuizCompleted } from '@/lib/analytics';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('pm_map_quiz_progress');
    if (savedProgress) {
      try {
        const { question, answers: savedAnswers } = JSON.parse(savedProgress);
        setCurrentQuestion(question);
        setAnswers(savedAnswers);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('pm_map_quiz_progress', JSON.stringify({
        question: currentQuestion,
        answers
      }));
    }
  }, [currentQuestion, answers]);

  // Check for existing personalization or show modal
  useEffect(() => {
    const nameParam = searchParams.get('name');
    const roleParam = searchParams.get('role');
    const savedName = localStorage.getItem('pm_map_name');
    const savedRole = localStorage.getItem('pm_map_role');

    if (nameParam && roleParam) {
      setUserName(nameParam);
      setUserRole(roleParam);
    } else if (savedName && savedRole) {
      setUserName(savedName);
      setUserRole(savedRole);
    } else {
      setShowPersonalization(true);
    }
  }, [searchParams]);

  const handlePersonalizationComplete = (data: { name: string; role: string }) => {
    setUserName(data.name);
    setUserRole(data.role);
    localStorage.setItem('pm_map_name', data.name);
    localStorage.setItem('pm_map_role', data.role);
    setShowPersonalization(false);
    trackQuizStarted();
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answerId: AnswerId) => {
    if (isTransitioning) return;

    setSelectedAnswer(answerId);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = {
        ...answers,
        [question.id]: answerId
      };
      setAnswers(newAnswers);

      // Track quiz progress
      trackQuizProgress(currentQuestion + 1, questions.length);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      } else {
        // Quiz complete - save final answers and navigate
        localStorage.removeItem('pm_map_quiz_progress');

        // Save final answers to localStorage for persistence (plain JSON)
        localStorage.setItem('pm_quiz_answers', JSON.stringify(newAnswers));
        localStorage.setItem('pm_map_name', userName);
        localStorage.setItem('pm_map_role', userRole);

        // Dispatch event to update footer and other components
        window.dispatchEvent(new Event('quizUpdated'));

        router.push('/results');
      }
    }, 600);
  };

  const handleBack = () => {
    if (currentQuestion > 0 && !isTransitioning) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <main className="min-h-screen bg-void text-ash overflow-hidden font-mono">
      <InteractiveSpace />

      {/* Personalization Modal */}
      {showPersonalization && (
        <PersonalizationModal onComplete={handlePersonalizationComplete} />
      )}

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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 md:py-20">
        {/* User greeting and question counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-12 text-center space-y-2 md:space-y-3"
        >
          {userName && (
            <div className="flex items-center justify-center gap-2 text-amber text-xs md:text-sm">
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span>{userName}'s Philosophy Assessment</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 text-amber/60 text-xs md:text-sm">
            <Flame className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
            <span>QUESTION {question.number} OF {questions.length}</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full max-w-3xl space-y-6 md:space-y-12"
          >
            {/* Question text */}
            <motion.h2
              className="text-xl md:text-4xl font-bold text-ash leading-snug md:leading-relaxed text-center px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {question.text}
            </motion.h2>

            {/* Answer options */}
            <div className="space-y-3 md:space-y-4">
              {question.answers.map((answer, index) => {
                const isPreviouslySelected = answers[question.id] === answer.id;
                return (
                  <motion.button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    className={`group relative w-full p-4 md:p-6 text-left border-2 transition-all duration-300 ${
                      selectedAnswer === answer.id
                        ? 'border-amber bg-amber/10'
                        : isPreviouslySelected
                        ? 'border-amber/50 bg-amber/5'
                        : 'border-ash-darker/30 hover:border-amber/50 bg-void-light/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTransitioning}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber/0 via-amber/5 to-amber/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Content */}
                    <div className="relative flex items-start gap-3 md:gap-4">
                      <span className="text-2xl md:text-4xl flex-shrink-0 transition-transform group-hover:scale-110">
                        {answer.icon}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm md:text-lg text-ash group-hover:text-white transition-colors leading-snug md:leading-normal">
                          {answer.text}
                        </div>
                      </div>
                    </div>

                    {/* Previously selected badge */}
                    {isPreviouslySelected && !selectedAnswer && (
                      <div className="absolute top-2 right-2 text-xs text-amber/60 font-mono">
                        ✓
                      </div>
                    )}

                    {/* Selection indicator */}
                    {selectedAnswer === answer.id && (
                      <motion.div
                        className="absolute inset-0 border-2 border-amber"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-amber opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation hints and back button */}
        <div className="mt-12 flex flex-col items-center gap-4">
          {currentQuestion > 0 && (
            <motion.button
              onClick={handleBack}
              className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ x: -5 }}
              disabled={isTransitioning}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">BACK</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-void flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-amber text-xl animate-pulse">INITIALIZING...</div>
        </div>
      </main>
    }>
      <QuizContent />
    </Suspense>
  );
}
