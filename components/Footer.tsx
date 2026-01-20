import Link from 'next/link';
import { Github, Home, Compass, Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 border-t-2 border-ash-darker bg-void-light/50 backdrop-blur-sm font-mono">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">NAVIGATION</h3>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                href="/quiz" 
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <Flame className="w-4 h-4" />
                Take the Quiz
              </Link>
              <Link 
                href="/explore" 
                className="flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm"
              >
                <Compass className="w-4 h-4" />
                Explore Episodes
              </Link>
            </nav>
          </div>

          {/* About */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">ABOUT</h3>
            <p className="text-ash-dark text-sm leading-relaxed">
              An interactive PM philosophy map built from 303 episodes of <span className="text-amber">Lenny's Podcast</span>. 
              Discover your product philosophy through existential questions and explore a cosmic universe of PM thinking.
            </p>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="text-amber font-bold mb-4 text-sm tracking-wider">OPEN SOURCE</h3>
            <a 
              href="https://github.com/renedeanda/lenny"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors text-sm mb-4"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <p className="text-ash-darker text-xs">
              MIT License • Built with Next.js, React Three Fiber & Framer Motion
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-ash-darker/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ash-darker">
            <div>
              © 2026 <a href="https://github.com/renedeanda" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">René DeAnda</a>
              {' '} • Data from Lenny's Podcast
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.lennysnewsletter.com/podcast" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                Original Podcast
              </a>
              <span>•</span>
              <a 
                href="https://github.com/renedeanda/lenny/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
