import { CATALOG, type Anime } from './catalog';

export type SearchStep = {
  id: string;
  label: string;
  detail: string;
};

export type ScoredResult = {
  anime: Anime;
  score: number;
  reasons: string[];
};

export type AiSearchResult = {
  query: string;
  steps: SearchStep[];
  results: ScoredResult[];
  summary: string;
};

/**
 * A transparent, deterministic "AI" search over the local catalog.
 * It weighs keyword matches across title, romaji, genres, studio,
 * tagline, and synopsis, then emits reasoning steps and per-result
 * match reasons — mimicking a ChatGPT-style reasoning trace.
 */
export function aiSearch(rawQuery: string): AiSearchResult {
  const query = rawQuery.trim();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  // Build reasoning steps that read like a model narrating its process.
  const steps: SearchStep[] = [
    { id: 'parse', label: 'Understanding your request', detail: `Parsing "${query}"` },
    { id: 'recall', label: 'Searching the catalog', detail: `Scanning ${CATALOG.length} titles` },
    { id: 'rank', label: 'Ranking by relevance', detail: 'Scoring title, genre, studio & theme' },
    { id: 'refine', label: 'Selecting the best matches', detail: 'Filtering low-confidence results' },
  ];

  if (!terms.length) {
    return { query, steps, results: [], summary: '' };
  }

  const genreHints: Record<string, string[]> = {
    cyberpunk: ['Cyberpunk', 'Sci-Fi'],
    mecha: ['Mecha', 'Sci-Fi', 'Action'],
    robot: ['Mecha', 'Sci-Fi'],
    horror: ['Horror', 'Supernatural', 'Psychological'],
    scary: ['Horror', 'Supernatural'],
    romance: ['Romance', 'Drama', 'Slice of Life'],
    love: ['Romance', 'Drama'],
    action: ['Action', 'Adventure', 'Shounen'],
    fight: ['Action', 'Shounen'],
    battle: ['Action', 'Supernatural', 'Shounen'],
    fantasy: ['Fantasy', 'Adventure', 'Magic'],
    magic: ['Fantasy', 'Magic', 'Supernatural'],
    demon: ['Supernatural', 'Action', 'Horror'],
    sword: ['Action', 'Historical', 'Adventure'],
    samurai: ['Historical', 'Action'],
    school: ['School', 'Slice of Life', 'Comedy'],
    cooking: ['Comedy', 'Drama', 'School', 'Sports'],
    food: ['Comedy', 'Drama'],
    pirate: ['Adventure', 'Action', 'Comedy', 'Fantasy'],
    sky: ['Adventure', 'Fantasy'],
    detective: ['Mystery', 'Psychological'],
    mystery: ['Mystery', 'Psychological', 'Supernatural'],
    sad: ['Drama', 'Romance', 'Slice of Life'],
    emotional: ['Drama', 'Romance', 'Slice of Life'],
    comedy: ['Comedy'],
    funny: ['Comedy', 'Slice of Life'],
    slice: ['Slice of Life', 'Drama', 'Romance'],
    scifi: ['Sci-Fi'],
    'sci-fi': ['Sci-Fi'],
    futuristic: ['Sci-Fi', 'Cyberpunk'],
    historical: ['Historical', 'Drama'],
    edo: ['Historical', 'Action'],
    post: ['Post-Apocalyptic', 'Drama'],
    apocalyptic: ['Post-Apocalyptic', 'Drama'],
    psychological: ['Psychological', 'Horror', 'Mystery'],
    space: ['Sci-Fi', 'Adventure'],
    music: ['Drama', 'Slice of Life'],
    sport: ['Sports'],
    sports: ['Sports'],
    ninja: ['Action', 'Supernatural', 'Shounen'],
    ghost: ['Supernatural', 'Horror'],
    ai: ['Sci-Fi', 'Cyberpunk'],
  };

  const scored: ScoredResult[] = CATALOG.map((anime) => {
    let score = 0;
    const reasons: string[] = [];
    const titleLc = anime.title.toLowerCase();
    const romajiLc = (anime.romaji ?? '').toLowerCase();
    const synLc = anime.synopsis.toLowerCase();
    const tagLc = anime.tagline.toLowerCase();
    const genreLc = anime.genres.map((g) => g.toLowerCase());

    for (const term of terms) {
      // Exact title hit — strongest signal
      if (titleLc.includes(term)) {
        score += 40;
        if (!reasons.some((r) => r.includes('title'))) reasons.push(`Title matches "${term}"`);
      }
      if (romajiLc.includes(term)) {
        score += 25;
        if (!reasons.some((r) => r.includes('Japanese'))) reasons.push('Japanese title matches your query');
      }
      // Genre direct match
      const genreHit = genreLc.find((g) => g.includes(term) || term.includes(g));
      if (genreHit) {
        score += 22;
        if (!reasons.some((r) => r.includes('Genre'))) reasons.push(`Genre: ${cap(genreHit)}`);
      }
      // Studio
      if (anime.studio.toLowerCase().includes(term)) {
        score += 18;
        reasons.push(`Studio: ${anime.studio}`);
      }
      // Synopsis / tagline keyword
      if (synLc.includes(term)) {
        score += 8;
        if (!reasons.some((r) => r.includes('synopsis'))) reasons.push('Mentioned in the story');
      }
      if (tagLc.includes(term)) {
        score += 6;
        if (!reasons.some((r) => r.includes('tagline'))) reasons.push('Matches the tagline');
      }
      // Semantic genre hints (e.g. "scary" -> Horror)
      const hints = genreHints[term];
      if (hints) {
        const matched = hints.filter((h) => anime.genres.includes(h));
        if (matched.length) {
          score += 14 * matched.length;
          reasons.push(`Fits the vibe: ${matched.join(', ')}`);
        }
      }
    }

    // Small quality / recency nudge so ties resolve sensibly
    score += anime.rating * 0.6;
    if (anime.isNew) score += 3;
    if (anime.trendingRank) score += 4;

    if (reasons.length === 0 && score > 0) reasons.push('Partial keyword match');
    return { anime, score, reasons: dedupe(reasons).slice(0, 3) };
  });

  const results = scored
    .filter((r) => r.score > 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const summary = buildSummary(query, results);

  return { query, steps, results, summary };
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function buildSummary(query: string, results: ScoredResult[]): string {
  if (results.length === 0) {
    return `I couldn't find any anime in the library matching "${query}". Try a genre (action, romance, horror), a mood (scary, sad, funny), or a studio name.`;
  }
  const top = results[0];
  if (results.length === 1) {
    return `Based on "${query}", I found one strong match: ${top.anime.title}. ${top.reasons[0] ?? 'It fits your query well.'}`;
  }
  const names = results.slice(0, 3).map((r) => r.anime.title);
  const list = names.length === 3 ? `${names[0]}, ${names[1]}, and ${names[2]}` : names.join(' and ');
  return `Here are ${results.length} anime I'd recommend for "${query}". The strongest match is ${top.anime.title} — ${top.reasons[0] ?? 'it fits your query well'}. Other great picks include ${list}.`;
}
