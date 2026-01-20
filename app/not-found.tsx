'use client';

import Link from 'next/link';
import { Home, Compass, Flame, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-void text-ash font-mono flex items-center justify-center px-4">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl animate-fade-in">
          {/* Error Code */}
          <div className="text-9xl font-bold text-amber mb-4 animate-pulse">
            404
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-ash mb-4">
            LOCATION NOT FOUND
          </h1>
          <p className="text-xl text-ash-dark mb-8">
            This zone doesn't exist in the Product Universe
          </p>

          {/* Glitch Effect */}
          <div className="text-crimson text-sm mb-8 animate-pulse">
            ERROR: COORDINATES_INVALID
          </div>

          {/* Navigation Options */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/"
                className="group flex flex-col items-center gap-3 p-6 border-2 border-ash-darker hover:border-amber bg-void-light/50 transition-all"
              >
                <Home className="w-8 h-8 text-amber group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-ash group-hover:text-amber transition-colors">HOME</div>
                  <div className="text-xs text-ash-dark mt-1">Return to start</div>
                </div>
              </Link>

              <Link
                href="/quiz"
                className="group flex flex-col items-center gap-3 p-6 border-2 border-ash-darker hover:border-amber bg-void-light/50 transition-all"
              >
                <Flame className="w-8 h-8 text-amber group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-ash group-hover:text-amber transition-colors">QUIZ</div>
                  <div className="text-xs text-ash-dark mt-1">Find your philosophy</div>
                </div>
              </Link>

              <Link
                href="/explore"
                className="group flex flex-col items-center gap-3 p-6 border-2 border-ash-darker hover:border-amber bg-void-light/50 transition-all"
              >
                <Compass className="w-8 h-8 text-amber group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-ash group-hover:text-amber transition-colors">EXPLORE</div>
                  <div className="text-xs text-ash-dark mt-1">Browse episodes</div>
                </div>
              </Link>
            </div>

            {/* Go Back Option */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </div>

          {/* ASCII Art Terminal Border */}
          <div className="mt-12 text-ash-darker text-xs">
            <div>╔════════════════════════════════════╗</div>
            <div>║  SYSTEM: PM PHILOSOPHY MAP v1.0   ║</div>
            <div>║  STATUS: ROUTE_NOT_FOUND          ║</div>
            <div>╚════════════════════════════════════╝</div>
          </div>
      </div>
    </main>
  );
}
