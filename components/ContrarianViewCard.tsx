'use client';

import { useState } from 'react';

interface ContrarianView {
  quote: string;
  speaker: string;
  timestamp: string;
}

interface ContrarianViewCardProps {
  view: ContrarianView;
  onTimestampClick?: (timestamp: string) => void;
}

export default function ContrarianViewCard({ view, onTimestampClick }: ContrarianViewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 200;
  const isLongQuote = view.quote.length > MAX_LENGTH;
  const displayText = isLongQuote && !isExpanded
    ? view.quote.substring(0, MAX_LENGTH) + '...'
    : view.quote;

  return (
    <div className="border-l-2 border-crimson/50 pl-3">
      <p className="text-sm text-ash italic mb-2">
        "{displayText}"
        {isLongQuote && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-crimson hover:text-crimson/80 text-xs font-semibold transition-colors"
          >
            {isExpanded ? '▲ Less' : '▼ More'}
          </button>
        )}
      </p>
      <div className="flex items-center gap-2 text-xs text-ash-dark">
        <span className="text-crimson font-bold">{view.speaker}</span>
        <span>•</span>
        {onTimestampClick ? (
          <button
            onClick={() => onTimestampClick(view.timestamp)}
            className="hover:text-crimson underline transition-colors"
          >
            {view.timestamp}
          </button>
        ) : (
          <span>{view.timestamp}</span>
        )}
      </div>
    </div>
  );
}
