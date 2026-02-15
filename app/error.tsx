'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-void text-ash font-mono flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl font-bold text-crimson mb-4">ERROR</div>
        <h1 className="text-2xl font-bold text-ash mb-4">Something went wrong</h1>
        <p className="text-ash-dark mb-8 text-sm">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 border border-amber text-amber hover:bg-amber/10 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-ash-darker text-ash-dark hover:text-ash hover:border-ash transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
