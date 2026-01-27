#!/usr/bin/env tsx
/**
 * Curation Progress Dashboard
 * 
 * Shows current curation progress, gaps, and recommendations for next episodes to curate.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ZoneStats {
  name: string;
  episodeCount: number;
  quoteCount: number;
  target: number;
  gap: number;
  percentage: number;
}

interface ThemeStats {
  theme: string;
  count: number;
  episodes: string[];
}

function loadVerifiedEpisodes(): any[] {
  const verifiedDir = path.join(process.cwd(), 'data', 'verified');
  
  if (!fs.existsSync(verifiedDir)) {
    return [];
  }
  
  const files = fs.readdirSync(verifiedDir)
    .filter(f => f.endsWith('.json') && f !== 'verified-content.json');
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(verifiedDir, file), 'utf-8');
    return JSON.parse(content);
  });
}

function calculateZoneStats(episodes: any[]): Record<string, ZoneStats> {
  const ZONES = ['velocity', 'perfection', 'discovery', 'data', 'intuition', 'alignment', 'chaos', 'focus'];
  const TARGET_PER_ZONE = 10;
  
  const zoneStats: Record<string, ZoneStats> = {};
  
  for (const zoneName of ZONES) {
    const episodeSlugs = new Set<string>();
    let quoteCount = 0;
    
    for (const episode of episodes) {
      const quotes = episode.quotes || [];
      const slug = episode.slug;
      
      for (const quote of quotes) {
        if (quote.zones && quote.zones.includes(zoneName)) {
          episodeSlugs.add(slug);
          quoteCount++;
        }
      }
    }
    
    const episodeCount = episodeSlugs.size;
    const gap = Math.max(0, TARGET_PER_ZONE - episodeCount);
    const percentage = (episodeCount / TARGET_PER_ZONE) * 100;
    
    zoneStats[zoneName] = {
      name: zoneName,
      episodeCount,
      quoteCount,
      target: TARGET_PER_ZONE,
      gap,
      percentage
    };
  }
  
  return zoneStats;
}

function calculateThemeStats(episodes: any[]): ThemeStats[] {
  const themeMap = new Map<string, Set<string>>();
  
  for (const episode of episodes) {
    const quotes = episode.quotes || [];
    const slug = episode.slug;
    
    for (const quote of quotes) {
      if (quote.themes) {
        for (const theme of quote.themes) {
          if (!themeMap.has(theme)) {
            themeMap.set(theme, new Set());
          }
          themeMap.get(theme)!.add(slug);
        }
      }
    }
  }
  
  const themeStats: ThemeStats[] = [];
  for (const [theme, episodeSet] of themeMap.entries()) {
    themeStats.push({
      theme,
      count: episodeSet.size,
      episodes: Array.from(episodeSet)
    });
  }
  
  return themeStats.sort((a, b) => b.count - a.count);
}

function getRecommendedEpisodes(zoneStats: Record<string, ZoneStats>): string[] {
  // Find zones with biggest gaps
  const sortedZones = Object.values(zoneStats)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);
  
  const recommendations: string[] = [];
  
  for (const zone of sortedZones) {
    switch (zone.name) {
      case 'chaos':
        recommendations.push('guillermo-rauch', 'anton-osika', 'jason-fried', 'paul-adams');
        break;
      case 'data':
        recommendations.push('casey-winters', 'brian-balfour', 'dan-hockenmaier', 'adam-fishman');
        break;
      case 'discovery':
        recommendations.push('marty-cagan', 'teresa-torres', 'april-dunford', 'indi-young');
        break;
      case 'perfection':
        recommendations.push('tobi-lutke', 'kevin-hale', 'julie-zhuo', 'karri-saarinen');
        break;
      case 'intuition':
        recommendations.push('paul-graham', 'jason-fried', 'kevin-systrom', 'josh-miller');
        break;
      case 'alignment':
        recommendations.push('gokul-rajaram', 'claire-hughes-johnson', 'shreyas-doshi');
        break;
      case 'velocity':
        recommendations.push('guillermo-rauch', 'jason-fried', 'eric-migicovsky');
        break;
      case 'focus':
        recommendations.push('karri-saarinen', 'jason-fried', 'april-dunford');
        break;
    }
  }
  
  return [...new Set(recommendations)];
}

function printProgressBar(percentage: number, width: number = 30): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  
  let bar = '';
  if (percentage >= 100) {
    bar = '█'.repeat(width);
  } else if (percentage >= 80) {
    bar = '▓'.repeat(filled) + '░'.repeat(empty);
  } else if (percentage >= 50) {
    bar = '▒'.repeat(filled) + '░'.repeat(empty);
  } else {
    bar = '░'.repeat(filled) + ' '.repeat(empty);
  }
  
  return `[${bar}]`;
}

function main() {
  console.log('\n📊 PM Philosophy Map - Curation Progress Dashboard\n');
  console.log('═'.repeat(70));
  
  const episodes = loadVerifiedEpisodes();
  const TOTAL_EPISODES = 295;
  const TARGET_EPISODES = 100;
  
  // Overall progress
  console.log('\n🎯 Overall Progress');
  console.log('─'.repeat(70));
  const overallPercent = (episodes.length / TARGET_EPISODES) * 100;
  const catalogPercent = (episodes.length / TOTAL_EPISODES) * 100;
  
  console.log(`Episodes curated: ${episodes.length}/${TARGET_EPISODES} (${overallPercent.toFixed(1)}% of target)`);
  console.log(`Catalog coverage: ${episodes.length}/${TOTAL_EPISODES} (${catalogPercent.toFixed(1)}%)`);
  console.log(`Episodes remaining: ${TARGET_EPISODES - episodes.length}`);
  console.log(`Progress: ${printProgressBar(overallPercent)} ${overallPercent.toFixed(0)}%`);
  
  // Total quotes
  const totalQuotes = episodes.reduce((sum, ep) => {
    const quotes = ep.quotes || [];
    return sum + quotes.length;
  }, 0);
  const avgQuotes = episodes.length > 0 ? (totalQuotes / episodes.length).toFixed(1) : 0;
  console.log(`\nTotal quotes: ${totalQuotes}`);
  console.log(`Avg quotes/episode: ${avgQuotes}`);
  
  // Zone stats
  console.log('\n📍 Zone Coverage (Target: 10+ episodes per zone)');
  console.log('─'.repeat(70));
  
  const zoneStats = calculateZoneStats(episodes);
  const sortedZones = Object.values(zoneStats).sort((a, b) => a.episodeCount - b.episodeCount);
  
  for (const zone of sortedZones) {
    const status = zone.gap === 0 ? '✅' : '⚠️';
    const bar = printProgressBar(zone.percentage, 20);
    console.log(`${status} ${zone.name.padEnd(12)} ${bar} ${zone.episodeCount}/${zone.target} (${zone.quoteCount} quotes)`);
  }
  
  // Identify gaps
  const underservedZones = sortedZones.filter(z => z.gap > 0);
  if (underservedZones.length > 0) {
    console.log(`\n⚠️  ${underservedZones.length} zones need more coverage`);
  }
  
  // Theme distribution
  console.log('\n🏷️  Top Themes (by episode count)');
  console.log('─'.repeat(70));
  const themeStats = calculateThemeStats(episodes);
  const topThemes = themeStats.slice(0, 15);
  
  for (const theme of topThemes) {
    console.log(`${theme.theme.padEnd(25)} ${theme.count} episodes`);
  }
  
  // Recommendations
  console.log('\n💡 Recommended Next Episodes to Curate');
  console.log('─'.repeat(70));
  console.log('Based on zone coverage gaps:\n');
  
  const recommended = getRecommendedEpisodes(zoneStats);
  const topRecommended = recommended.slice(0, 10);
  
  for (let i = 0; i < topRecommended.length; i++) {
    console.log(`${i + 1}. ${topRecommended[i]}`);
  }
  
  console.log('\n💻 Quick Commands:');
  console.log('─'.repeat(70));
  console.log('Curate single episode:');
  console.log(`  npx tsx scripts/curate-batch.ts ${topRecommended[0]}\n`);
  console.log('Curate batch of 5:');
  console.log(`  npx tsx scripts/curate-batch.ts ${topRecommended.slice(0, 5).join(' ')}\n`);
  console.log('Curate from priority list:');
  console.log('  npx tsx scripts/curate-batch.ts --list priority-episodes.txt\n');
  
  console.log('═'.repeat(70));
  console.log('');
}

main();
