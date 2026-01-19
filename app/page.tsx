'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CampfireParticles from '@/components/CampfireParticles';
import Campfire from '@/components/Campfire';

export default function Home() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen bg-cream text-charcoal overflow-hidden">
      <CampfireParticles />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl w-full space-y-12"
        >
          {/* Campfire logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Campfire className="w-20 h-20 md:w-24 md:h-24" />
          </motion.div>

          {/* Title */}
          <div className="text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="block text-charcoal">The PM</span>
              <span className="block text-orange mt-2">Philosophy Map</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-charcoal-light max-w-3xl mx-auto leading-relaxed"
            >
              Every PM navigates the product universe differently.
              <br />
              Discover your philosophy.
            </motion.p>
          </div>

          {/* Steps with decorative sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { num: '01', text: 'Answer 7 questions', emoji: '✨' },
              { num: '02', text: 'Face contradictions', emoji: '⚡' },
              { num: '03', text: 'Find your philosophy', emoji: '🔥' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-orange/10">
                  <div className="text-4xl mb-4">{step.emoji}</div>
                  <div className="text-lg font-semibold text-orange mb-2">{step.num}</div>
                  <div className="text-charcoal-light">{step.text}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col items-center gap-6"
          >
            <button
              onClick={() => router.push('/quiz')}
              className="group relative px-12 py-5 bg-orange hover:bg-orange-dark text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-charcoal-light">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange" />8 zones
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-light" />
                303 episodes
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ember" />
                15 contradictions
              </span>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center text-sm text-charcoal-light pt-8"
          >
            Built from Lenny's Podcast transcripts
          </motion.div>
        </motion.div>
      </div>

      {/* Floating embers decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-orange opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
            }}
            animate={{
              y: [0, -1200],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.4, 0.8, 0],
              scale: [1, 1.5, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 1.5,
            }}
          />
        ))}
      </div>
    </main>
  );
}
