# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**The PM Philosophy Map** - A dark, sci-fi interactive experience where product managers discover their philosophy by answering 7 existential questions, exploring a cosmic Product Universe map, facing contradictions from world-class PMs, and receiving a unique shareable Philosophy Profile. Built from 303 episodes of Lenny's Podcast transcripts.

**Design Aesthetic:** Terminal/void aesthetic meets space exploration - pure black backgrounds with amber/gold accents and crimson highlights.

**Tech Stack:** Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS, React Three Fiber, Framer Motion

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate episode data (run when transcripts change)
node scripts/generate-episodes-data.js
node scripts/parse-all-episodes.js
```

## Project Architecture

### Directory Structure

```
├── app/                          # Next.js 15 App Router
│   ├── page.tsx                  # Landing page with 3D starfield
│   ├── quiz/page.tsx             # 7-question flow
│   ├── map/page.tsx              # Cosmic Product Universe map reveal
│   ├── contradictions/page.tsx   # PM debates from transcripts
│   ├── results/page.tsx          # Final philosophy card (shareable)
│   ├── explore/page.tsx          # Episode browser with search/filter
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── InteractiveSpace.tsx      # 3D animated starfield (React Three Fiber)
│   └── StarField.tsx             # Alternative starfield component
├── lib/                          # Shared utilities and data
│   ├── types.ts                  # TypeScript type definitions
│   ├── questions.ts              # 7 existential PM questions
│   ├── zones.ts                  # 8 cosmic zones with guest associations
│   ├── scoring.ts                # Algorithm to calculate zone placement
│   ├── contradictions.ts         # 5 PM debates with real quotes
│   ├── allEpisodes.ts            # All 303 episodes with search/filter utils
│   └── episodesData.ts           # Pre-generated episode metadata
├── episodes/                     # 303 Lenny Podcast transcript episodes
│   └── {guest-name}/
│       └── transcript.md         # YAML frontmatter + transcript
├── index/                        # AI-generated topic indices
└── scripts/                      # Build and maintenance scripts
    ├── generate-episodes-data.js # Extract metadata from all episodes
    └── parse-all-episodes.js     # Parse transcript content
```

### Key Architecture Patterns

**Client-Side Only Application**
- Zero API costs - everything runs in the browser
- No backend or database required
- All transcript data and logic is bundled at build time
- Episode data pre-generated at build time for performance

**TypeScript Type System**
- Core types defined in `lib/types.ts`
- `QuestionId`, `AnswerId`, `ZoneId` for type safety
- `QuizAnswers` and `ZoneScores` interfaces for state management
- `Episode` and `TranscriptMetadata` for content

**The 8 Cosmic Zones**
The application maps user answers to 8 product philosophy zones:
1. Velocity Nebula (⚡) - Ship fast, iterate constantly
2. Perfection Peak (✨) - Craft memorable experiences
3. Discovery Station (🔬) - User research & validation
4. Data Constellation (📊) - Metrics-driven decisions
5. Intuition Vortex (🎯) - Trust your gut
6. Alignment Galaxy (🤝) - Stakeholder alignment
7. Chaos Cluster (🌪️) - Embrace uncertainty
8. Focus Singularity (🎯) - Ruthless prioritization

**Path Aliases**
Use `@/*` to import from root (configured in tsconfig.json):
```typescript
import { QuizAnswers } from '@/lib/types'
import InteractiveSpace from '@/components/InteractiveSpace'
import { questions } from '@/lib/questions'
```

### Design System

**Custom Tailwind Theme** (tailwind.config.ts)
- Void colors: `void` (#000000), `void-light` (#0a0a0a)
- Accent colors: `amber` (#ffb347), `crimson` (#dc143c), `ash` (#cccccc)
- Dark variants: `amber-dark`, `ash-dark`, `ash-darker`
- Custom animations: `glitch`, `float-slow`, `distort`
- Monospace font stack for terminal aesthetic

**Visual Aesthetic**
- Pure black void backgrounds
- Amber/gold primary accents
- Crimson highlights for contrast
- Terminal/monospace typography
- Scanlines overlay (5% opacity)
- Glitch effects triggered periodically

### Working with Transcripts

**Transcript Data Structure**
- 303 episodes in `episodes/{guest-name}/transcript.md`
- YAML frontmatter with metadata (guest, title, youtube_url, publish_date, keywords)
- Large files (25,000+ tokens typical)

**Pre-generated Data**
- `lib/episodesData.ts` contains all episode metadata
- Generated by `scripts/generate-episodes-data.js`
- Used by `/explore` page for fast searching/filtering
- Regenerate when transcripts are added/updated

**Best Practices for Transcript Access**
- Use `lib/allEpisodes.ts` utilities for search/filter
- Episode data is pre-loaded, no fs operations at runtime
- Topic index in `index/` provides keyword-based discovery
- See LENNY_TRANSCRIPTS_CLAUDE.md for detailed guidance

### State Management Approach

**Quiz Flow State**
- Tracks answers in `QuizAnswers` object (question ID → answer ID)
- Passes via URL params between routes: `/map?answers={encoded}`
- Contradiction selections passed similarly
- No global state management needed

**Route Flow**
```
/ (landing) 
  → /quiz (7 questions) 
  → /map (zone reveal) 
  → /contradictions (5 debates) 
  → /results (philosophy profile)

/explore (standalone episode browser)
```

### 3D Graphics with React Three Fiber

**InteractiveSpace Component**
- 10,000 foreground stars (amber, fast parallax)
- 3,000 deep space stars (amber-dark, slow parallax)
- Mouse-reactive with multi-layer parallax
- Red crimson particle trail following cursor
- Stars use additive blending for glow
- Real-time coordinate display (bottom-right)

**Performance Optimization**
- Stars generated once on mount
- Uses `useFrame` for animation loop
- Efficient buffer geometry
- Culling for off-screen particles

### Animation Libraries

**Framer Motion** - Page transitions, entrance animations, interactive elements
**React Three Fiber** - 3D graphics and particle systems
**Tailwind Animations** - Custom keyframes for glitch effects and floating

## User Flow & Experience

### Complete Journey
1. **Landing Page** - Animated 3D starfield, glitch effects, "INITIATE" CTA
2. **Quiz** - 7 questions with smooth transitions, progress bar
3. **Map Reveal** - Cosmic map zooms to user's primary zone, shows description
4. **Contradictions** - 5 PM debates, choose sides or "both perspectives matter"
5. **Results** - Philosophy profile with balance chart, superpower/blind spot, shareable

### Explore Page
- Search all 303 episodes by guest, title, keywords
- Filter by topics (multi-select)
- Sort by date, views, duration, guest name
- View episode cards with metadata
- Links to YouTube (external)

## Episode Data Management

### Generating Episode Data
When transcripts are added or updated:
```bash
node scripts/generate-episodes-data.js
```

This script:
- Reads all `episodes/*/transcript.md` files
- Extracts YAML frontmatter
- Parses content for additional metadata
- Generates `lib/episodesData.ts` with all episode data
- Builds searchable index

### Episode Metadata Structure
```typescript
{
  slug: string;              // guest-name
  guest: string;             // Full guest name
  title: string;             // Episode title
  youtube_url: string;       // YouTube video URL
  video_id: string;          // YouTube video ID
  publish_date: string;      // ISO date string
  description: string;       // Episode description
  duration_seconds: number;  // Duration in seconds
  duration: string;          // Formatted duration (e.g. "1:13:28")
  view_count: number;        // YouTube view count
  channel: string;           // "Lenny's Podcast"
  keywords: string[];        // Topic keywords
}
```

## Development Status

**✅ Complete (Sessions 1-5):**
- Landing page with 3D starfield
- Quiz flow with 7 questions
- Map reveal with zone placement
- Contradictions with 5 PM debates
- Results page with philosophy profile
- Explore page with all 303 episodes

**🚧 In Progress (Session 6):**
- Individual episode pages at `/episodes/[slug]`
- Transcript viewer with search
- Quote sharing functionality
- Enhanced map visualization (2D explorable world)
- Additional contradictions from transcripts

See BUILD_PROGRESS.md and ENHANCEMENT_PLAN.md for details.

## Design Philosophy

- **Zero runtime costs:** Pure client-side application, no API calls
- **Shareable by default:** Built for virality with Twitter integration
- **Grounded in content:** All zones and contradictions use real transcript quotes
- **Terminal aesthetic:** Dark, focused, intentional - honors the craft of PM work
- **Performance first:** Pre-generated data, efficient animations, fast load times
- **Delightful to explore:** Not just functional, but magical to use

## Important Notes

### Real Content Integration
All zones and contradictions reference real episodes and quotes. When adding content:
- Verify quotes against actual transcripts
- Include episode title and guest attribution
- Use episode slugs that match directory names
- Keep guest names consistent across all files

### Tailwind Class Patterns
- Use `void` and `void-light` for backgrounds
- Use `amber` for primary accents and interactive elements
- Use `crimson` for secondary accents and alerts
- Use `ash` variations for text hierarchy
- Border classes: `border-amber/20` for subtle, `border-amber` for active
- Hover states: `hover:border-amber hover:text-amber`

### Animation Patterns
- Page transitions: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Stagger delays: `transition={{ delay: 0.1 * index }}`
- Interactive elements: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`
- Use `AnimatePresence` with `mode="wait"` for route transitions

### Performance Considerations
- Episode data is large (303 episodes × ~500 bytes = ~150KB)
- Pre-generate at build time, not runtime
- Use virtual scrolling for long lists
- Lazy load 3D components on mobile
- Minimize bundle size with code splitting
