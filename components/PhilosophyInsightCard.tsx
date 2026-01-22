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
      className="border-2 border-amber bg-void-light p-8"
    >
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-amber mb-2">
          Your Product Philosophy
        </h2>
        <p className="text-ash-dark">
          Based on your answers, here's how you approach product work
        </p>
      </div>

      {/* Primary Strength */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{primaryZone.icon}</span>
          <div>
            <div className="text-xs text-amber font-mono tracking-wider">YOUR PRIMARY STRENGTH</div>
            <div className="text-2xl font-bold text-amber">{primaryZone.name}</div>
          </div>
        </div>
        <p className="text-ash leading-relaxed">
          {primaryZone.description}
        </p>
      </div>

      {/* Secondary Strength */}
      {userProfile.zonePercentages[userProfile.secondaryZone] > 10 && (
        <div className="mb-6 pb-6 border-b border-ash-darker">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl opacity-70">{secondaryZone.icon}</span>
            <div>
              <div className="text-xs text-ash-dark font-mono tracking-wider">ALSO IMPORTANT TO YOU</div>
              <div className="text-lg font-bold text-ash">{secondaryZone.name}</div>
            </div>
          </div>
          <p className="text-ash-dark text-sm">
            {secondaryZone.tagline}
          </p>
        </div>
      )}

      {/* Blind Spot */}
      <div className="bg-void p-4 border-l-2 border-crimson/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl opacity-50">{blindSpotZone.icon}</span>
          <div>
            <div className="text-xs text-crimson font-mono tracking-wider">YOUR GROWTH AREA</div>
            <div className="text-lg font-bold text-ash-dark">{blindSpotZone.name}</div>
          </div>
        </div>
        <p className="text-sm text-ash-dark">
          You might undervalue {blindSpotZone.tagline.toLowerCase()}.
          Consider exploring perspectives that challenge this.
        </p>
      </div>
    </motion.div>
  );
}
