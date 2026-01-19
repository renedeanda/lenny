'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/StarField';
import { Rocket, Map, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-deep-space text-white overflow-hidden">
      <StarField />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8 max-w-4xl"
        >
          {/* Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-glow via-purple-nebula to-hot-pink bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
            }}
          >
            THE PM PHILOSOPHY MAP
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-cyan-glow/80 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Every PM is lost somewhere in the Product Universe
          </motion.p>

          {/* Description */}
          <motion.div
            className="space-y-4 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>Answer 7 questions.</p>
            <p>Face contradictions from world-class product leaders.</p>
            <p>Discover your philosophy.</p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => router.push('/quiz')}
            className="group relative px-8 py-4 text-xl font-semibold rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow to-purple-nebula opacity-75 blur-xl group-hover:opacity-100 transition-opacity" />

            {/* Button background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow to-purple-nebula" />

            {/* Button content */}
            <span className="relative flex items-center gap-2 text-deep-space">
              Begin Journey
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-glow" />
              <span>8 Cosmic Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-nebula" />
              <span>303 Episodes Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-hot-pink" />
              <span>15 Contradictions</span>
            </div>
          </motion.div>

          {/* Attribution */}
          <motion.p
            className="text-sm text-gray-500 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Built from Lenny's Podcast transcripts • Inspired by{' '}
            <span className="text-cyan-glow">A Fire Upon the Deep</span>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
