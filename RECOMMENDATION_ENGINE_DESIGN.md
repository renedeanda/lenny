# Podcast Recommendation Engine Design

**Goal:** Transform quiz results into personalized podcast episode recommendations that drive listening and discovery.

---

## 🎯 Core Problem

**Current State:**
- User takes quiz → Gets abstract "zone" result
- Shows philosophy card with zone name and description
- Doesn't leverage 91 curated quotes effectively
- Doesn't drive podcast listening

**Desired State:**
- User takes quiz → Gets 5-7 specific episode recommendations
- Shows why each episode matches their philosophy
- Includes contrarian recommendations for growth
- Drives clicks to episode pages and podcast listening

---

## 🔍 Recommendation Algorithm

### Input: User Quiz Answers
```typescript
interface QuizAnswers {
  q1: 'velocity' | 'perfection';
  q2: 'discovery' | 'intuition';
  q3: 'data' | 'intuition';
  q4: 'alignment' | 'chaos';
  q5: 'focus' | 'velocity';
  q6: 'data' | 'intuition';
  q7: 'alignment' | 'focus';
}
```

### Step 1: Calculate User Philosophy Profile

**Current System** (in `lib/scoring.ts`):
```typescript
// Already implemented
const zoneScores = calculateZoneScores(answers);
// Returns: { velocity: 2, perfection: 0, discovery: 1, ... }

const zonePercentages = getZonePercentages(zoneScores);
// Returns: { velocity: 28%, perfection: 0%, discovery: 14%, ... }
```

**User Profile:**
```typescript
interface UserProfile {
  zoneScores: Record<ZoneId, number>;     // Raw scores
  zonePercentages: Record<ZoneId, number>; // Percentages
  primaryZone: ZoneId;                     // Highest score
  secondaryZone: ZoneId;                   // Second highest
  blindSpotZone: ZoneId;                   // Lowest score
}
```

### Step 2: Score Each Curated Episode

For each episode in `data/verified/`, calculate alignment score:

```typescript
interface EpisodeAlignment {
  slug: string;
  guest: string;
  title: string;
  alignmentScore: number;        // 0-100
  matchingQuotes: Quote[];       // Quotes that match user's philosophy
  matchReason: string;           // "Both prioritize velocity and data"
  episodeZones: Record<ZoneId, number>; // Episode's zone_influence
}

function calculateEpisodeAlignment(
  userProfile: UserProfile,
  episode: EpisodeEnrichment
): EpisodeAlignment {
  // Algorithm:
  // 1. Compare user's zonePercentages with episode's zone_influence
  // 2. Use cosine similarity or dot product
  // 3. Weight by user's strongest zones

  let alignmentScore = 0;
  const matchingQuotes = [];

  // For each zone, multiply user percentage by episode influence
  for (const zone of ALL_ZONES) {
    const userStrength = userProfile.zonePercentages[zone];
    const episodeStrength = episode.zone_influence[zone];
    alignmentScore += (userStrength / 100) * episodeStrength;
  }

  // Convert to 0-100 scale
  alignmentScore *= 100;

  // Find matching quotes (quotes in user's top zones)
  for (const quote of episode.quotes) {
    for (const zoneId of quote.zones) {
      if (userProfile.zonePercentages[zoneId] > 15) {
        matchingQuotes.push(quote);
        break;
      }
    }
  }

  return {
    slug: episode.slug,
    guest: episode.metadata.guest,
    title: episode.metadata.title,
    alignmentScore,
    matchingQuotes: matchingQuotes.slice(0, 2), // Top 2
    matchReason: generateMatchReason(userProfile, episode),
    episodeZones: episode.zone_influence
  };
}
```

### Step 3: Generate Recommendations

**Primary Recommendations (3-5 episodes)**
```typescript
// Sort all episodes by alignmentScore (descending)
const primaryRecommendations = allEpisodes
  .map(ep => calculateEpisodeAlignment(userProfile, ep))
  .sort((a, b) => b.alignmentScore - a.alignmentScore)
  .slice(0, 5);
```

**Contrarian Recommendations (2-3 episodes)**
```typescript
// Find episodes that are OPPOSITE of user's profile
// Prioritize episodes strong in user's blind spot zone
const contrarianRecommendations = allEpisodes
  .map(ep => ({
    ...calculateEpisodeAlignment(userProfile, ep),
    blindSpotStrength: ep.zone_influence[userProfile.blindSpotZone]
  }))
  .filter(ep => ep.blindSpotStrength > 0.2) // Strong in blind spot
  .sort((a, b) => b.blindSpotStrength - a.blindSpotStrength)
  .slice(0, 3);
```

---

## 🎨 Results Page Redesign

### New Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  YOUR PM PHILOSOPHY                                      │
│  Based on 7 questions & 91 verified quotes              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🎯 YOUR PHILOSOPHY MATCH                               │
│                                                          │
│  You're 87% aligned with Brian Chesky's philosophy      │
│                                                          │
│  "Your top strengths: Velocity + Intuition"             │
│  "Your blind spot: Alignment"                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🔥 RECOMMENDED EPISODES FOR YOU                        │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Brian Chesky - Building Airbnb                    92%││
│  │ "Apple is a product company..."                     ││
│  │ → Listen to Episode                                 ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Rahul Vohra - Finding Product-Market Fit          89%││
│  │ "Speed is the ultimate weapon..."                   ││
│  │ → Listen to Episode                                 ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  [+ 3 more episodes]                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ⚡ PERSPECTIVES THAT MIGHT CHALLENGE YOU               │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Marty Cagan - The Importance of Alignment           ││
│  │ "Build consensus before making big decisions..."    ││
│  │ → Expand Your Thinking                              ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  [+ 2 more contrarian episodes]                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📊 YOUR PHILOSOPHY BREAKDOWN                           │
│                                                          │
│  [Existing zone breakdown visualization]                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [SHARE RESULTS] [EXPLORE ALL EPISODES] [RETAKE QUIZ]  │
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

**1. Philosophy Match Card**
```typescript
<PhilosophyMatchCard
  topGuest={primaryRecommendations[0]}
  alignmentScore={primaryRecommendations[0].alignmentScore}
  userProfile={userProfile}
/>
```

**2. Episode Recommendation Card**
```typescript
<EpisodeRecommendationCard
  episode={recommendation}
  matchingQuote={recommendation.matchingQuotes[0]}
  alignmentScore={recommendation.alignmentScore}
  matchReason={recommendation.matchReason}
/>
```

**3. Contrarian Card**
```typescript
<ContrarianRecommendationCard
  episode={contrarianRec}
  blindSpotZone={userProfile.blindSpotZone}
  reason="Explore alignment and consensus-building"
/>
```

---

## 📐 Implementation Plan

### Phase 1: Algorithm Implementation
**File:** `lib/recommendations.ts`

```typescript
// New functions
export function calculateEpisodeAlignment(
  userProfile: UserProfile,
  episode: EpisodeEnrichment
): EpisodeAlignment;

export function generateRecommendations(
  answers: QuizAnswers
): {
  primary: EpisodeAlignment[];
  contrarian: EpisodeAlignment[];
  userProfile: UserProfile;
};

export function generateMatchReason(
  userProfile: UserProfile,
  episode: EpisodeEnrichment
): string;
```

### Phase 2: Results Page Redesign
**File:** `app/results/page.tsx`

- Remove: "View Your Map" button (3D map)
- Add: Recommendation cards
- Add: Contrarian recommendations
- Update: Philosophy summary to focus on episode matches
- Keep: Zone breakdown (move to bottom)
- Keep: Shareable card functionality

### Phase 3: Components
**New files:**
- `components/PhilosophyMatchCard.tsx`
- `components/EpisodeRecommendationCard.tsx`
- `components/ContrarianRecommendationCard.tsx`
- `components/RecommendationList.tsx`

### Phase 4: Testing
- Test with various quiz answer combinations
- Ensure diverse recommendations
- Validate alignment scores make sense
- Test contrarian logic (actually opposite)
- Check mobile responsiveness

---

## 🎯 Success Criteria

### Quantitative Metrics
- [ ] 5 primary recommendations for every quiz result
- [ ] 3 contrarian recommendations
- [ ] Alignment scores 0-100 (not all clustered)
- [ ] 80%+ users click at least one episode recommendation
- [ ] Average 2+ episodes visited per result

### Qualitative Metrics
- [ ] Recommendations feel personalized
- [ ] Match reasons are clear and compelling
- [ ] Contrarian recommendations are truly different
- [ ] Results are shareable and engaging
- [ ] UI is clean and not overwhelming

---

## 🔍 Edge Cases

### Not Enough Curated Episodes
**Current:** Only 8/303 episodes curated
**Solution:** Show all 8 + message "More episodes coming soon"
**Priority:** Curate 20+ episodes ASAP to enable better recommendations

### User with Extreme Scores
**Example:** 100% velocity, 0% everything else
**Solution:**
- Still show 5 recommendations (top velocity episodes)
- Contrarian shows episodes weak in velocity
- Message: "You have strong convictions in velocity"

### Tie Scores
**Example:** 90% match for 3 different episodes
**Solution:**
- Use secondary factors (guest popularity, episode length)
- Randomize slightly to avoid always showing same order
- Add variety (don't recommend 3 Brian Chesky episodes)

### No Matching Quotes
**Scenario:** Episode alignment is high but no individual quotes match
**Solution:**
- Show episode anyway (alignment based on zone_influence)
- Use episode takeaways instead of quotes
- Message: "This episode's philosophy aligns with yours"

---

## 📊 Data Requirements

### Minimum for Launch
- **Episodes:** 20+ curated (currently 8)
- **Coverage:** All 8 zones have 2+ episodes
- **Quotes:** 150+ verified quotes
- **Quality:** All episodes have zone_influence and takeaways

### Optimal for Great UX
- **Episodes:** 50+ curated
- **Coverage:** All 8 zones have 5+ episodes
- **Quotes:** 400+ verified quotes
- **Diversity:** Multiple guests per zone

---

## 🚀 Development Sequence

### Step 1: Build Algorithm (2-3 hours)
- Create `lib/recommendations.ts`
- Implement alignment scoring
- Test with existing 8 episodes
- Verify scores make sense

### Step 2: Update Results Page (2-3 hours)
- Import recommendation logic
- Generate recs on page load
- Update layout structure
- Keep shareable card

### Step 3: Create Components (2-3 hours)
- PhilosophyMatchCard
- EpisodeRecommendationCard
- ContrarianRecommendationCard
- RecommendationList container

### Step 4: Polish & Test (1-2 hours)
- Mobile responsive
- Loading states
- Error handling
- Analytics tracking

### Step 5: Curate More Episodes (3-5 hours)
- Use `/curate-episode` skill
- Target 20+ total episodes
- Focus on popular guests
- Ensure zone diversity

**Total Estimated Time:** 10-15 hours

---

## 🎨 Design Notes

### Visual Hierarchy
1. **Top:** Philosophy match (most exciting insight)
2. **Middle:** Recommended episodes (primary CTA)
3. **Lower:** Contrarian recommendations (secondary)
4. **Bottom:** Zone breakdown (existing viz)

### Tone & Copy
- **Excited:** "You're 92% aligned with Brian Chesky!"
- **Helpful:** "These episodes will resonate with you"
- **Growth-minded:** "Perspectives that might challenge you"
- **Not judgmental:** No "you should" or "you need"

### Interaction
- **Click episode card:** Navigate to episode page
- **Hover:** Show more quote text
- **Share:** Generate shareable results card
- **Retake:** Reset quiz and try again

---

## 🔗 Integration Points

### Existing Systems
- **Quiz:** Already calculates zoneScores and zonePercentages
- **Episodes:** Already have verified quotes and zone_influence
- **Results:** Already shows philosophy profile
- **Explore:** Already links to individual episodes

### New Connections
- Results → Episode pages (new recommendation cards)
- Results → Explore (filtered by user's zones)
- Episode pages → "Similar episodes" (use alignment logic)

---

## 📝 Next Actions

1. **Implement recommendation algorithm** (`lib/recommendations.ts`)
2. **Test algorithm** with existing 8 episodes
3. **Redesign results page** with new components
4. **Curate 12+ more episodes** to reach 20 total
5. **Deploy and measure** click-through rates
6. **Iterate** based on user behavior

---

**Status:** Design complete, ready for implementation
**Priority:** HIGH - This is the key feature for driving engagement
**Dependencies:** Need 20+ curated episodes for best UX (currently 8)
**Estimated Impact:** 3-5x increase in episode page visits from results
