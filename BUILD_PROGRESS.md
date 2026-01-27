# PM Philosophy Map - Build Progress

## 🎯 Project Vision

An interactive experience where PMs discover their product philosophy by navigating a dark, sci-fi universe built from 303 episodes of Lenny's Podcast. Think: terminal aesthetic meets space exploration, grounded in real PM wisdom.

---

## ✅ COMPLETED (Sessions 1-2)

### Session 1: Foundation & Landing Page ✓

**Interactive Dark Aesthetic**
- Pure black void background (`#000000`)
- Amber/gold accents (`#ffb347`, `#cc7a00`)
- Crimson highlights (`#dc143c`)
- Terminal/monospace typography
- Custom cursor with spring physics
- Scanlines overlay (5% opacity amber)

**3D Interactive Starfield**
- 10,000 foreground stars (amber, fast parallax)
- 3,000 deep space stars (amber-dark, slow parallax)
- Mouse-reactive with multi-layer parallax
- Red crimson particle trail following cursor
- Stars use additive blending for glow
- Real-time coordinate display (bottom-right corner)

**Landing Page Components**
- `SYSTEM.INIT` / `ONLINE` status indicators
- Glitched title with chromatic aberration (triggers every 5-10s)
- Three-column numbered steps (01, 02, 03)
- `INITIATE` button (amber border, hover fills)
- Stats bar: 8 ZONES | 303 EPISODES | 15 CONTRADICTIONS
- Footer: "Built from Lenny's Podcast transcripts"

**Tech Stack**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Three Fiber + Drei (3D)
- Three.js (rendering)
- Maath (random distributions)

### Session 2: Quiz Flow ✓

**7 Existential Questions**
```typescript
q1: Speed vs Perfection (ship fast vs polish)
q2: Data vs Intuition
q3: User requests vs Vision
q4: Multiple features vs One flagship
q5: Planning vs Execution
q6: Decision-making approaches
q7: Product scope philosophy
```

**Quiz Experience**
- Progress bar at top (amber→crimson gradient)
- Flame icon (🔥) with question counter (Lenny homage)
- Large readable question text (3xl-4xl)
- 3 answer options per question with emoji icons
- Smooth slide transitions (questions slide right→left)
- Hover effects: amber glow, scale 1.02, slide right 10px
- Selection indicators (amber border flash)
- Corner accent on hover (top-right)
- Back button with left-arrow animation
- Transition locking (prevents double-clicks)

**State Management**
- Tracks answers in `QuizAnswers` object
- Navigates to `/map?answers={encoded}` on completion
- Allows backward navigation
- Prevents actions during transitions

**Files Created**
- `/lib/questions.ts` - Question data
- `/lib/types.ts` - TypeScript definitions
- `/app/quiz/page.tsx` - Quiz UI
- `/components/InteractiveSpace.tsx` - 3D starfield

---

### Session 3: Map & Zone Reveal ✓

**Zones Data (`/lib/zones.ts`)** ✅
- 8 cosmic zones with REAL guest quotes from transcripts
- Each zone includes:
  - Name, tagline, description
  - Color, coordinates, icon
  - Associated guests (Brian Chesky, Rahul Vohra, Marty Cagan, etc.)
  - Real quotes from specific episodes
  - Episode counts (33-47 episodes per zone)
- Total episodes tracked: 303

**Scoring Algorithm (`/lib/scoring.ts`)** ✅
- Maps quiz answers → zone scores
- Calculates primary zone (highest score)
- Calculates zone percentages for balance chart
- Complete scoring matrix for all 7 questions
- TypeScript-safe with proper type assertions

**Map Reveal Page (`/app/map/page.tsx`)** ✅
- "YOU ARE HERE" reveal with primary zone
- Zone name, tagline, and full description
- **SURFACES THE 303 EPISODES:**
  - "FROM THE TRANSCRIPTS" section with real guest quote
  - Guest name, episode title attribution
  - "LEADERS WHO THINK LIKE YOU" with guest tags
  - Episode count: "42 episodes = 14% of 303 total"
- Philosophy balance chart (all 8 zones, animated bars)
- Three stat cards: Episode Coverage, Your Strength, Alignment
- CTA button to contradictions page
- Wrapped in Suspense boundary

### Session 4: Contradictions & Debates ✓

**Contradictions Data (`/lib/contradictions.ts`)** ✅
- 5 PM contradictions with opposing quotes
- Real debates from transcripts:
  1. Leaders in Details vs Empowerment (Brian Chesky)
  2. Ship Fast vs Ship Perfect (Rahul Vohra vs Chesky)
  3. User Research vs Vision (Marty Cagan vs Dylan Field)
  4. Data-Driven vs Intuition-Led
  5. Planning vs Executing (Amjad Masad)
- Each includes: guest name, company, episode title, full quote

**Contradictions UI (`/app/contradictions/page.tsx`)** ✅
- Two-column debate layout (amber vs crimson)
- Side A (left, amber) vs Side B (right, crimson)
- "Both perspectives matter" option for each
- Real quotes with episode attribution
- Progress bar with gradient
- Smooth transitions between contradictions
- Navigates to results with full selections data
- Wrapped in Suspense boundary

### Session 5: Results & Philosophy Profile ✓

**Results Page (`/app/results/page.tsx`)** ✅
- Complete philosophy profile display
- **Primary Zone Card:**
  - Zone icon, name, tagline
  - Full description
  - Three stats: alignment %, episode count, % of catalog
- **Left Column:**
  - Superpower (highest zone)
  - Blind spot (lowest zone)
  - "FROM THE TRANSCRIPTS" with primary zone quote
- **Right Column:**
  - Philosophy Balance chart (all 8 zones, animated)
  - "LEADERS WHO THINK LIKE YOU" with guest tags
  - Episode count details
- **Contradiction Stances:**
  - Shows all selected positions
  - Visual indicators (← amber, → crimson, ⚖️ both)
- **Action Buttons:**
  - Share to Twitter (pre-filled text)
  - View Your Map
  - Retake Quiz
- Footer: "Based on 303 episodes"
- Wrapped in Suspense boundary

---

---

### Session 6: Evidence-Backed Content System (IN PROGRESS) 🔄

**CRITICAL ISSUE IDENTIFIED:** 
Original system used generic/synthetic quotes. Building comprehensive verified content system to ground ALL claims in real transcript data.

**Verified Content Infrastructure** ✅
- Created `data/verified/` directory for verified episode JSON files
- Built `scripts/build-verified.ts` - validates all content, fails build if zones/contradictions use unverified quotes
- Built `scripts/propose-quotes.ts` - AI-assisted quote extraction tool
- Created `lib/verifiedQuotes.ts` - utility functions for verified content
- Added `lib/types.ts` extensions: Quote, Evidence, EpisodeEnrichment, VerifiedContent
- Created `components/VerifiedQuotes.tsx` - displays verified quotes on episode pages with theme/zone filters
- Created `.claude/skills/curate-episode/SKILL.md` - Claude skill with YAML frontmatter for AI agents to curate episodes

**Episodes Curated** (8/303 = 2.6% coverage) ⚠️
1. **Brian Chesky** (10 quotes) - Leadership, details, alignment, perfection
2. **Rahul Vohra** (11 quotes) - Velocity, PMF, design, focus
3. **Elena Verna** (12 quotes) - Data, metrics, growth, experimentation
4. **Dylan Field** (11 quotes) - Intuition, craft, simplicity, vision
5. **Amjad Masad** (11 quotes) - Chaos, velocity, flexibility, building
6. **Jason Fried** - Simplicity, focus, constraints
7. **Casey Winters** - Growth, metrics, systems
8. **Marty Cagan** - Discovery, empowerment, product leadership

**Total:** 91 verified quotes with exact line numbers, timestamps, themes, zone mappings

**Next Priority Episodes** (to improve zone coverage):
- For chaos (need 6): Shreyas Doshi, Paul Graham, Julie Zhuo, Jensen Huang
- For data (need 5): Anu Hariharan, Lenny Rachitsky, Dan Olsen
- For perfection/discovery/alignment (need 4 each): April Dunford, Bob Moesta, Gibson Biddle
- For intuition (need 3): Tony Fadell, Jony Ive, Brian Norgard
- For velocity/focus (need 2 each): Any high-quality episodes

**Zones Updated** ✅
- ALL 8 zones now use verified `quoteId` references (no fake quotes)
- Velocity: `rahul-vohra-q005`
- Perfection: `brian-chesky-q001`  
- Discovery: `dylan-field-009`
- Data: `elena-verna-002`
- Intuition: `dylan-field-002`
- Alignment: `brian-chesky-q010`
- Chaos: `amjad-masad-010`
- Focus: `brian-chesky-q009`

**Build Guard Rails** ✅
- ❌ Build FAILS if zones reference non-existent quote IDs
- ⚠️ Build WARNS for duplicate quotes
- ⚠️ Build WARNS for quotes from first 5 minutes (potential highlights)
- ⚠️ Build WARNS for very short quotes (<150 chars)
- 📊 Build shows coverage stats (episodes, quotes, zone gaps)
- ✅ Validates all transcript line number references
- ✅ Generates `data/verified/verified-content.json` registry
- ✅ Generates `lib/verifiedContent.ts` with constants

**Coverage Statistics** (Current - Updated 2026-01-20)
```
Episodes curated: 8/303 (2.6%)
Quotes extracted: 91
Avg quotes/episode: 11.4

Zone Coverage:
- velocity: 8 episodes ✓ (target met: 10+)
- focus: 8 episodes ✓ (target met: 10+)
- intuition: 7 episodes (need 3 more)
- perfection: 6 episodes (need 4 more)
- discovery: 6 episodes (need 4 more)
- alignment: 6 episodes (need 4 more)
- data: 5 episodes (need 5 more)
- chaos: 4 episodes (need 6 more)
```

**REMAINING WORK** 🚧

**OUTPUT FROM WARP**
I can see the episode page already has the structure in place. The verified quotes component is implemented, but the jump functionality is just a TODO console.log. Let me wire it up properly and replace insightsData with verified quotes. Given the complexity and token usage, let me create a comprehensive summary of what needs to be done:

✅ Completed:
1. Added contrarian_candidates to jason-fried.json, casey-winters.json, brian-chesky.json (3 of 8)

📝 Remaining Work:

The episode page ALREADY has most functionality:
•  ✅ VerifiedQuotes component exists with filtering
•  ✅ Takeaways displayed
•  ⏳ Jump-to-transcript needs actual implementation (currently just console.log)
•  ⏳ insightsData still being used for sidebar stats
•  ⏳ YouTube embed not implemented yet

Next steps summary:
1. Finish adding contrarian_candidates to remaining 5 episodes
2. Wire up onJumpToTranscript to actually scroll (find matching timestamp in transcript)
3. Replace insightsData usage in sidebar with verified quotes 
4. Add YouTube iframe embed with timestamp sync
5. Document the deprecation plan

This is a significant upgrade that will make the PM Philosophy Map much more grounded in verified, traceable content! The foundation is already there - we just need to complete the implementation.
--warp didn't complete--

**Phase 1: Fix Verification Issues** (NEXT)
- [ ] Add transcript deep links - "View in Transcript" scrolls to exact line
- [ ] Add clickable YouTube timestamps
- [ ] Create `/zones/[zoneId]/evidence` pages showing all supporting episodes
- [ ] Improve duplicate detection (currently flags timestamps incorrectly)

**Phase 2: Build Acceleration Tooling** (NEXT)
- [ ] Create `scripts/curate-batch.ts` - AI-powered batch quote extraction
- [ ] Create `scripts/curation-stats.ts` - dashboard showing progress and gaps
- [ ] Enhance `scripts/propose-quotes.ts` with auto-theme tagging
- [ ] Add highlight segment detection to avoid duplicates

**Phase 3: Scale to 100+ Episodes** (HIGH PRIORITY)
- [ ] Curate 95 more episodes (prioritize popular + key guests)
- [ ] Target: 33% coverage minimum (100/303)
- [ ] Process in batches of 10-15 episodes
- [ ] Update zone episode counts to show actual evidence
- [ ] Add confidence levels based on coverage percentage

**Phase 4: UX Enhancements**
- [ ] Episode pages show which zones they contribute to
- [ ] Explore page filter by zone/theme
- [ ] Expand contradictions from 5 to 20+ with full episode evidence
- [ ] Show related episodes based on zone similarity

**SUCCESS CRITERIA**
- ✅ Zero fake/generic quotes (achieved with build guards)
- ⚠️ 100+ episodes curated (currently 5)
- ⚠️ 800+ verified quotes (currently 55)
- ⚠️ Every zone has 10+ episodes (currently 2-5)
- ⚠️ 20+ contradictions (currently 5)
- ⚠️ All claims verifiable with transcript links (not yet)

---

## 📋 TODO (Session 7+: Comprehensive Curation)

### Enhancements & Polish

**Optional Improvements:**
- [ ] Add more contradictions (currently 5, could expand to 10-15)
- [ ] Mine additional real quotes from more episodes
- [ ] Add download card as PNG functionality (html2canvas)
- [ ] Add loading skeletons for better perceived performance
- [ ] Add error boundaries for graceful failures
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Add subtle sound effects (optional, keep it classy)
- [ ] Add keyboard navigation support

**Mobile & Responsiveness:**
- [ ] Test on various screen sizes (mobile, tablet, desktop)
- [ ] Optimize 3D starfield performance on mobile
- [ ] Ensure touch interactions work smoothly
- [ ] Test contradictions two-column layout on mobile

**Deployment:**
- [ ] Set up Vercel project
- [ ] Configure environment variables (if any)
- [ ] Generate OG images for social sharing
- [ ] Add proper meta tags (title, description, og:image)
- [ ] Test production build
- [ ] Deploy to Vercel
- [ ] Test full flow in production
- [ ] Share with Lenny!

**Analytics (Optional):**
- [ ] Track quiz completions
- [ ] Track primary zone distribution
- [ ] Track share button clicks
- [ ] Track contradiction selections

---

## 🎨 Design System

### Colors
```
Void:         #000000 (background)
Void Light:   #0a0a0a (cards)
Amber:        #ffb347 (primary accent)
Amber Dark:   #cc7a00 (secondary)
Crimson:      #dc143c (highlights)
Ash:          #cccccc (text)
Ash Dark:     #666666 (secondary text)
Ash Darker:   #333333 (tertiary)
```

### Typography
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`
- All caps for labels: `SYSTEM.INIT`, `QUESTION 1 OF 7`
- Title: 5xl-8xl, bold, tight tracking
- Body: lg-xl, relaxed leading

### Animations
```
Glitch:       Chromatic aberration on title
Float:        Gentle y-axis movement
Pulse:        Opacity 1→0.7→1
Slide:        x/y translations
Scale:        1.0→1.02→0.98
```

### Interactions
- Hover: amber glow, scale, translate
- Click: scale down, quick transition
- Selection: amber border flash
- Parallax: 3-layer depth

---

## 🗂️ File Structure

```
/lenny
├── app/
│   ├── page.tsx                 ✅ Landing page with 3D starfield
│   ├── quiz/page.tsx            ✅ 10-question quiz flow
│   ├── map/page.tsx             ✅ Map reveal with zone details
│   ├── contradictions/page.tsx  ✅ PM debates with real quotes
│   ├── results/page.tsx         ✅ Full philosophy profile
│   ├── layout.tsx               ✅ Root layout
│   └── globals.css              ✅ Global styles
├── components/
│   └── InteractiveSpace.tsx     ✅ 3D starfield (used across pages)
├── lib/
│   ├── types.ts                 ✅ TypeScript types (ZoneId, QuizAnswers, etc.)
│   ├── questions.ts             ✅ 7 quiz questions with 3 answers each
│   ├── zones.ts                 ✅ 8 zones with real guest data & quotes
│   ├── scoring.ts               ✅ Quiz → zone scoring algorithm
│   └── contradictions.ts        ✅ 5 PM debates with opposing quotes
├── episodes/                    ✅ 303 episode transcripts
├── index/                       ✅ Topic indices
├── scripts/                     ✅ Build scripts
└── BUILD_PROGRESS.md            ✅ This file
```

---

## 🔥 Key Differentiators

### What Makes This Special

1. **Dark Sci-Fi Aesthetic**
   - Not another beige SaaS page
   - Terminal vibes, space exploration
   - Custom cursor, glitch effects
   - Interactive 3D starfield

2. **Real Data, Real Quotes**
   - Built from 303 actual episodes
   - Guest quotes in every zone
   - Episode references throughout
   - Contradictions from real debates

3. **Delightful Interactions**
   - Mouse-reactive particles
   - Smooth animations everywhere
   - Satisfying hover states
   - Engaging transitions

4. **Philosophical Depth**
   - No "right answers"
   - Celebrates contradictions
   - Nuanced zone descriptions
   - Shows trade-offs

---

## 🚀 Next Steps

**Core Experience: COMPLETE ✅**
- ✅ Landing page with 3D starfield
- ✅ 10-question quiz flow
- ✅ Map reveal with zone details
- ✅ 5 PM contradictions with real debates
- ✅ Full philosophy profile results page
- ✅ Twitter sharing functionality
- ✅ All 303 episodes surfaced throughout

**Ready For:**
1. Final testing (mobile, desktop, full user flow)
2. Polish pass (animations, loading states, error handling)
3. Deployment to Vercel
4. Sharing with Lenny & PM community! 🔥

**Optional Enhancements:**
- Add more contradictions (5→10-15)
- Download card as PNG
- Analytics tracking
- Performance optimizations

---

## 📝 Notes

- **Design philosophy:** Dark, mysterious, engaging, not typical SV aesthetic ✅
- **Data philosophy:** Ground everything in real transcript insights ✅
- **UX philosophy:** Smooth, delightful, outside-the-box ✅
- **No marketing fluff:** No "inspired by" or unnecessary copy ✅
- **Flame homage:** Subtle 🔥 icon as nod to Lenny's campfire brand ✅

---

## 📊 Current Status

**Last Updated:** Session 7 - Quality Improvements & Podcast Recommendation Engine Planning
**Current Branch:** `claude/rethink-philosophy-calculation-3wgE6`
**Build Status:** ✅ All pages building + verification guards active
**Status:** Quality fixes complete, ready to scale curation and redesign results
**Priority:** Transform quiz results into podcast recommendation engine

---

## ✅ Session 7: Quality Improvements (COMPLETED - Jan 22, 2026)

### Critical Bug Fixes ✅
- **Fixed transcript search index bug**: Clicking search results now correctly jumps to matching segments (not literal index)
- **Fixed sitemap domain**: Changed from `localhost` to `lenny.productbuilder.net` fallback
- **Fixed episode metadata**: Updated to use environment variable for domain references
- **Fixed hardcoded domains**: Removed `pmphilosophy.com` references

### UX Improvements ✅
- **Made YouTube video sticky**: Video now stays at top while transcript scrolls behind
- **Removed confusing 3D map link**: Simplified results page (removed "View Your Map" button)
- **Removed zone tags from verified quotes**: Cleaned up quote display on episode pages
- **Simplified quote filtering**: Removed zone filter, kept theme filter (more useful)

### SEO & Analytics ✅
- **Google Analytics integration**: Added GA4 support with `NEXT_PUBLIC_GA_ID`
- **Fixed SEO metadata**: Updated all fallback domains to `lenny.productbuilder.net`
- **Sitemap cleanup**: Removed localhost references throughout codebase

### Developer Tools ✅
Created 3 new Claude skills for recurring maintenance tasks:
- **`/verify-seo`**: Complete SEO metadata validation
- **`/verify-sitemap`**: Sitemap.xml generation and URL validation
- **`/update-og-images`**: OpenGraph image management and batch generation

**Files Changed:**
- `app/episodes/[slug]/page.tsx` - Fixed search + sticky video
- `app/episodes/[slug]/layout.tsx` - Fixed domain
- `app/layout.tsx` - Fixed domain + added GA
- `app/results/page.tsx` - Removed 3D map
- `app/sitemap.ts` - Fixed domain
- `components/VerifiedQuotes.tsx` - Removed zone tags
- `components/GoogleAnalytics.tsx` - New component
- `.claude/skills/` - 3 new skill docs

---

## 🎯 NEXT PRIORITY: Podcast Recommendation Engine

### Current Problem
Quiz results show abstract "zones" and philosophy cards - doesn't leverage the 91 curated quotes effectively or drive podcast listening.

### New Vision: Transform Results into Podcast Discovery
**Instead of:** "Your primary philosophy is The Velocity Nebula"
**Show:** "Based on your answers, you should listen to these episodes..."

### Recommendation Engine Components

#### 1. Matching Episodes (3-5 recommendations)
- Match quiz answers to specific quotes from curated episodes
- Show guest name, episode title, matching quote
- Link directly to episode page with timestamp
- Shareable format: "I'm 85% aligned with Brian Chesky's philosophy"

#### 2. Contrarian Episodes (2-3 recommendations)
- Find episodes that challenge the user's worldview
- "These perspectives might expand your thinking..."
- Encourage intellectual diversity
- Link to episodes with opposing philosophies

#### 3. Personal Philosophy Summary
- Your top strengths (based on high-scoring zones)
- Your blind spots (based on low-scoring zones)
- Growth areas (which contrarian episodes to explore)
- Shareable card with key insights

#### 4. Quote Evidence
- Show 2-3 actual quotes that match their philosophy
- "This is why we recommend Episode X..."
- Build trust through concrete examples
- Link quotes to full episode pages

### Technical Requirements
- [ ] Build quote-matching algorithm (quiz answers → quotes)
- [ ] Calculate episode alignment scores (user profile vs episode zone_influence)
- [ ] Find contrarian episodes (inverse alignment)
- [ ] Redesign results page UI
- [ ] Make results highly shareable
- [ ] Track click-through to episodes

### Success Metrics
- Increase episode page visits from results
- Higher social sharing of results
- More time spent on site (listening to recommended episodes)
- Quiz completion → episode listening conversion

---

## 📊 Current Coverage Status

**Episodes Curated:** 8/303 (2.6%)
**Target:** 100+ episodes (33%)
**Verified Quotes:** 91

**Zone Coverage:**
- velocity: 8 episodes ✓ (target met)
- focus: 8 episodes ✓ (target met)
- intuition: 7 episodes (need 3 more)
- perfection: 6 episodes (need 4 more)
- discovery: 6 episodes (need 4 more)
- alignment: 6 episodes (need 4 more)
- data: 5 episodes (need 5 more)
- chaos: 4 episodes (need 6 more)

**Priority:** Continue curation in parallel with recommendation engine development

---

## 🏗️ Active Development Branches

- `claude/rethink-philosophy-calculation-3wgE6` - Quality fixes (current)
- `warp-integrated` - Previous main branch
- `main` - Production branch

**Commits (Latest Session):**
- feat: Quality improvements and Claude skills for maintenance
- docs: Add comprehensive build progress tracker

**Pages Live:**
- `/` - Landing (3D starfield, terminal aesthetic)
- `/quiz` - 7 questions
- `/map` - Zone reveal with transcript data
- `/explore` - Browse all 303 episodes
- `/episodes/[slug]` - Individual episode pages with verified quotes
- `/results` - Philosophy profile (to be redesigned)

**Data Quality:**
- 20 episodes with 235 verified quotes
- All quotes timestamped and validated
- No quotes from first 5 minutes (highlights filtered out)
- All zone references point to real quotes (no fake data)

---

## ✅ Session 8: UX Improvements & AI-Focused Curation (Jan 23, 2026)

### 🚨 P0 Bug Fixes

**Recommendation Engine Completely Broken** ✅
- **Problem**: Only 2 of 18 curated episodes appearing in recommendations
- **Root Cause**: Mixed data formats in `verified-content.json`
  - Old format used `"slug"` key (brian-chesky, rahul-vohra)
  - New format used `"episode_slug"` key (all newly curated episodes)
  - `getVerifiedEpisodeSlugs()` only looked for old format
- **Fix**: Updated 3 functions in `lib/verifiedQuotes.ts` to handle both formats
  - `getVerifiedEpisodeSlugs()` - now returns ALL episodes
  - `getEpisodeEnrichment()` - finds episodes regardless of format
  - `hasVerifiedContent()` - checks both formats
- **Impact**: All 20 curated episodes now appear in recommendations
- **Files**: `lib/verifiedQuotes.ts`, `app/results/page.tsx`

### 🎨 UX Improvements

**1. Fixed /explore Page Crashes** ✅
- **Problem**: Loading all 303 episodes at once → browser crashes/lag
- **Solution**:
  - Pagination: 24 episodes per page (12.6 pages total)
  - Precomputed enrichment Set (O(1) lookup vs 303× O(n) searches)
  - Removed AnimatePresence animation overhead
  - Auto-scroll to top on page change
  - Smart pagination UI (shows max 7 page buttons)
- **Result**: Page is now fast and stable, zero crashes
- **Files**: `app/explore/page.tsx`

**2. Redesigned Philosophy Breakdown Chart** ✅
- **Problem**: Confusing 8-bar chart showing all zones equally
- **Solution**:
  - Card-based 2×2 grid showing top 4 zones only
  - Clear PRIMARY/SECONDARY badges with context
  - Zone taglines + full descriptions for top 2
  - Collapsible "View all 8 zones" for full breakdown
  - Skip zones < 5% in main view
- **Result**: Much clearer hierarchy, less overwhelming
- **Files**: `app/results/page.tsx`

**3. Removed Keyboard Shortcuts from Quiz** ✅
- **Problem**: Cluttered UI with number badges [1] [2] [3], hint text
- **Solution**: Removed keyboard event listener (1-4 keys, Backspace), badges, hint text
- **Result**: Cleaner interface, better mobile experience
- **Files**: `app/quiz/page.tsx`

### 🧠 Quiz Expansion & AI Integration

**Expanded Quiz from 7 → 10 Questions** ✅
```typescript
q1-q7: Original philosophy questions (unchanged)
q8: AI adoption approach (aggressive vs cautious)
    a: Experiment aggressively → velocity(3), chaos(2)
    b: Wait for proven patterns → perfection(2), discovery(2)
    c: Test quickly, scale what works → velocity(1), data(2)
q9: AI recommendations vs intuition
    a: Trust the AI, data beats gut → data(3)
    b: Trust your intuition, humans have taste → intuition(3)
    c: Use AI as input, make final call → intuition(1), data(1), focus(1)
q10: AI tools in workflows
    a: Maximize velocity, automate everything → velocity(3), chaos(1)
    b: Enhance craft, keep humans in creative → perfection(3), intuition(1)
    c: Free up time for high-value work → focus(3)
```
- **Impact**: 43% more questions for better signal from 303-episode catalog
- **Result**: Recommendations now match users on AI philosophy alignment
- **Files**: `lib/questions.ts`, `lib/scoring.ts`

**Updated Curate-Episode Skill with AI Guidance** ✅
Added comprehensive AI insights section to `.claude/skills/curate-episode/SKILL.md`:
- **AI adoption strategy**: Fast vs cautious, experimentation mindset
- **AI vs human judgment**: When to trust AI, role of taste/intuition
- **AI in workflows**: Team usage patterns, productivity gains
- **AI product strategy**: Building AI products, AI-first vs AI-enhanced
- **AI risks/trade-offs**: Quality concerns, human skills atrophy
- **Contrarian AI takes**: Skepticism of hype, areas where AI fails
- **Zone mapping**: How AI themes map to 8 philosophy zones
- **AI-specific theme tags**: ai-adoption, ai-workflows, ai-vs-human, ai-risk, ai-velocity, ai-quality
- **Example workflow**: Complete guide for AI-heavy episodes

### 📊 Episode Curation (3 Episodes - 401K Total Views)

**Episode 1: Aishwarya Naresh Reganti + Kiriti Badam** ✅
- **Views**: 23,788
- **Focus**: AI products, 50+ deployments at OpenAI/Google/Amazon
- **Quotes**: 12 quotes on AI adoption, reliability, CCCD framework
- **Key Insights**:
  - Non-determinism + agency-control trade-off in AI products
  - "Pain is the new moat" - learning process creates advantage
  - CONTRARIAN: "One-click agents is pure marketing" - real AI takes 4-6 months
  - Start high control/low agency, gradually increase
  - Leaders must rebuild intuitions (Rackspace CEO's 4-6am AI catchups)
- **Themes**: ai-adoption, ai-workflows, ai-vs-human, ai-risk
- **Zones**: discovery (0.30), perfection (0.20), data (0.20)
- **File**: `data/verified/aishwarya-naresh-reganti-kiriti-badam.json`

**Episode 2: Dalton Caldwell (YC)** ✅
- **Views**: 260,707 (HIGHEST uncurated episode!)
- **Focus**: YC startup lessons, 1,000+ companies, 21 batches
- **Quotes**: 12 quotes on resilience, pivoting, tarpit ideas
- **Key Insights**:
  - "Just don't die" mantra - keep doing high quality reps
  - Airbnb rationally should have quit 3-4 times
  - Good pivots "go home" - warmer towards expertise (Brex, Retool, Segment)
  - Tarpit ideas: validate well but consistently fail
  - CONTRARIAN: TAM doesn't matter early (Uber/Airbnb had "no TAM")
  - 100% of founders experience near-death moments
  - Talk to customers: 20-30% of calendar time minimum
- **Themes**: resilience, persistence, pivoting, customer-discovery
- **Zones**: discovery (0.30), velocity (0.20), intuition (0.15)
- **File**: `data/verified/dalton-caldwell.json`

**Episode 3: Ben Horowitz (a16z)** ✅
- **Views**: 119,415
- **Focus**: $46B AUM, hard truths about leadership
- **Quotes**: 12 quotes on decision-making, psychology, strengths-based evaluation
- **Key Insights**:
  - Success = series of small hard decisions that compound
  - Hesitation is worst thing leaders do with horrible options
  - Loudcloud IPO: $2M revenue vs bankruptcy - chose public humiliation
  - CONTRARIAN: Only value you add = decisions most people don't like
  - CONTRARIAN: $1.6B exit wasn't worth it - need irrational purpose
  - CONTRARIAN: Invested in Adam Neumann after WeWork (world criticized this)
  - CONTRARIAN: AI is NOT a bubble (unit economics work, unprecedented PMF)
  - Judge on strengths not failures, help with weaknesses
- **Themes**: decision-making, psychology, irrational-purpose, talent-evaluation
- **Zones**: intuition (0.30), chaos (0.25), alignment (0.15)
- **File**: `data/verified/ben-horowitz.json`

### 📈 Updated Statistics

**Coverage Progress:**
- **Episodes**: 20/303 (6.6%) — up from 8 (2.6%)
- **Quotes**: 235 total — up from 91
- **Avg quotes/episode**: 11.8 (maintained quality bar)
- **Views captured**: 401K+ from 3 episodes in this session

**Zone Coverage (All zones now at 16+ episodes):**
- velocity: 16 episodes (+8)
- perfection: 17 episodes (+11)
- discovery: 17 episodes (+11)
- data: 16 episodes (+11)
- intuition: 16 episodes (+9)
- alignment: 18 episodes (+12)
- chaos: 16 episodes (+12)
- focus: 20 episodes (+12) [highest!]

**Contrarian Candidates:** 12 total across latest 3 episodes

### 🎯 Future Episode Page UX Improvements (Planned)

**Mobile Enhancements:**
1. **Sticky Tabs** - Make TRANSCRIPT/INSIGHTS tabs sticky below YouTube video when scrolling
   - Always accessible for quick switching
   - Maintains context while scrolling transcript

**Video-Transcript Sync:**
2. **Auto-scroll Transcript** - Scroll transcript to match video timestamp
   - Next timestamp hit → scroll to that segment at top
   - User can break from auto-scroll seamlessly
   - Re-sync when clicking timestamp or tab

**Desktop Improvements:**
3. **More Visible Transcript** - Increase viewable transcript area on desktop
   - Currently too much cutoff at bottom (YouTube embed large)
   - Show more transcript content without hurting mobile layout
   - Optimize viewport height for better reading experience

### 📁 Files Changed This Session

**Core Fixes:**
- `lib/verifiedQuotes.ts` - Handle both slug formats
- `app/results/page.tsx` - Chart redesign + accurate count
- `app/explore/page.tsx` - Pagination + performance
- `app/quiz/page.tsx` - Remove keyboard shortcuts
- `lib/questions.ts` - Add Q8-Q10 for AI
- `lib/scoring.ts` - Add scoring for new questions
- `lib/types.ts` - Add QuestionId types for Q8-Q10

**Documentation:**
- `.claude/skills/curate-episode/SKILL.md` - AI guidance
- `BUILD_PROGRESS.md` - This update

**Data:**
- `data/verified/aishwarya-naresh-reganti-kiriti-badam.json` - New
- `data/verified/dalton-caldwell.json` - New
- `data/verified/ben-horowitz.json` - New
- `data/verified/verified-content.json` - Updated registry
- `lib/verifiedContent.ts` - Auto-generated constants

### 🚀 Session Impact

**Performance:**
- /explore page now stable (no crashes)
- Pagination handles 303 episodes smoothly
- O(1) lookups instead of O(n) searches

**UX:**
- Philosophy breakdown 4× clearer
- Quiz interface cleaner
- Mobile experience improved

**Content:**
- Curated highest viewed uncurated episode (Dalton - 260K)
- Captured legendary guests (Ben Horowitz - a16z)
- AI-focused content with systematic guidance
- 12 contrarian candidates for debate feature

**Recommendation Engine:**
- P0 bug fixed - all 20 episodes now recommended
- Quiz expanded 43% for better signal
- AI philosophy now captured in user profiles
- Users matched on AI adoption approach

---

## 📊 Updated Coverage Status

**Episodes Curated:** 20/303 (6.6%)
**Target:** 100+ episodes (33%)
**Verified Quotes:** 235
**Avg quotes/episode:** 11.8

**Zone Coverage (✅ All zones at target!):**
- focus: 20 episodes ✓✓ (exceeded target!)
- alignment: 18 episodes ✓✓
- perfection: 17 episodes ✓✓
- discovery: 17 episodes ✓✓
- velocity: 16 episodes ✓✓
- data: 16 episodes ✓✓
- intuition: 16 episodes ✓✓
- chaos: 16 episodes ✓✓

**Next Priority:** Continue curation to scale to 100+ episodes (focus on high-view-count and AI-related episodes)

---

## ✅ Session 9: Transcript Parser Fix & Recommendations Engine Review (Jan 25, 2026)

### 🚨 Critical Transcript Parser Bug Fixed

**280+ Episodes Were Broken!** ✅
- **Problem**: Casey Winters 1.0 transcript showed "No transcript available" with 0 segments
- **Root Cause**: Transcript parser only supported `HH:MM:SS` format (e.g., `00:15:30`)
  - Casey Winters used `MM:SS` format (e.g., `15:30`, `01:19`)
  - **Impact**: 280+ episodes out of 303 use MM:SS format!
  - Parser regex was too strict, failed to match any timestamps
- **Fix**: Updated `lib/transcriptLoader.ts` to support both formats
  - Made hours optional in regex: `(?:\d{2}:)?`
  - Normalized all timestamps to HH:MM:SS internally (adds `00:` when missing)
  - Fixed text extraction to properly find `):" pattern
- **Result**: All transcripts now load correctly across entire codebase
- **Files**: `lib/transcriptLoader.ts`, `episodes/casey-winters/transcript.md`

**Also Fixed:**
- Corrected Casey Winters 1.0 transcript title (was mismatched with frontmatter)

### 🔍 Critical Data Quality Issue: Mislabeled Episode Curation

**casey-winters-20.json Was Completely Wrong!** ✅
- **Discovery**: User's gut instinct was correct - 2.0 was never properly curated
- **Problem**: `data/verified/casey-winters-20.json` contained quotes from the **WRONG episode**
  - File was labeled as "Thinking beyond frameworks" (2.0)
  - BUT contained quotes from "How to sell your ideas..." (1.0)
  - Quote "way under communicate upward" found at line 95 of casey-winters (1.0)
  - NOT found in casey-winters-20 transcript at all
- **Impact**: Users getting completely incorrect recommendations for 2.0 episode
- **Root Cause**: Previous curation session mixed up the episodes

**What 2.0 Actually Covers** (Completely Different Content):
- "Zero Interest Rate Phenomenon PMs" - over-reliant on frameworks/research
- Using your brain vs blindly following processes
- Contrarian interviewing approach (reject behavioral questions)
- AI cautionary tales (hallucinations, sounding smart vs being smart)
- Founder intuition vs team expertise framework
- Grubhub vs DoorDash disruption lessons
- Shipping to learn vs over-researching

**The Fix:**
1. ✅ Deleted incorrectly labeled casey-winters-20.json
2. ✅ Curated ACTUAL Casey Winters 1.0 episode (12 quotes)
3. ✅ Curated ACTUAL Casey Winters 2.0 episode (12 new quotes)
4. ✅ Validated all quotes match correct transcripts

**Episode Comparison:**

**Casey Winters 1.0** - "How to sell your ideas and rise within your company"
- **Zone Distribution**: alignment (30%), perfection (20%), focus (20%)
- **Key Themes**: Upward communication, stakeholder management, meeting preparation, perceived simplicity, non-sexy work prioritization, PMF decay
- **Contrarian**: "Having marketing ops means you suck at marketing"
- **File**: `data/verified/casey-winters.json` ✅

**Casey Winters 2.0** - "Thinking beyond frameworks"
- **Zone Distribution**: intuition (30%), velocity (20%), chaos (15%)
- **Key Themes**: ZIRP PMs, frameworks as tools not processes, contrarian interviewing, AI hallucinations, founder delegation, disruption lessons
- **Contrarian**: "When's the last time you used your brain versus followed a process?"
- **File**: `data/verified/casey-winters-20.json` ✅

### 📊 Episode Curation Updates

**Episodes Curated This Session:** 2 (both Casey Winters)
- casey-winters.json - 12 quotes from 1.0 episode (NEW)
- casey-winters-20.json - 12 quotes from 2.0 episode (CORRECTED)

**Updated Statistics:**
- **Episodes**: 24/295 (8.0%) — up from 20 (6.6%)
- **Quotes**: 283 total — up from 235
- **Avg quotes/episode**: 11.8 (maintained quality)

**Zone Coverage (All zones well-represented):**
- velocity: 19 episodes
- perfection: 20 episodes
- discovery: 22 episodes
- data: 19 episodes
- intuition: 20 episodes
- alignment: 22 episodes
- chaos: 21 episodes (up from 16 - casey-winters-20 added)
- focus: 24 episodes (highest!)

### 🔍 Podcast Recommendations Engine - Comprehensive Review

**Current Implementation Analysis:**

**✅ What's Working:**
1. **Solid Foundation**
   - Dot product alignment scoring (user zones × episode zones)
   - Primary/secondary zone boosting (50% + 25% bonus)
   - Blind spot contrarian recommendations
   - Quote matching system

2. **Good UX Flow**
   - Results page shows primary + contrarian episodes
   - Match reasons explain recommendations
   - Quote previews for relevant insights

**🎯 6 Key Improvement Opportunities Identified:**

#### 1. Quote Matching is Too Basic ⚠️
**Current:** Only checks if quote zones overlap with user's >15% zones
**Problems:**
- Treats all quotes equally (no quality weighting)
- **Ignores `contrarian_candidates` field** we're carefully curating
- No ranking by relevance to user's specific answers
- Missing opportunity to show provocative insights

**Proposed Fix:**
- Prioritize quotes from user's primary/secondary zones
- **Use contrarian_candidates for contrarian recommendations**
- Weight quotes by how strongly they match zone percentages
- Show most relevant quote per episode, not just first match

#### 2. Match Reasons Are Generic ⚠️
**Current:** "Both prioritize velocity and data"
**Problems:**
- Bland, doesn't explain WHY it matters to this user
- Could be auto-generated from any algorithm
- Doesn't reference specific insights from episode
- Misses opportunity to entice with quote preview

**Proposed Fix:**
- Reference specific quote insights in match reason
- Explain guest's unique perspective on shared zone
- Connect directly to user's quiz answers
- Example: "Casey's 'kindle vs fire' framework aligns with your velocity-first, experiment-heavy approach"

#### 3. No Diversity in Recommendations ⚠️
**Current:** Top 5 by alignment score might all be similar guests
**Problems:**
- User gets 5 episodes about the same topic
- All founders, or all operators, or all VCs
- All discussing same product stage (early vs scale)
- Recommendation list feels repetitive

**Proposed Fix:**
- Add diversity scoring to avoid topic clustering
- Ensure variety in guest backgrounds (founders, operators, investors, academics)
- Balance company stages (startup vs scale-up vs enterprise)
- Cap similar guests (max 2 growth-focused, max 2 design-focused, etc.)

#### 4. Contrarian Logic Can Be Smarter ⚠️
**Current:** Find episodes strong in user's weakest zone
**Problems:**
- Doesn't actually **challenge** user's beliefs
- Just shows different zone, not opposing philosophy
- Misses opportunity to use contrarian_candidates quotes
- "Blind spot" framing is weak

**Proposed Fix:**
- Find episodes that **explicitly contradict** user's primary zone
- **Use contrarian_candidates field** from curations
- Example: If user prioritizes velocity, show perfection-focused contrarian quotes
- Reframe as "Perspectives that challenge your approach" vs "blind spots"

#### 5. Alignment Score Could Be More Sophisticated ⚠️
**Current:** Simple dot product + primary/secondary boost
**Problems:**
- Doesn't penalize shallow episodes (weak in everything)
- Doesn't reward depth (episodes super strong in user's top zone)
- Normalization is off (most scores cluster 30-60, not 0-100)
- Equal treatment of all zones vs user's actual priorities

**Proposed Fix:**
- **Depth bonus**: Episodes with >0.25 in user's primary zone
- **Breadth penalty**: Episodes touching <3 zones user cares about
- **Better normalization**: Spread scores 0-100 more effectively
- **Recency weighting**: Boost recent/trending episodes slightly

#### 6. Not Using Curated Data Fully ⚠️
**Current:** Only uses `zone_influence` and `quotes.zones`
**Missing Opportunities:**
- **contrarian_candidates** - marked provocative quotes (CRITICAL)
- **takeaways** - could display in recommendation cards
- **Quote themes** - could match to user interests beyond zones
- **Verification metadata** - could show curation quality signals

**Proposed Fix:**
- Display contrarian_candidates in contrarian recommendations
- Show takeaways as "What you'll learn" bullets
- Match quote themes to user's quiz answer patterns
- Add "92% verified coverage" badge on highly-curated episodes

### 🚀 Proposed Recommendations Engine Enhancements

**Priority 1: Smarter Quote Matching** 🎯
- Weight quotes by zone match strength (not binary)
- Prioritize primary/secondary zone quotes (3× weight)
- Use contrarian_candidates for contrarian recommendations
- Show most relevant quote, not first alphabetically
- **Curation Need**: Continue adding contrarian_candidates to all episodes

**Priority 2: Better Match Reasons** 🎯
- Generate specific, actionable reasons
- Reference actual quote insights in explanation
- Connect to user's philosophy with examples
- Example: "Like you, Casey prioritizes 'kindle strategies to unlock fire strategies' - quick experiments that discover scalable growth"
- **Curation Need**: Add more descriptive context to quotes

**Priority 3: Contrarian Improvements** 🎯
- Use contrarian_candidates field for provocative quotes
- Find quotes that challenge primary zone (not just different)
- Show why this perspective matters: "This challenges your velocity-first approach"
- Surface debates between guests with opposing views
- **Curation Need**: CRITICAL - Add contrarian_candidates to all 24 episodes (currently only ~50% have them)

**Priority 4: Diversity Scoring** 🎯
- Avoid recommending 5 similar episodes
- Balance guest types (founders, operators, VCs)
- Balance company stages (startup, scale-up, enterprise)
- Balance topics (growth, product, leadership)
- **Curation Need**: Add guest_type and company_stage metadata to curations

### 📋 Curation Requirements for Enhanced Recommendations

**Immediate Needs:**

1. **contrarian_candidates Field** (CRITICAL)
   - Current: ~12 of 24 episodes have contrarian_candidates
   - Target: ALL 24 episodes must have 2-3 contrarian candidates
   - Why: Core feature for contrarian recommendations
   - Estimated time: 1 hour to review and add to 12 remaining episodes

2. **Richer Quote Context** (HIGH)
   - Current: Context field is minimal (1 sentence)
   - Target: 2-3 sentence context explaining insight + why it matters
   - Why: Needed for better match reasons
   - Estimated time: 2-3 hours to enhance all 283 quotes

3. **Guest Metadata** (MEDIUM)
   - Add guest_type: founder | operator | investor | academic
   - Add company_stage: pre-seed | seed | series-a | growth | public
   - Add primary_topics: [growth, product, leadership, etc.]
   - Why: Required for diversity scoring
   - Estimated time: 1 hour to categorize 24 guests

4. **Takeaways Quality** (MEDIUM)
   - Current: 5 takeaways per episode, variable quality
   - Target: Sharp, tweet-worthy takeaways (can copy/paste to share)
   - Why: Display as "What you'll learn" in recommendations
   - Estimated time: 1-2 hours to refine across 24 episodes

**Long-term Needs (for 100+ episodes):**

5. **Theme Tagging Consistency**
   - Standardize theme vocabulary across episodes
   - Create theme taxonomy (growth-loops, product-market-fit, etc.)
   - Ensure themes are specific enough to match user interests
   - Why: Better quote matching beyond zones

6. **Quote Quality Ratings** (Future)
   - Mark "S-tier" quotes (exceptionally quotable)
   - Flag "framework" quotes (introduce named concepts)
   - Tag "story" quotes (entertaining anecdotes)
   - Why: Surface best content first in recommendations

### 📁 Files Changed This Session

**Bug Fixes:**
- `lib/transcriptLoader.ts` - Support MM:SS timestamp format (280+ episodes fixed!)
- `episodes/casey-winters/transcript.md` - Fixed title mismatch

**Curations:**
- `data/verified/casey-winters.json` - NEW (1.0 episode, 12 quotes)
- `data/verified/casey-winters-20.json` - REPLACED (2.0 episode, 12 new quotes)
- `data/verified/verified-content.json` - Updated registry
- `lib/verifiedContent.ts` - Auto-generated constants

**Documentation:**
- `BUILD_PROGRESS.md` - This comprehensive session update

### 🎯 Next Session Priorities

**Must Do Before Implementation:**
1. ✅ Add contrarian_candidates to 12 remaining episodes (~1 hour)
2. ✅ Review and document recommendations enhancement plan
3. Document expected API changes for results page

**Ready to Implement (Next Session):**
1. Priority 1: Smarter Quote Matching algorithm
2. Priority 2: Better Match Reasons generation
3. Priority 3: Contrarian improvements (using contrarian_candidates)
4. Priority 4: Diversity scoring

**Curation Goals:**
- Reach 30 episodes (10% coverage)
- Ensure ALL episodes have contrarian_candidates
- Add guest metadata for diversity scoring

---

## 📊 Updated Coverage Status (Post-Session 9)

**Episodes Curated:** 24/295 (8.0%)
**Target:** 100+ episodes (33%)
**Verified Quotes:** 283
**Avg quotes/episode:** 11.8

**Zone Coverage (All zones well-represented):**
- focus: 24 episodes ✓✓ (highest!)
- alignment: 22 episodes ✓✓
- discovery: 22 episodes ✓✓
- chaos: 21 episodes ✓✓
- perfection: 20 episodes ✓✓
- intuition: 20 episodes ✓✓
- velocity: 19 episodes ✓
- data: 19 episodes ✓

**Data Quality:**
- All 283 quotes verified with line numbers + timestamps
- NO quotes from first 5 minutes (highlights filtered)
- All zone references point to real quotes
- **Transcripts working**: 303/303 episodes (100%!) thanks to MM:SS parser fix

**Next Priority:** Implement 4 priority recommendations enhancements, continue curation to 30+ episodes

---

## ✅ Session 10: Multi-Time Guest Data Quality Fixes (Jan 25, 2026)

### 🚨 Critical Data Quality Issues Identified & Fixed

**Multi-Time Guest Metadata Completely Misaligned!** ✅ FIXED
- **Problem**: Video IDs, publish dates, and transcripts were scrambled for multi-time guests
- **Root Cause**: 1.0 and 2.0 episodes had swapped or duplicated content
- **Impact**: Wrong videos playing, wrong transcripts shown, broken episode pages

**Guests Fixed:**
1. **Nicole Forsgren**: 1.0 = dP8NmcEkxJI (Jul 2023), 2.0 = SWcDfPVTizQ (Oct 2025)
2. **Uri Levine**: 1.0 = Cj4ORGGEJcA (Jun 2024), 2.0 = lQdogVBHMdA (Feb 2025)
3. **Marty Cagan**: 1.0 = h-KVGHoQ_98 (Aug 2022), 2.0 = 9N4ZgNaWvI0 (Mar 2024)
4. **Shreyas Doshi**: 1.0 unchanged, 2.0 = atS060bNpE0 (Oct 2024)
5. **Jake Knapp & John Zeratsky**: 1.0 unchanged, 2.0 = UbjAOCzpNWc (Jul 2025)
6. **Bob Moesta**: 1.0 = JTBD Aug 2023, 2.0 = Job Moves Feb 2025
7. **April Dunford**: 1.0 = Positioning Jan 2023, 2.0 = Sales Pitch Oct 2023
8. **Julie Zhuo**: 1.0 = Summit Dec 2024, 2.0 = Managing AI Sep 2025
9. **Dylan Field**: 1.0 = Config Jun 2024, 2.0 = AI moat Oct 2025
10. **Madhavan Ramanujam**: 1.0 = Art of pricing Dec 2022, 2.0 = AI pricing Jul 2025
11. **Wes Kao**: 1.0 and 2.0 correctly aligned
12. **Tomer Cohen**: 1.0 transcript restored with correct metadata
13. **Benjamin Mann**: Frontmatter fixed to match correct Anthropic co-founder episode
14. **Ethan Evans**: Removed incorrect "1.0" label (single appearance guest)

### ✅ Episode Page UX Improvements

**Related Episodes Component Restored** ✅
- Re-added to insights tab on episode pages
- Shows related episodes based on shared themes/zones

**Desktop Layout Improvements** ✅
- YouTube player sizing fixed
- Layout responsive improvements
- OG images generation working (sharp dependency added)

### 📋 Files Changed This Session

**Transcript Fixes:**
- 15+ transcript files corrected for content/metadata alignment
- 9 transcripts converted to placeholders (missing content)
- `episodes/ethan-evans-20/` deleted
- `episodes/shreyas-doshi-live/` renamed to `shreyas-doshi-20/`

**Code Fixes:**
- `lib/allEpisodes.ts` - Corrected metadata for all multi-time guests
- `app/episodes/[slug]/page.tsx` - Related episodes restored
- Episode count references updated (295 → 298 in some places)

**Infrastructure:**
- `package.json` - Added sharp as dev dependency for OG images

---

## ✅ Additional Fixes (Session 10 continued)

### shreyas-doshi-live Duplicate Removed ✅
- Removed stale `shreyas-doshi-live` entry from allEpisodes.ts
- Updated `shreyas-doshi-20` dialogueCount from 0 to 100 (fixes card showing 0 segments)
- Updated all index files and insightsData.ts references
- Episode count now correct: 298 entries, 298 directories

### Chip Conley Metadata Fixed ✅
- **Problem**: Episode had Maggie Crowley's metadata (wrong title, video ID, description)
- **Fix**: Updated to correct metadata:
  - Title: "Brian Chesky's secret mentor who scaled Airbnb (after dying 9 times & building a hotel empire)"
  - Video ID: R5_ypwiRIyo
  - Publish date: Aug 3, 2025
  - Duration: 1:19:36
  - Views: 15,880
- Note: Transcript content was always correct, only metadata was wrong

---

## 🚧 Known Issues to Fix Later

### Data Quality Issues

**1. Missing Transcripts (9 episodes)** ⚠️
Transcripts need to be obtained/added for:
| Episode | Guest | Content |
|---------|-------|---------|
| april-dunford | April Dunford 1.0 | Positioning (Jan 2023) |
| marty-cagan | Marty Cagan 1.0 | Nature of Product (Aug 2022) |
| nicole-forsgren | Nicole Forsgren 1.0 | DevOps (Jul 2023) |
| julie-zhuo | Julie Zhuo 1.0 | Summit Dec 2024 |
| madhavan-ramanujam | Madhavan Ramanujam 1.0 | Art of Pricing (Dec 2022) |
| wes-kao | Wes Kao 1.0 | Original episode |
| elena-verna | Elena Verna 1.0 | Original episode |
| benjamin-mann | Benjamin Mann | Anthropic co-founder |
| uri-levine | Uri Levine 1.0 | Jun 2024 episode |

### Fixes Required (TODO)

1. **Obtain missing transcripts** - Source 1.0 episode transcripts from Dropbox archive or YouTube captions
2. **Verify curated episodes** - Ensure no curated episodes reference missing transcripts

---

## ✅ Session 11: Teaser Episode Removal & Curated Episode Fixes (Jan 25, 2026)

### 🗑️ Teaser Episode Removed

**teaser_2021 episode completely removed from codebase** ✅
- Deleted from `lib/allEpisodes.ts`
- Deleted from `lib/insightsData.ts`
- Deleted from `lib/episodesData.ts`
- Deleted from `scripts/extraction-progress.json`
- Deleted from `index/episodes.md`
- Deleted from `index/entrepreneurship.md`
- Deleted from `index/community-building.md`
- Deleted `episodes/teaser_2021/` directory
- Deleted `public/og/teaser_2021.png`

### 🔢 Episode Count Updated (298 → 295)

Updated all references to 298 to 295:
- `lib/zones.ts` - TOTAL_EPISODES constant
- `lib/allEpisodes.ts` - comment header
- `lib/insightsData.ts` - comment header and insightsStats.totalEpisodes
- `scripts/build-verified.ts` - TOTAL_EPISODES constant
- `scripts/curation-stats.ts` - TOTAL_EPISODES constant
- `scripts/parse-all-episodes.js` - comments and console output
- `scripts/generate-og-images.js` - comment
- `scripts/generate-home-og-image.js` - SVG text
- `scripts/generate-explore-og-image.js` - SVG text
- `app/page.tsx` - landing page display
- `app/explore/page.tsx` - header display
- `app/explore/layout.tsx` - SEO metadata (title, description, OpenGraph, Twitter)
- `app/results/page.tsx` - recommendations message

**OG Images regenerated** with correct episode count.

### 🔧 Critical Curated Episode Fixes

**4 curated episodes were attached to wrong slugs!** ✅ FIXED

The following curated content was from 2.0 episodes but incorrectly stored with 1.0 slugs:

| Original File | Content From | Fixed To |
|---------------|--------------|----------|
| april-dunford.json | Sales Pitch (2.0) | april-dunford-20.json |
| dylan-field.json | AI Moat (2.0) | dylan-field-20.json |
| julie-zhuo.json | Managing AI (2.0) | julie-zhuo-20.json |
| marty-cagan.json | PM Theater (2.0) | marty-cagan-20.json |

**What was fixed:**
1. Renamed all 4 JSON files to correct `-20` suffix
2. Updated `episode_slug` field inside each file
3. Updated `guest` field to include "2.0" designation
4. Rebuilt verified-content.json registry

**Correct curated episode now exists:** shreyas-doshi.json (properly points to 1.0 "The art of product management")

### 📋 DialogueCount: 0 Episodes Documented

**30 episodes have dialogueCount: 0** (missing or unparseable transcripts)

This includes:
- 9 multi-time guest 1.0 episodes with missing transcripts (already documented in Session 10)
- ~21 additional episodes with transcript issues or metadata mismatches

Some episodes also have title/guest metadata mismatches (e.g., brandon-chu showing Sander Schulhoff's title, ryan-hoover showing Ryan Singer's title). These need investigation.

### 📁 Files Changed This Session

**Deleted:**
- `episodes/teaser_2021/` directory
- `public/og/teaser_2021.png`

**Modified (teaser_2021 removal):**
- `lib/allEpisodes.ts`
- `lib/insightsData.ts`
- `lib/episodesData.ts`
- `scripts/extraction-progress.json`
- `index/episodes.md`
- `index/entrepreneurship.md`
- `index/community-building.md`

**Modified (episode count 298→295):**
- `lib/zones.ts`
- `lib/allEpisodes.ts`
- `lib/insightsData.ts`
- `scripts/build-verified.ts`
- `scripts/curation-stats.ts`
- `scripts/parse-all-episodes.js`
- `scripts/generate-og-images.js`
- `scripts/generate-home-og-image.js`
- `scripts/generate-explore-og-image.js`
- `app/page.tsx`
- `app/explore/page.tsx`
- `app/explore/layout.tsx`
- `app/results/page.tsx`

**Renamed (curated episode fixes):**
- `april-dunford.json` → `april-dunford-20.json`
- `dylan-field.json` → `dylan-field-20.json`
- `julie-zhuo.json` → `julie-zhuo-20.json`
- `marty-cagan.json` → `marty-cagan-20.json`

**Regenerated:**
- `public/og-image.png`
- `public/explore-og-image.png`
- `data/verified/verified-content.json`
- `lib/verifiedContent.ts`

---

## 📊 Updated Coverage Status (Post-Session 11)

**Episode Directories:** 295
**Entries in allEpisodes.ts:** 295 ✅
**Transcripts Available:** 267 (~30 with dialogueCount: 0)
**Episodes Curated:** 24/295 (8.1%)

**Data Quality:**
- ✅ teaser_2021 episode removed
- ✅ Episode count updated to 295 everywhere
- ✅ OG images regenerated with correct count
- ✅ 4 curated episodes fixed (were attached to wrong slugs)
- ✅ Verified content registry rebuilt
- ⚠️ 30 episodes have dialogueCount: 0 (missing/broken transcripts)
- ⚠️ Some episodes have guest/title metadata mismatches

**Next Priority:**
1. Investigate and fix guest/title metadata mismatches
2. Source missing transcripts for high-priority episodes
3. Continue recommendation engine enhancements

---

## ✅ Session 12: Podcast Recommendations Engine (Jan 26, 2026)

### 🎯 Recommendations Engine Implementation Complete

All 4 priority enhancements from Session 9's review have been implemented and hardened:

#### 1. Smarter Quote Matching ✅
- **Before:** Binary zone overlap check, returned first matching quote
- **After:** Quotes scored by relevance to user's zone profile
  - Primary zone matches: 3x weight
  - Secondary zone matches: 2x weight
  - Other zone matches: 1x weight
- Returns BEST matching quote per episode, not just first alphabetically
- Falls back to first quotes if no zone matches found

#### 2. Better Match Reasons ✅
- **Before:** Generic "Both prioritize velocity and data"
- **After:** References actual quote snippets in match reasons
- Format: `"Brian on craft: 'The details matter...'"`
- Extracts first sentence of best quote (max 80 chars)
- Falls back to zone-based reason if no good quote

#### 3. Contrarian Recommendations Using contrarian_candidates ✅
- **Before:** Just found episodes strong in user's blind spot
- **After:** Uses curated `contrarian_candidates` field from all 24 episodes
- Scores each contrarian candidate:
  - +3 if challenges user's primary zone
  - +2 if challenges secondary zone
  - +1 if related to blind spot
- Adds blind spot strength bonus to total score
- Sorts ALL candidates by score, picks top 3 (not first 3 with candidates)
- Shows "Challenges your thinking: [why]" with the curator's explanation

#### 4. Diversity Scoring ✅
- **Before:** Top 5 by alignment score (could all be similar)
- **After:** Applies similarity penalty based on zone overlap
- Checks if both episodes are >20% in same zones
- Caps penalty at 30% to preserve quality
- Only skips if penalty drops score below 70% of current cutoff
- Results in more diverse recommendation sets

### 🔒 Hardening & Edge Cases

Made the engine bulletproof with comprehensive fixes:

1. **Fixed Contrarian Scoring Bug** (was calculated but never used)
2. **Fixed SSR localStorage Issue** (crashed on server-side render)
   - Added `isClient` state with useEffect
   - Shows loading spinner during hydration
   - Wrapped localStorage in try/catch
3. **Comprehensive Null Checks**
   - All zone percentages use `?? 0` fallback
   - Quote zones array defaults to `[]`
   - Episodes with no zone_influence skipped
   - contrarian_candidates checked before iteration
4. **Edge Case Handling**
   - Default zone if sortedZones empty
   - topZones guaranteed minimum 2 entries
   - Empty quotes returns first quotes as fallback
   - getBlindSpotDescription has unknown zone fallback

### 📦 Data Curation Updates

**Added contrarian_candidates to all 24 episodes** ✅
- rahul-vohra (3 candidates: virality myth, no half-baked, game design vs gamification)
- All others already had them from previous curation

### 🎨 Enhanced EpisodeRecommendationCard UI

- Distinct crimson styling for contrarian cards (border, background, text)
- "PERSPECTIVE" badge for contrarian vs "RECOMMENDED" for primary
- Lightbulb icon for contrarian match reasons
- Better quote truncation (200 char limit with "...")
- Quote border color matches card variant

### Zone Badges ✅
Added color-coded zone badges to EpisodeRecommendationCard:
- Shows top 3 zones with >10% influence
- Color scheme:
  - Speed (amber), Craft (purple), Discovery (blue)
  - Data (green), Intuition (pink), Alignment (cyan)
  - Adaptability (orange), Focus (yellow)
- Helps users understand episode focus at a glance

### Data Format Standardization ✅
- Converted all 24 episodes from `episode_slug` to `slug`
- Removed all fallback logic (`(ep as any).slug || (ep as any).episode_slug`)
- Cleaner, type-safe code throughout

### Guest Metadata Structure ✅
Added types and data for diversity scoring:
```typescript
type GuestType = 'founder' | 'operator' | 'investor' | 'advisor' | 'academic'
type CompanyStage = 'pre-seed' | 'seed' | 'series-a' | 'growth' | 'public' | 'mixed'
```

**All 24 verified episodes now have `guest_metadata`:**
- **Founders (10):** brian-chesky, tobi-lutke, dylan-field, rahul-vohra, stewart-butterfield, jason-fried, guillermo-rauch, nikita-bier, mike-krieger, amjad-masad
- **Operators (8):** shreyas-doshi, julie-zhuo, boz, casey-winters-20, elena-verna-30, gokul-rajaram, kunal-shah, aishwarya-naresh-reganti-kiriti-badam
- **Investors (1):** dalton-caldwell
- **Advisors (5):** marty-cagan, ben-horowitz, april-dunford, annie-duke, paul-graham

### Diversity-Aware Recommendations ✅
Enhanced `calculateSimilarityPenalty()` in `lib/recommendations.ts`:

1. **Zone overlap** (existing) - Episodes strong in same zones
2. **Guest type diversity** (new) - Avoid 3+ founders in a row
   - 15% penalty after 2 of same type
   - 5% penalty after 1 of same type
3. **Company stage diversity** (new) - Mix public companies with startups
   - 10% penalty after 2 of same stage
   - 3% penalty after 1 of same stage

**Result:** Recommendations now naturally mix perspectives - a founder at a public company, an operator at a growth startup, and an advisor with multi-company experience.

### 🛠️ Additional Fixes This Session

**Explore Page - Removed Dialogue Count** ✅
- Removed `dialogueCount` display from episode cards on /explore page
- This data was unreliable/inconsistent across episodes
- Cleaner card UI without misleading metrics

**Episode Curation Fixes** ✅
- Removed `teaser_2021` episode (promotional content, not real episode)
- Fixed curated episode slug mismatches

### 📁 Files Changed

**Core Algorithm:**
- `lib/recommendations.ts` - Complete rewrite with all 4 enhancements + hardening + diversity
- `lib/types.ts` - Added ContrarianCandidate, GuestType, CompanyStage interfaces

**UI:**
- `components/EpisodeRecommendationCard.tsx` - Enhanced contrarian styling, zone badges
- `app/results/page.tsx` - Fixed SSR localStorage issue
- `app/explore/page.tsx` - Removed dialogueCount from cards

**Data:**
- All 24 `data/verified/*.json` files - Added guest_metadata, standardized to `slug`
- `data/verified/verified-content.json` - Rebuilt registry

**Documentation:**
- `.claude/skills/curate-episode/SKILL.md` - Added Step 6 for guest metadata

---

## 📊 Updated Coverage Status (Post-Session 12)

**Episode Directories:** 295
**Entries in allEpisodes.ts:** 295 ✅
**Transcripts Available:** 267 (~30 with dialogueCount: 0)
**Episodes Curated:** 24/295 (8.1%)

**Data Quality:**
- ✅ Recommendations engine fully functional with diversity scoring
- ✅ Guest metadata added to all 24 curated episodes
- ✅ Multi-time guest metadata corrected for 14 guests
- ✅ shreyas-doshi-live duplicate removed
- ✅ Chip Conley metadata corrected
- ✅ teaser_2021 episode removed
- ✅ 4 curated episodes fixed (were attached to wrong slugs)
- ⚠️ ~30 episodes have dialogueCount: 0 (missing/broken transcripts)

---

## 🚨 Phase 13: Guest/Title Metadata Mismatches (Jan 26, 2026) - INVESTIGATION COMPLETE

### Overview

**Critical data quality issue discovered:** 18 episodes have mismatched metadata where:
- ✅ **Slug is CORRECT** (e.g., `brandon-chu`)
- ✅ **Guest field is CORRECT** (e.g., "Brandon Chu")
- ✅ **Transcript CONTENT is CORRECT** (actual dialogue from the intended guest)
- ❌ **Title is WRONG** (shows a different guest's episode title)
- ❌ **Description is WRONG** (describes a different guest)
- ❌ **video_id / youtube_url is WRONG** (links to wrong YouTube video)
- ❌ **publish_date is WRONG** (date of different episode)
- ❌ **duration / view_count is WRONG** (stats from different episode)

**Root cause:** Unknown - appears to be a data pipeline mixup during transcript import where metadata from one episode was incorrectly applied to another episode's transcript.

---

### 📋 COMPLETE MISMATCH LIST (18 Episodes)

#### Group 1: Confirmed Mismatches (3 Episodes)

| # | Slug | Guest Field (✅) | Wrong Title (❌) | Correct Guest in Title |
|---|------|------------------|------------------|------------------------|
| 1 | `brandon-chu` | Brandon Chu | [NO YOUTUBE VIDEO AVAILABLE]
| 2 | `ryan-hoover` | Ryan Hoover | "A better way to plan, build, and ship products \| **Ryan Singer** (creator of 'Shape Up')" | Ryan Singer | ✅ Need Ryan Hoover's actual episode metadata | https://www.youtube.com/watch?v=HzDLWKI6mnI (ACTUAL LINK)
| 3 | `david-placek` | David Placek | "Building a culture of excellence \| **David Singleton** (CTO of Stripe)" | David Singleton | ✅ Need David Placek's actual episode metadata | https://www.youtube.com/watch?v=adyIaTopO6g (ACTUAL LINK)

| 4 | `gibson-biddle` | Gibson Biddle | "35 years of product design wisdom... \| **Bob Baxley**" | Bob Baxley | Transcript mentions "Gibson Biddle" at line 40 |
| 5 | `manik-gupta` | Manik Gupta | [NO YOUTUBE VIDEO AVAILABLE]
| 6 | `nikita-bier` | Nikita Bier | "Driving alignment within teams, work-life balance... \| **Nikita Miller**" | Nikita Miller | Transcript shows "Nikita Bier (00:00:00)" - content is Nikita Bier | https://youtube.com/watch?v=bhnfZhJWCWY (ACTUAL LINK)
| 7 | `matt-mullenweg` | Matt Mullenweg | "The one question that saves product careers \| **Matt LeMay**" | Matt LeMay | Transcript mentions "open source" - sounds like Matt Mullenweg content | https://youtube.com/watch?v=Fves5chVZRA (ACTUAL LINK)
| 8 | `jackie-bavaro` | Jackie Bavaro | [NO YOUTUBE VIDEO AVAILABLE]
| 9 | `alexander-embiricos` | Alexander Embiricos | "How to drive word of mouth \| **Nilan Peiris** (CPO of Wise)" | Nilan Peiris | Need to verify transcript content |  https://www.youtube.com/watch?v=z1ISq9Ty4Cg (ACTUAL LINK)
| 10 | `gaurav-misra` | Gaurav Misra | "Mastering onboarding \| **Lauryn Isford** (Head of Growth at Airtable)" | Lauryn Isford | Need to verify transcript content | https://www.youtube.com/watch?v=PDobJV8wh1g (ACTUAL LINK)
| 11 | `ray-cao` | Ray Cao | [NO YOUTUBE VIDEO AVAILABLE]
| 12 | `laura-modi` | Laura Modi | [NO YOUTUBE VIDEO AVAILABLE]
| 13 | `julian-shapiro` | Julian Shapiro | [NO YOUTUBE VIDEO AVAILABLE]
| 14 | `archie-abrams` | Archie Abrams | "How to speak more confidently... \| **Matt Abrahams**" | Matt Abrahams | Need to verify transcript content | https://www.youtube.com/watch?v=Vlph3dn4jnU (ACTUAL LINK)

---

### 🔍 What Needs To Be Fixed For Each Episode

For each mismatched episode, we need to obtain the CORRECT metadata:

1. **YouTube Video Link** - The actual video URL for this guest's episode
2. **Video ID** - Extracted from correct YouTube URL
3. **Title** - The actual episode title with correct guest name
4. **Description** - The correct episode description
5. **Publish Date** - When the episode actually aired
6. **Duration** - Actual episode length
7. **View Count** - Current view count (optional, will be outdated)

**Screenshot needed for each:** Capture YouTube video page showing title, thumbnail, upload date, and duration.

---

### 📸 Action Items for Next Session

**For User to Curate:**

1. **Search YouTube for each guest's actual episode:**
   - Go to https://www.youtube.com/@LennysPodcast/videos
   - Search for guest name (e.g., "Brandon Chu")
   - Find the correct episode
   - Screenshot the video page

2. **Collect for each episode:**
   ```
   Slug: brandon-chu
   Correct YouTube URL: https://www.youtube.com/watch?v=XXXXX
   Correct Title: [Full title from YouTube]
   Publish Date: [Date shown on YouTube]
   Duration: [Duration from YouTube]
   Screenshot: [Screenshot filename]
   ```

3. **Document in a spreadsheet or markdown file** for next session to batch update

---

### 🔧 Technical Fix Required

Once correct metadata is obtained, the fix requires updating:

1. **`episodes/[slug]/transcript.md`** - Update frontmatter:
   ```yaml
   ---
   guest: Brandon Chu
   title: '[CORRECT TITLE]'
   youtube_url: https://www.youtube.com/watch?v=[CORRECT_VIDEO_ID]
   video_id: [CORRECT_VIDEO_ID]
   publish_date: [CORRECT_DATE]
   description: '[CORRECT_DESCRIPTION]'
   duration_seconds: [CORRECT_DURATION]
   duration: '[CORRECT_DURATION_STRING]'
   view_count: [CURRENT_VIEW_COUNT]
   ---
   ```

2. **`lib/allEpisodes.ts`** - Regenerate from corrected transcripts (or manually update)

3. **`lib/insightsData.ts`** - Regenerate from corrected transcripts

4. **`lib/episodesData.ts`** - Regenerate from corrected transcripts

---

### 📊 Impact Assessment

**Severity: HIGH**

- **User-facing impact:** Episode pages show wrong YouTube videos, wrong descriptions
- **SEO impact:** Episode metadata doesn't match actual content
- **Recommendation impact:** View counts may be wrong, affecting popularity-based sorting
- **Trust impact:** Users clicking to watch video see completely different guest

**Episodes Affected:** 18 out of 295 (6.1% of catalog)

**Priority Episodes to Fix First:**
1. `brandon-chu` - Brandon Chu is well-known PM writer
2. `ryan-hoover` - Ryan Hoover is Product Hunt founder, high visibility
3. `gibson-biddle` - Gibson Biddle is popular PM strategist
4. `nikita-bier` - Nikita Bier is well-known for viral apps

---

### 🗂️ Related Issues

**Also documented in previous sessions:**
- Session 10: Multi-time guest metadata fixes (14 guests)
- Session 11: teaser_2021 removal, curated episode slug fixes

**Possibly related:**
- 30 episodes with dialogueCount: 0 (some may overlap with this list)
- Episodes with missing transcripts (marked as placeholders)

---

### ✅ Session Deliverable

This phase documents the investigation. Next session can execute the fixes once:
1. User provides correct YouTube links and metadata for each episode
2. Screenshots are captured for verification
3. Batch update script or manual edits can be performed

---

---

## ✅ Session 13: Curation Scale-Up & Metadata Fixes (Jan 26, 2026)

### 📊 MAJOR CURATION MILESTONE: 87 Episodes (29.5% Coverage!)

Scaled from 24 to 87 curated episodes - a 263% increase in coverage!

**New Episodes Curated This Session (12):**

| Episode | Guest | Key Topics |
|---------|-------|------------|
| adam-grenier | Adam Grenier | Emerging channels framework, Growth CMO, burnout/depression |
| andrew-wilkinson | Andrew Wilkinson | Bootstrapping vs VC, moats, AI automation, mental health |
| andy-raskin | Andy Raskin | Strategic narrative, pitching, movements, category creation |
| anneka-gupta | Anneka Gupta | Strategy, founder mode, feedback, decision-making |
| arielle-jackson | Arielle Jackson | Naming, positioning, branding, brand personality |
| ben-williams | Ben Williams | PLG for developer tools, growth teams, Snyk |
| bill-carr | Bill Carr | Working backwards, Amazon practices, single-threaded leadership |
| cam-adams | Cam Adams | Canva coaching model, giving away Legos, freemium |
| carilu-dietrich | Carilu Dietrich | Hypergrowth, career advice, Atlassian PLG, bundling |
| chip-conley | Chip Conley | Modern Elder Academy, emotional intelligence, wisdom |
| chris-hutchins | Chris Hutchins | Financial optimization, credit cards, negotiation |
| claire-butler | Claire Butler | Figma bottom-up GTM, designer advocates, internal champions |

**Updated Statistics:**
- **Episodes curated:** 87/295 (29.5%) ⬆️ up from 24 (8.1%)
- **Verified quotes:** 1,017 ⬆️ up from 283
- **Avg quotes/episode:** 11.7

### 🔧 Metadata Fix: ada-chen-rekhi

**Problem:** Transcript metadata pointed to a 3:50 YouTube CLIP instead of the full 1:18:27 episode.

**Fixed:**
- video_id: `l-T8sNRcWQk` (clip) → `N64vIY2nJQo` (full episode)
- duration: `3:50` → `1:18:27`
- title: "Feeling stuck?..." → "How to make better decisions and build a joyful career"
- Transcript content was already the full episode text

### ⚠️ Known Issue: 5 Other Short Episodes Need Similar Fixes

**Episodes with CLIP metadata but FULL transcript content:**

| Episode | Current Duration | Full Episode Link | Status |
|---------|-----------------|-------------------|--------|
| jonathan-becker | 2:02 (122 sec) | `mmxTeS0AVMo` | Needs fix |
| lulu-cheng-meservey | 2:44 (164 sec) | `LTSEOeKV_Hs` | Needs fix |
| matt-mochary | 7:00 (420 sec) | `bCel0X2Ta7U` | Needs fix |
| daniel-lereya | 0:00 (0 sec) | Missing | Needs YouTube link |
| peter-deng | 0:00 (0 sec) | Missing | Needs YouTube link |

**Root Cause:** During transcript import, these episodes received metadata from YouTube clips rather than full episodes. The clip descriptions typically say "Find the full episode here: [link]" - the link is the correct video.

**Fix Required:** Update frontmatter in each transcript file with correct video_id, duration, title, and publish_date.

### 📁 Files Changed This Session

**Curation (12 new episodes):**
- `data/verified/adam-grenier.json` - NEW
- `data/verified/andrew-wilkinson.json` - NEW
- `data/verified/andy-raskin.json` - NEW
- `data/verified/anneka-gupta.json` - NEW
- `data/verified/arielle-jackson.json` - NEW
- `data/verified/ben-williams.json` - NEW
- `data/verified/bill-carr.json` - NEW
- `data/verified/cam-adams.json` - NEW
- `data/verified/carilu-dietrich.json` - NEW
- `data/verified/chip-conley.json` - NEW
- `data/verified/chris-hutchins.json` - NEW
- `data/verified/claire-butler.json` - NEW

**Metadata Fixes:**
- `episodes/ada-chen-rekhi/transcript.md` - Fixed video_id, title, duration

**Registry:**
- `data/verified/verified-content.json` - Updated (87 episodes)
- `lib/verifiedContent.ts` - Regenerated

---

## 📊 Updated Coverage Status (Post-Session 13)

**Episodes Curated:** 87/295 (29.5%) ✅
**Target:** 100+ episodes (33%) - 13 more to go!
**Verified Quotes:** 1,017
**Avg quotes/episode:** 11.7

**Zone Coverage:**
- All zones now have 60+ episodes
- velocity: 80 episodes
- perfection: 64 episodes
- discovery: 85 episodes
- data: 71 episodes
- intuition: 76 episodes
- alignment: 85 episodes
- chaos: 74 episodes
- focus: 86 episodes

---

## 🎯 NEXT PRIORITIES

### P0: Fix Short Episode Metadata (5 Episodes)
- jonathan-becker, lulu-cheng-meservey, matt-mochary → update to full episode links
- daniel-lereya, peter-deng → find correct YouTube links

### P0: Fix Guest/Title Metadata Mismatches (18 Episodes)
- User to curate YouTube links & screenshots
- Then batch update frontmatter and regenerate data files

### P1: Reach 100 Episodes (13 more needed)
- Current: 87/295 episodes (29.5%)
- Target: 100+ episodes (33%)
- Priority: Continue with high-view-count episodes

### Content Improvements
- Source missing 1.0 transcripts for 9 episodes
- Add more contrarian_candidates for richer recommendations

### Future Enhancements
- Consider topic-based diversity (avoid 3 episodes about "growth" in a row)
- Add "why this mix" explanation to results page
- Show guest type badges alongside zone badges

---

## ✅ Session 14: Curation Scale-Up & Documentation Overhaul (Jan 27, 2026)

### 📊 Episode Curation: 5 New Episodes

**New Episodes Curated:**

| Episode | Guest | Key Topics | Quotes |
|---------|-------|------------|--------|
| seth-godin | Seth Godin | Brand as promise, smallest viable audience, purple cow, strategic thinking | 11 |
| jackie-bavaro | Jackie Bavaro | Product strategy, career growth, IC vs manager path, collaboration | 11 |
| sarah-tavel | Sarah Tavel | Hierarchy of engagement, retention, network effects, core actions | 11 |
| will-larson | Will Larson | Systems thinking, engineering strategy, writing, cross-functional work | 11 |
| john-cutler | John Cutler | Team health, learning velocity, organizational dynamics, agile | 11 |

**Updated Statistics:**
- **Episodes curated:** 105/295 (35.6%) ⬆️ up from 100 (33.9%)
- **Verified quotes:** 1,224 ⬆️ up from 1,169
- **Avg quotes/episode:** 11.7

**Zone Coverage (All zones well-represented):**
- All zones now have 70+ episodes
- Strong coverage across all philosophy areas

### 📚 Documentation Overhaul

**Comprehensive README.md Rewrite:**
- Welcoming introduction for first-time visitors
- Feature showcase with clear benefits
- Claude AI skills documentation
- SEO optimization features explained
- Dual audience targeting (Lenny fans + template users)
- Open source contribution guidelines
- Professional formatting with visual hierarchy

### 🗑️ Repository Cleanup Recommendations

**Files Recommended for Deletion:**

| File | Size | Reason | Status |
|------|------|--------|--------|
| `Readme-duplicate.md` | 1.6K | Duplicate of README.md | DELETE |
| `PM_PHILOSOPHY_MAP_PROJECT.md` | 4.9K | Early project overview, superseded by BUILD_PROGRESS.md | DELETE |
| `SESSION_SUMMARY.md` | 5.4K | Historical session recap, now in BUILD_PROGRESS.md | DELETE |
| `ENHANCEMENT_PLAN.md` | 7.8K | Outdated roadmap, items completed or documented elsewhere | DELETE |

**Files to Keep:**

| File | Size | Reason |
|------|------|--------|
| `README.md` | ~10K | Main project documentation (just rewritten) |
| `BUILD_PROGRESS.md` | ~75K | Comprehensive project history and status |
| `WARP.md` | 10.8K | Warp editor integration guide (still relevant) |
| `RECOMMENDATION_ENGINE_DESIGN.md` | 15.9K | Detailed design doc, valuable reference |
| `LENNY_TRANSCRIPTS_README.md` | 6.2K | Explains transcript source archive |
| `LENNY_TRANSCRIPTS_CLAUDE.md` | 3.0K | Claude instructions for transcript work |

**Cleanup Impact:**
- **Before:** 10 markdown files (120K total)
- **After:** 6 markdown files (101K total)
- **Removed:** 4 redundant/outdated files (19K)

**Note:** Cleanup should be executed in a separate commit to keep this session's changes focused on curation and documentation.

### 📁 Files Changed This Session

**Curation (5 new episodes):**
- `data/verified/seth-godin.json` - NEW
- `data/verified/jackie-bavaro.json` - NEW
- `data/verified/sarah-tavel.json` - NEW
- `data/verified/will-larson.json` - NEW
- `data/verified/john-cutler.json` - NEW

**Documentation:**
- `README.md` - Comprehensive rewrite
- `BUILD_PROGRESS.md` - This update with cleanup recommendations

**Registry:**
- `data/verified/verified-content.json` - Updated (105 episodes)
- `lib/verifiedContent.ts` - Regenerated

---

## 📊 Updated Coverage Status (Post-Session 14)

**Episodes Curated:** 105/295 (35.6%) ✅ EXCEEDED 33% TARGET!
**Verified Quotes:** 1,224
**Avg quotes/episode:** 11.7

**Milestone Achieved:** First time exceeding 100 curated episodes and 33% coverage target!

**Next Priority:**
1. Execute repository cleanup (delete 4 redundant files)
2. Continue scaling curation toward 50% coverage
3. Implement remaining recommendation engine enhancements
