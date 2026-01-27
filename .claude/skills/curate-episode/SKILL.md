---
name: curate-episode
description: Extract verified quotes from Lenny's Podcast episode transcripts to populate the PM Philosophy Map with real, grounded content. Triggered when asked to curate episodes, extract quotes, or enrich the PM Philosophy Map with transcript data.
---

# Episode Curation Skill

## Purpose
Extract verified quotes from Lenny's Podcast episode transcripts to power the PM Philosophy Map with real, grounded content.

## When to Use This Skill
- User asks to "curate an episode"
- User wants to "extract quotes from transcript"
- User requests to "enrich the PM Philosophy Map"
- User asks to "continue curating" or "scale episode coverage"

## Context
- **Project**: PM Philosophy Map - interactive product philosophy discovery experience
- **Data Source**: 303 episode transcripts in `episodes/{slug}/transcript.md`
- **Output**: Verified JSON files in `data/verified/{slug}.json`
- **Validation**: `scripts/build-verified.ts` ensures all content is valid

## The 8 Philosophy Zones
1. **velocity**: Ship fast, iterate constantly, speed compounds
2. **perfection**: Details matter, craft excellence, leaders in the details
3. **discovery**: User research, validation first, talk to customers
4. **data**: Metrics-driven, experiment everything, numbers reveal truth
5. **intuition**: Trust gut, vision over data, taste beats metrics
6. **alignment**: Stakeholder buy-in, consensus, bring everyone along
7. **chaos**: Embrace uncertainty, adapt constantly, plans are fiction
8. **focus**: Do one thing perfectly, ruthless prioritization, constraints breed creativity

## Quote Extraction Process

### Step 1: Read the Transcript
```typescript
// Read episodes/{slug}/transcript.md
// Parse YAML frontmatter for metadata (guest, title, etc.)
// Scan content for substantive speaker quotes
```

### Step 2: Select 10-12 Best Quotes
**Quality Criteria:**
- ✅ 120-500 characters (substantive but standalone)
- ✅ From the guest speaker (not Lenny)
- ✅ Actionable insight, strong opinion, or memorable wisdom
- ✅ **CRITICAL: NOT from first 5 minutes (00:00:00 to 00:05:00)** - These are episode highlights/duplicates that appear later in full form
- ✅ If you see a great quote in the first 5 minutes, find the FULL version later in the transcript
- ✅ NOT from sponsor segments or intro/outro
- ✅ NOT generic platitudes - must be specific and distinctive

**What Makes a Great Quote:**
- Strong opinions backed by experience
- Contrarian or counterintuitive insights
- Specific frameworks or mental models
- Memorable one-liners that crystallize ideas
- Trade-offs and tensions (not just "best practices")

**AI-Related Insights (IMPORTANT FOR 2024-2026 EPISODES):**
Many recent episodes discuss AI extensively. When extracting AI-related quotes, capture:
- **AI adoption strategy**: Fast vs cautious, leading edge vs proven, experimentation mindset
- **AI vs human judgment**: When to trust AI, when to override, role of taste/intuition
- **AI in workflows**: How teams actually use AI tools, productivity gains, integration challenges
- **AI product strategy**: Building AI products, AI-first vs AI-enhanced, competitive moats
- **AI risks/trade-offs**: What gets lost with AI, quality concerns, human skills atrophy
- **Contrarian AI takes**: Skepticism of hype, areas where AI fails, human superiority

**Zone Mapping for AI Insights:**
- **velocity**: AI enables faster shipping, rapid iteration, speed of adoption
- **perfection**: AI quality concerns, craftsmanship with AI, when to slow down
- **discovery**: AI in user research, AI-assisted validation, synthetic users
- **data**: AI-driven insights, ML experimentation, AI analytics
- **intuition**: AI vs human taste, trusting gut over AI recommendations
- **alignment**: AI governance, stakeholder AI concerns, change management
- **chaos**: AI-induced uncertainty, rapid AI landscape changes, adaptability
- **focus**: AI for one thing vs AI everywhere, constraints in AI era

### Step 3: Tag Each Quote
**For each quote, identify:**
- **Themes** (2-4 tags): Be specific and descriptive
  - **AI themes**: "ai-adoption", "ai-product-strategy", "ai-workflows", "ai-vs-human", "ai-risk", "ai-velocity", "ai-quality"
  - **Product themes**: "product-market-fit", "user-research", "roadmap", "prioritization", "launch-strategy"
  - **Execution themes**: "velocity", "quality", "team-structure", "decision-making", "metrics"
  - **Leadership themes**: "founder-mode", "delegation", "communication", "culture", "hiring"
  - **Growth themes**: "growth-loops", "retention", "acquisition", "monetization"
- **Zones** (1-3 zones): Which philosophy zones does this quote exemplify?
- **Line numbers**: Exact lineStart and lineEnd from transcript (camelCase)
- **Timestamp**: Speaker timestamp (e.g., "00:15:30")
- **Contrarian?**: Mark candidates that are spicy/opinionated or counter-narrative (for use in insightsData contrarianViews)

### Step 4: Write Takeaways (REQUIRED)
Extract 5 key takeaways that:
- Synthesize the guest's main insights
- Are actionable and specific (not vague)
- Represent different aspects of their philosophy
- Could stand alone as tweet-worthy wisdom
- Should be memorable and shareable

### Step 5: Calculate Zone Influence (REQUIRED)
Distribute 1.0 total across all 8 zones based on:
- Which zones the guest's quotes most align with
- The guest's overall product philosophy
- Balance - most guests touch 3-5 zones meaningfully
- Example: `{"discovery": 0.30, "focus": 0.20, "data": 0.15, ...}`
- **Must sum to exactly 1.0**

### Step 6: Add Guest Metadata (REQUIRED)
Capture guest metadata for diversity scoring in recommendations:

**guest_type** (required - pick one):
- `founder` - Started/co-founded a company (Brian Chesky, Dylan Field, Tobi Lutke)
- `operator` - Executive/VP at companies they didn't found (Shreyas Doshi, Julie Zhuo, Boz)
- `investor` - VC, angel, or fund partner (Ben Horowitz, Dalton Caldwell)
- `advisor` - Consultant, author, or domain expert (Marty Cagan, April Dunford, Annie Duke)
- `academic` - Professor, researcher (rare in Lenny's podcast)

**company_stage** (required - pick one):
- `pre-seed` - Very early stage, pre-product
- `seed` - Early product, finding PMF (Nikita Bier's companies)
- `series-a` - Post-PMF, early growth
- `growth` - Series B+ private company (Figma pre-acquisition, Superhuman)
- `public` - Public company (Airbnb, Shopify, Meta, Slack)
- `mixed` - Guest has experience across multiple stages (advisors, investors)

**primary_topics** (required - 3-5 tags):
- Core themes this guest is known for
- Should be specific and searchable
- Examples: "product-market-fit", "growth-loops", "founder-mode", "ai", "design"

### Step 7: Regenerate Registry (CRITICAL - DO NOT SKIP)

**After saving the JSON file, you MUST run the build script to update the registry:**

```bash
npx tsx scripts/build-verified.ts
```

This script:
- Validates all JSON files in `data/verified/`
- Regenerates `data/verified/verified-content.json` (master registry)
- Regenerates `lib/verifiedContent.ts` (TypeScript constants)
- Checks for duplicate quotes, missing zones, and invalid references

**If you skip this step:**
- The new episode will NOT appear in episode pages
- The quotes will NOT be available for recommendations
- The episode will NOT count toward coverage statistics

**The build script output should show:**
```
✅ Registry built: data/verified/verified-content.json
   X episodes, Y quotes
```

Where X and Y increase by the number of episodes and quotes you just added.

## What Gets Used Where

**PM Philosophy Map Flow (Quiz → Map → Contradictions → Results):**
- Uses `zone_influence` to determine guest's philosophy profile
- Uses verified `quotes` (via quoteId) in contradictions debate
- Uses `takeaways` to show guest wisdom

**Individual Episode Pages:**
- Uses `quotes` for verified quotes section (shows with themes/zones)
- Uses `takeaways` for key insights summary
- Uses `insightsData.ts` (separate file) for:
  - **Contrarian views** - spicy takes displayed with 🔥 icon
  - **Quotable moments** - memorable one-liners
  - **Frameworks** - named concepts/mental models
  - **Philosophy alignment** - zone distribution

**Note:** `insightsData.ts` is auto-generated separately and NOT part of this curation skill. This skill focuses on verified quotes, takeaways, and zone_influence.

## Output Format

```json
{
  "slug": "guest-name",
  "quotes": [
    {
      "id": "guest-name-q001",
      "speaker": "Guest Name",
      "text": "Direct quote from speaker...",
      "timestamp": "00:15:30",
      "source": {
        "slug": "guest-name",
        "path": "episodes/guest-name/transcript.md",
        "lineStart": 123,
        "lineEnd": 125
      },
      "themes": ["theme1", "theme2", "theme3"],
      "zones": ["zone1", "zone2"]
    }
  ],
  "themes": ["theme1", "theme2", "theme3"],
  "takeaways": [
    "First key insight that synthesizes their philosophy",
    "Second actionable takeaway",
    "Third memorable wisdom",
    "Fourth contrarian point",
    "Fifth practical framework"
  ],
  "zone_influence": {
    "velocity": 0.15,
    "perfection": 0.20,
    "discovery": 0.10,
    "data": 0.15,
    "intuition": 0.15,
    "alignment": 0.10,
    "chaos": 0.05,
    "focus": 0.10
  },
  "contrarian_candidates": [
    {
      "quoteId": "guest-name-q001",
      "why": "Why this take is provocative/contrarian",
      "related_zones": ["zone1", "zone2"]
    }
  ],
  "guest_metadata": {
    "guest_type": "founder",
    "company_stage": "public",
    "primary_topics": ["topic1", "topic2", "topic3"]
  }
}
```

## Validation Checklist

Before saving, verify:
- [ ] Quote IDs follow pattern: `{slug}-001`, `{slug}-002`, etc.
- [ ] All line numbers are accurate (check transcript)
- [ ] **CRITICAL: Timestamps match the ACTUAL location in transcript (not 00:00:00 to 00:05:00)**
- [ ] Timestamps match format "HH:MM:SS" or "MM:SS"
- [ ] **NO quotes from first 5 minutes (00:00:00 to 00:05:00)** - These are episode highlights
- [ ] If quote text appears in first 5 min, verify you extracted from the LATER full version
- [ ] All zones referenced exist in the 8 zones list
- [ ] **5 takeaways included** (required)
- [ ] **Zone influence included and sums to exactly 1.0** (required)
- [ ] No duplicate quote text across episodes
- [ ] Each quote has 2-4 themes, 1-3 zones
- [ ] Takeaways are specific and actionable
- [ ] contrarian_candidates field included with spicy/provocative quotes (optional but recommended)

## Common Mistakes to Avoid

❌ **Don't:**
- Include Lenny's questions as quotes
- Extract generic advice ("talk to users", "ship fast")
- Use quotes from sponsor segments
- **CRITICAL: Include episode highlights from the first 5 minutes (00:00:00 to 00:05:00)** - These are condensed versions that appear in full later
- Extract from timestamps 00:00:00 to 00:05:00 - always search for the full version later in the episode
- Tag every quote with "product-management" theme
- Assign equal zone influence to all zones
- Forget to verify line numbers AND timestamps match the actual transcript location

✅ **Do:**
- Focus on the guest's unique perspective
- Capture specific frameworks and mental models
- Include contrarian or spicy takes
- Show trade-offs and nuance
- Tag themes specifically (e.g., "product-market-fit" not just "product")
- Weight zone influence based on actual content
- Verify timestamps and line numbers are accurate

## Example Workflow

1. **Read transcript** for `marty-cagan`
2. **Scan for strong quotes** - found his "product manager is a creator, not facilitator" insight
3. **Verify line number** - line 168 in transcript
4. **Tag appropriately** - themes: ["product-management", "empowerment", "creator"], zones: ["focus", "perfection"]
5. **Extract 11 more quotes** following same process
6. **Write 5 takeaways** synthesizing his philosophy
7. **Calculate zone influence** - discovery (0.30), focus (0.20), alignment (0.15)...
8. **Add guest_metadata** - guest_type: "advisor", company_stage: "mixed", primary_topics: ["product-discovery", "empowerment"]
9. **Save to** `data/verified/marty-cagan.json`
10. **Run build script** - `npx tsx scripts/build-verified.ts` to update registry (CRITICAL!)

## Example: AI-Heavy Episode

For a 2024-2026 episode with significant AI discussion:

1. **Read transcript** and identify AI segments
2. **Extract AI-specific quotes**:
   - "AI lets us ship 10x faster but we still need human taste to know what's worth shipping"
     → themes: ["ai-velocity", "intuition", "velocity"], zones: ["velocity", "intuition"]
   - "We moved from 30 customer interviews to 300 AI-simulated users, quality dropped 20% but speed increased 10x"
     → themes: ["ai-workflows", "user-research", "trade-offs"], zones: ["velocity", "discovery", "chaos"]
3. **Balance AI with non-AI quotes** - don't make it 100% AI unless guest's primary focus
4. **Zone influence** should reflect AI's role:
   - Heavy AI adoption → higher velocity/chaos scores
   - Cautious AI approach → higher perfection/discovery scores
   - AI+data emphasis → higher data scores
5. **Takeaways** should synthesize AI perspective among other insights

## After Curation

Always run the build validator:
```bash
npx tsx scripts/build-verified.ts
```

This will:
- Validate all quote IDs are unique
- Check line numbers exist in transcripts
- Verify zone references are valid
- Detect duplicate quotes
- Show coverage statistics
- Generate registry files

## Coverage Goals

**Current**: 8/303 episodes (2.6%)
**Target**: 100+ episodes (33%)
**Per Zone**: 10+ episodes each

Run `npx tsx scripts/curation-stats.ts` to see:
- Current progress toward goals
- Which zones need more coverage
- Recommended episodes to curate next
- Theme distribution

## Tips for Speed

1. **Read efficiently** - skim for the guest's strongest moments
2. **Look for frameworks** - named concepts, mental models, processes
3. **Capture tensions** - when guest discusses trade-offs
4. **Trust your judgment** - if a quote resonates, it's likely good
5. **Batch similar work** - extract all quotes first, then tag themes
6. **Use patterns** - guests often repeat key ideas, find the best articulation

## Quality Over Quantity

Better to have 8 exceptional quotes than 12 mediocre ones. Each quote should make someone think "I need to remember this" or "That's a contrarian take I haven't heard."
