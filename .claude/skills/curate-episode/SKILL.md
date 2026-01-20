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
- ✅ NOT from first 5 minutes (likely episode highlights/duplicates)
- ✅ NOT from sponsor segments or intro/outro
- ✅ NOT generic platitudes - must be specific and distinctive

**What Makes a Great Quote:**
- Strong opinions backed by experience
- Contrarian or counterintuitive insights
- Specific frameworks or mental models
- Memorable one-liners that crystallize ideas
- Trade-offs and tensions (not just "best practices")

### Step 3: Tag Each Quote
**For each quote, identify:**
- **Themes** (2-4 tags): e.g., "product-market-fit", "velocity", "user-research", "leadership"
- **Zones** (1-3 zones): Which philosophy zones does this quote exemplify?
- **Line numbers**: Exact line_start and line_end from transcript
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
  "episode_slug": "guest-name",
  "guest": "Guest Name",
  "episode_title": "Full Episode Title",
  "verification_date": "2025-01-20",
  "verified_by": "warp-agent",
  "quotes": [
    {
      "id": "guest-name-001",
      "text": "Direct quote from speaker...",
      "source": {
        "line_start": 123,
        "line_end": 125,
        "timestamp": "00:15:30",
        "speaker": "Guest Name"
      },
      "context": "Brief context about when/why this was said",
      "themes": ["theme1", "theme2", "theme3"],
      "zones": ["zone1", "zone2"],
      "verified": true
    }
  ],
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
      "quoteId": "guest-name-00X",
      "why": "Why this take is provocative/contrarian",
      "related_zones": ["zone1", "zone2"]
    }
  ]
}
```

## Validation Checklist

Before saving, verify:
- [ ] Quote IDs follow pattern: `{slug}-001`, `{slug}-002`, etc.
- [ ] All line numbers are accurate (check transcript)
- [ ] Timestamps match format "HH:MM:SS" or "MM:SS"
- [ ] All zones referenced exist in the 8 zones list
- [ ] **5 takeaways included** (required)
- [ ] **Zone influence included and sums to exactly 1.0** (required)
- [ ] No duplicate quote text across episodes
- [ ] Quotes avoid first 5 minutes of episode
- [ ] Each quote has 2-4 themes, 1-3 zones
- [ ] Takeaways are specific and actionable
- [ ] contrarian_candidates field included with spicy/provocative quotes (optional but recommended)

## Common Mistakes to Avoid

❌ **Don't:**
- Include Lenny's questions as quotes
- Extract generic advice ("talk to users", "ship fast")
- Use quotes from sponsor segments
- Include episode highlights from the first 5 minutes
- Tag every quote with "product-management" theme
- Assign equal zone influence to all zones
- Forget to verify line numbers match transcript

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
6. **Write 5 takeaways** synthesizing his philosophy (optional)
7. **Calculate zone influence** - discovery (0.30), focus (0.20), alignment (0.15)... (optional)
8. **Save to** `data/verified/marty-cagan.json`
9. **Validate** with `npx tsx scripts/build-verified.ts`

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
