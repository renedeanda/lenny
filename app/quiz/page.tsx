'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveSpace from '@/components/InteractiveSpace';
import { questions } from '@/lib/questions';
import { QuizAnswers, AnswerId } from '@/lib/types';
import { ArrowLeft, Flame } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      } else {
        // Quiz complete - navigate to map with answers
        const answersParam = encodeURIComponent(JSON.stringify(newAnswers));
        router.push(`/map?answers=${answersParam}`);
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
        {/* Question counter with flame */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-12 text-amber/60 text-sm"
        >
          <Flame className="w-4 h-4 animate-pulse" />
          <span>QUESTION {question.number} OF {questions.length}</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full max-w-3xl space-y-12"
          >
            {/* Question text */}
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-ash leading-relaxed text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {question.text}
            </motion.h2>

            {/* Answer options */}
            <div className="space-y-4">
              {question.answers.map((answer, index) => (
                <motion.button
                  key={answer.id}
                  onClick={() => handleAnswer(answer.id)}
                  className={`group relative w-full p-6 text-left border-2 transition-all duration-300 ${
                    selectedAnswer === answer.id
                      ? 'border-amber bg-amber/10'
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
                  <div className="relative flex items-start gap-4">
                    <span className="text-4xl flex-shrink-0 transition-transform group-hover:scale-110">
                      {answer.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-lg text-ash group-hover:text-white transition-colors">
                        {answer.text}
                      </div>
                    </div>
                  </div>

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
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Back button */}
        {currentQuestion > 0 && (
          <motion.button
            onClick={handleBack}
            className="mt-12 flex items-center gap-2 text-ash-dark hover:text-amber transition-colors"
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

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>
    </main>
  );
}
