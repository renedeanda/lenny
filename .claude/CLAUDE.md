# Working with Claude on PM Philosophy Map

This document explains how to effectively collaborate with Claude on the PM Philosophy Map project.

---

## 🎯 Project Overview

**PM Philosophy Map** is an interactive experience where product managers discover their philosophy through a dark sci-fi quiz built from 299 episodes of Lenny's Podcast. Every insight, quote, and recommendation is grounded in actual transcript data.

**Live Site:** https://lenny.productbuilder.net
**Repository:** https://github.com/renedeanda/lenny
**Tech Stack:** Next.js 15, TypeScript, Tailwind, Framer Motion, Three.js

---

## 📋 Project Structure

```
/lenny
├── .claude/                      # Claude configuration
│   ├── CLAUDE.md                 # This file
│   └── skills/                   # Reusable Claude skills
│       ├── curate-episode/       # Extract quotes from transcripts
│       ├── verify-seo/           # SEO metadata validation
│       ├── verify-sitemap/       # Sitemap auditing
│       └── update-og-images/     # OG image management
├── app/                          # Next.js App Router pages
│   ├── episodes/[slug]/          # Individual episode pages
│   ├── quiz/                     # 10-question philosophy quiz
│   ├── results/                  # Philosophy profile results
│   ├── explore/                  # Browse all episodes
│   └── layout.tsx                # Root layout + metadata
├── components/                   # React components
│   ├── VerifiedQuotes.tsx        # Quote display with filtering
│   ├── GoogleAnalytics.tsx       # GA4 integration
│   └── CustomCursor.tsx          # Sci-fi cursor effect
├── data/                         # Verified episode data
│   └── verified/                 # Curated episode JSON files
│       ├── brian-chesky.json     # Example curated episode
│       └── verified-content.json # Master registry
├── episodes/                     # Raw transcript markdown files
│   └── [slug]/transcript.md      # Episode transcripts (302 total)
├── lib/                          # Core business logic
│   ├── allEpisodes.ts            # Episode metadata (299 episodes)
│   ├── zones.ts                  # 8 philosophy zones
│   ├── questions.ts              # Quiz questions
│   ├── scoring.ts                # Quiz → philosophy calculation
│   ├── verifiedQuotes.ts         # Quote loading system
│   └── types.ts                  # TypeScript definitions
├── scripts/                      # Build and curation tools
│   ├── build-verified.ts         # Validation + content generation
│   ├── curate-batch.ts           # Batch quote extraction
│   └── propose-quotes.ts         # AI-powered quote suggestions
└── BUILD_PROGRESS.md             # Comprehensive project status
```

---

## 🔧 Claude Skills (Reusable Commands)

Skills are specialized prompts that handle recurring tasks. Invoke them like:

```
/curate-episode
/verify-seo
/verify-sitemap
/update-og-images
```

### Available Skills

#### `/curate-episode`
Extract verified quotes from Lenny's Podcast transcripts.

**When to use:**
- User asks to "curate an episode"
- Scaling episode coverage (currently 8/302)
- Building quote database

**What it does:**
1. Reads episode transcript from `episodes/[slug]/transcript.md`
2. Extracts 10-12 best quotes (avoiding first 5 min highlights)
3. Tags quotes with themes and philosophy zones
4. Generates 5 key takeaways
5. Calculates zone_influence scores
6. Outputs to `data/verified/[slug].json`

**Quality Standards:**
- No quotes from first 5 minutes (duplicates)
- 120-500 characters per quote
- Substantive insights, not platitudes
- Verifiable timestamps and line numbers

**Validation:**
- Run `npm run build:verified` after curation
- Build will FAIL if quotes reference non-existent lines
- Build will WARN for duplicates or quality issues

#### `/verify-seo`
Audit SEO metadata across all pages.

**When to use:**
- Before production deployments
- After domain changes
- When adding new pages

**What it checks:**
- Meta tags (title, description, keywords)
- OpenGraph metadata (og:title, og:image, og:url)
- Twitter cards
- Canonical URLs
- Domain references (no localhost)
- OG image existence

**Output:** Comprehensive SEO audit report

#### `/verify-sitemap`
Validate dynamic sitemap generation.

**When to use:**
- After adding new episodes
- Before SEO submissions
- When changing domain

**What it checks:**
- 306 total URLs (3 static + 299 episodes)
- Correct domain (lenny.productbuilder.net)
- No localhost references
- Valid XML structure
- Proper lastModified dates
- Priority and changeFrequency values

**Output:** Sitemap validation report

#### `/update-og-images`
Manage OpenGraph social preview images.

**When to use:**
- After curating new episodes
- Updating branding
- Batch image generation

**What it does:**
- Checks for missing OG images
- Validates dimensions (1200x630px)
- Compresses oversized images
- Generates missing images

**Location:** `/public/og/[slug].png`

---

## 📝 Common Workflows

### 1. Curating a New Episode

```bash
# Step 1: Invoke skill
/curate-episode

# Claude will ask for episode slug
# Example: "brian-chesky"

# Step 2: Claude reads transcript and extracts quotes
# Outputs to: data/verified/brian-chesky.json

# Step 3: Validate
npm run build:verified

# Step 4: Commit
git add data/verified/brian-chesky.json
git commit -m "feat: Curate Brian Chesky episode with 11 verified quotes"
```

### 2. Adding New Features

```bash
# Step 1: Explain the feature
"Add a filter to the explore page to show only episodes from 2024"

# Step 2: Claude implements
# - Updates explore page component
# - Adds filter UI
# - Tests functionality

# Step 3: Review changes
git diff

# Step 4: Commit if good
git add .
git commit -m "feat: Add year filter to explore page"
git push
```

### 3. Fixing Bugs

```bash
# Step 1: Describe the issue
"The transcript search is highlighting the wrong segments"

# Step 2: Claude investigates
# - Reads relevant files
# - Identifies root cause
# - Proposes fix

# Step 3: Implement fix
# Claude makes changes

# Step 4: Test and commit
```

### 4. Quality Audits

```bash
# SEO audit
/verify-seo

# Sitemap check
/verify-sitemap

# OG images
/update-og-images
```

---

## 🎨 Design Principles

### Dark Sci-Fi Aesthetic
- **Background:** Pure black (`#000000`)
- **Primary:** Amber/gold (`#ffb347`)
- **Secondary:** Crimson (`#dc143c`)
- **Typography:** Monospace (terminal vibes)
- **Effects:** Scanlines, glitch, glow

### Data Philosophy
- **Real over fake:** Every quote is verifiable
- **Grounded in transcripts:** No made-up insights
- **Timestamp accuracy:** Link to exact moments
- **Quality over quantity:** Better to have 8 great episodes than 100 mediocre ones

### UX Philosophy
- **Smooth and delightful:** Animations everywhere
- **Outside the box:** Not typical SV aesthetic
- **Mystery:** Dark, exploratory, space-themed
- **No fluff:** Direct, honest, terminal-style

---

## 🔍 Key Files to Know

### Core Data Files

**`lib/allEpisodes.ts`**
- 302 episode metadata
- Generated from transcript frontmatter
- Used across entire app

**`data/verified/`**
- Curated episode JSON files
- Each has: quotes, takeaways, zone_influence
- Validated by build system

**`lib/zones.ts`**
- 8 philosophy zones
- Each references a verified quoteId
- Used in quiz results

**`lib/questions.ts`**
- 7 quiz questions
- Each question maps to zones
- Used in quiz flow

**`lib/scoring.ts`**
- Quiz answer → zone scores
- Zone percentages calculation
- Primary/secondary philosophy logic

### Important Components

**`components/VerifiedQuotes.tsx`**
- Displays curated quotes on episode pages
- Theme filtering
- Jump-to-transcript functionality

**`app/episodes/[slug]/page.tsx`**
- Individual episode pages
- Transcript display with search
- YouTube embed
- Verified quotes sidebar

**`app/results/page.tsx`**
- Philosophy profile results
- Zone breakdowns
- Guest alignment
- **TO BE REDESIGNED:** Podcast recommendation engine

---

## 🚧 Current Priorities

### 1. Scale Episode Curation (HIGH)
- **Current:** 8/299 episodes (2.6%)
- **Target:** 100+ episodes (33%)
- **Focus:** Curate 10-15 episodes per session

### 2. Podcast Recommendation Engine (HIGH)
- **Goal:** Transform quiz results into episode recommendations
- **Components:**
  - Matching algorithm (quiz answers → quotes)
  - Episode alignment scoring
  - Contrarian recommendations
  - Results page redesign
- **Why:** Drive podcast listening and engagement

### 3. Quality Maintenance (ONGOING)
- Run `/verify-seo` before deployments
- Keep OG images up to date
- Maintain transcript accuracy
- Test mobile experience

---

## 🎯 Quality Standards

### Commits
- **Format:** `type: description`
- **Types:** feat, fix, docs, refactor, test
- **Examples:**
  - `feat: Add episode recommendation algorithm`
  - `fix: Correct transcript timestamp parsing`
  - `docs: Update CLAUDE.md with new workflow`

### Code
- TypeScript everywhere (strict mode)
- Tailwind for styling (no CSS files)
- Components in `/components`
- Lib code in `/lib`
- Server actions in `/app` folders

### Data Quality
- No quotes from first 5 minutes
- All timestamps verified
- Line numbers match transcript
- Themes are consistent
- Zone influence sums to 1.0

---

## 💡 Working with Claude Tips

### Be Specific
❌ "Fix the search"
✅ "The transcript search highlights wrong segments when clicking results"

### Provide Context
❌ "Add filtering"
✅ "Add a theme filter to the explore page similar to VerifiedQuotes component"

### Use Skills
❌ "Check if all the SEO is correct"
✅ `/verify-seo`

### Review Changes
Always check `git diff` before committing.

### Test Locally
```bash
npm run dev  # Start dev server
npm run build  # Test production build
npm run build:verified  # Validate curated data
```

---

## 🛠️ Development Commands

```bash
# Development
npm run dev                 # Start dev server (localhost:3000)
npm run build              # Production build
npm run start              # Start production server

# Data Validation
npm run build:verified      # Validate curated episodes
npm run stats              # Show coverage statistics

# Git
git status                 # Check changes
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to remote
```

---

## 📚 Documentation

- **BUILD_PROGRESS.md** - Comprehensive project status and history
- **README.md** - Project overview (needs update)
- **CLAUDE.md** - This file (how to work with Claude)
- **Skills/** - Individual skill documentation

---

## 🔗 Quick Links

- **Live Site:** https://lenny.productbuilder.net
- **Repository:** https://github.com/renedeanda/lenny
- **Lenny's Podcast:** https://www.lennyspodcast.com
- **Twitter:** @lennysan

---

## 🎉 Success Metrics

**Episode Coverage:**
- Current: 8/302 (2.6%)
- Target: 100+ (33%)

**Verified Quotes:**
- Current: 91 quotes
- Target: 800+ quotes

**Zone Coverage:**
- All zones need 10+ episodes
- Currently: 2-8 episodes per zone

**User Engagement:**
- Quiz completion rate
- Episode click-through from results
- Social shares
- Return visits to /explore

---

**Last Updated:** January 22, 2026
**Current Focus:** Quality improvements complete, ready for curation scale-up and recommendation engine development
