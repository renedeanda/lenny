'use client';

import { motion } from 'framer-motion';

export default function Campfire({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wood logs */}
      <rect x="20" y="70" width="60" height="8" rx="2" fill="#8B4513" opacity="0.9" />
      <rect x="25" y="62" width="50" height="8" rx="2" fill="#A0522D" opacity="0.9" />

      {/* Main flame */}
      <motion.path
        d="M 50 60 Q 40 40, 50 20 Q 60 40, 50 60 Z"
        fill="#FF6B35"
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 1.05, 0.95, 1],
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner flame */}
      <motion.path
        d="M 50 55 Q 45 42, 50 30 Q 55 42, 50 55 Z"
        fill="#FF8C42"
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 1.08, 0.92, 1],
          y: [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      {/* Core flame */}
      <motion.path
        d="M 50 50 Q 47 40, 50 32 Q 53 40, 50 50 Z"
        fill="#FFAB73"
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 1.1, 0.9, 1],
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      {/* Sparks */}
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + (Math.random() - 0.5) * 20}
          cy={30 + i * 5}
          r="1"
          fill="#FFD700"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-10, -30],
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </svg>
  );
}
