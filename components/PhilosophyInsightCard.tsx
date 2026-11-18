'use client';

import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/recommendations';
import { zones } from '@/lib/zones';

interface Props {
  userProfile: UserProfile;
}

export default function PhilosophyInsightCard({ userProfile }: Props) {
  const primaryZone = zones[userProfile.primaryZone];
  const secondaryZone = zones[userProfile.secondaryZone];
  const blindSpotZone = zones[userProfile.blindSpotZone];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="border-2 border-amber bg-void-light p-8 md:p-10 relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 text-9xl opacity-5 select-none pointer-events-none">
        {primaryZone.icon}
      </div>

      <div className="relative z-10 mb-8">
        <div className="inline-block px-4 py-2 bg-amber/10 border border-amber/30 text-amber text-sm font-mono mb-4">
          YOUR PHILOSOPHY TYPE
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-amber mb-3 leading-tight">
          {primaryZone.name}
        </h2>
        <p className="text-xl md:text-2xl text-ash italic">
          &quot;{primaryZone.tagline}&quot;
        </p>
      </div>

      {/* Description */}
      <div className="relative z-10 mb-8">
        <p className="text-lg md:text-xl text-ash leading-relaxed">
          {primaryZone.description}
        </p>
      </div>

      {/* Secondary & Blind Spot in two columns */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        {/* Secondary Strength */}
        {userProfile.zonePercentages[userProfile.secondaryZone] > 10 && (
          <div className="border border-ash-darker bg-void p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{secondaryZone.icon}</span>
              <div className="text-xs text-ash-dark font-mono tracking-wider">ALSO STRONG</div>
            </div>
            <div className="text-xl font-bold text-ash mb-2">{secondaryZone.name}</div>
            <p className="text-sm text-ash-dark">
              {secondaryZone.tagline}
            </p>
          </div>
        )}

        {/* Blind Spot */}
        <div className="border border-crimson/30 bg-void p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl opacity-60">{blindSpotZone.icon}</span>
            <div className="text-xs text-crimson font-mono tracking-wider">GROWTH AREA</div>
          </div>
          <div className="text-xl font-bold text-ash-dark mb-2">{blindSpotZone.name}</div>
          <p className="text-sm text-ash-dark">
            Explore perspectives on {blindSpotZone.tagline.toLowerCase()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
