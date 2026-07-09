import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Loader2,
  Check,
  CornerDownLeft,
  X,
  Play,
  Plus,
  Star,
  Menu,
} from 'lucide-react';
import { aiSearch, type AiSearchResult, type SearchStep } from '../data/aiSearch';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { MaturityBadge, GenrePill } from './Badges';
import { AiSidebar } from './AiSidebar';
import { cn } from '../utils/cn';

type Props = {
  onOpenAnime: (a: Anime) => void;
  onPlay: (a: Anime) => void;
  onToggleList: (a: Anime) => void;
  onRemoveFromList: (id: string) => void;
  onClearList: () => void;
  inMyList: (id: string) => boolean;
  myList: Anime[];
};

const SUGGESTIONS = [
  'Cyberpunk action anime',
  'Something scary to watch tonight',
  'Romance that will make me cry',
  'Mecha with a twist',
  'Cozy slice of life',
  'Sword-fighting historical drama',
];

type Phase = 'idle' | 'thinking' | 'done';

export function AiSearch({
  onOpenAnime,
  onPlay,
  onToggleList,
  onRemoveFromList,
  onClearList,
  inMyList,
  myList,
}: Props) {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setResult(null);
      setActiveStep(-1);
      setPhase('thinking');

      // Pre-compute the full result so reasoning steps can be revealed progressively.
      const res = aiSearch(trimmed);

      // Reveal reasoning steps one at a time, then surface results — like a model "thinking".
      const steps = res.steps;
      let i = 0;
      const tick = () => {
        if (i < steps.length) {
          setActiveStep(i);
          i++;
          setTimeout(tick, 520 + Math.random() * 360);
        } else {
          setActiveStep(steps.length);
          setTimeout(() => {
            setResult(res);
            setPhase('done');
          }, 360);
        }
      };
      tick();
    },
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const reset = () => {
    setPhase('idle');
    setResult(null);
    setActiveStep(-1);
    setQuery('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (phase === 'done' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [phase]);

  return (
    <div className="relative min-h-screen bg-ink-950">
      {/* Sidebar */}
      <AiSidebar
        myList={myList}
        onRemove={onRemoveFromList}
        onOpenAnime={(a) => {
          onOpenAnime(a);
          setMobileNav(false);
        }}
        onClearAll={onClearList}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main column */}
      <div
        className={cn(
          'relative min-h-screen overflow-y-auto transition-[padding] duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        )
      }>
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-rose-500/10 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-gold-500/5 blur-[120px]" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNav(true)}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-200 hover:bg-ink-800 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow">
                <Sparkles size={18} className="text-white" />
              </div>
              <p className="font-display text-lg font-extrabold tracking-tight text-white">
                Otaku<span className="text-rose-500">AI</span>
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 lg:flex">
              <Sparkles size={13} />
              AI-powered anime search
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-5 pb-24 sm:px-8">
        {/* Search hero */}
        <div
          className={cn(
            'mx-auto flex w-full flex-col items-center transition-all duration-700',
            phase === 'idle' ? 'mt-[12vh]' : 'mt-[6vh]'
          )}
        >
          <div className="mb-5 flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 animate-fade-in lg:hidden">
            <Sparkles size={13} />
            AI-powered anime search
          </div>
          <h1 className="text-center font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl text-balance animate-fade-up">
            Find your next
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-cyan-400 bg-clip-text text-transparent">
              {' '}
              favorite anime
            </span>
          </h1>
          <p className="mt-3 max-w-md text-center text-sm text-ink-300 sm:text-base animate-fade-up">
            Describe what you're in the mood for. I'll search the library and rank the best matches for you.
          </p>

          {/* Search box */}
          <form onSubmit={onSubmit} className="mt-7 w-full animate-fade-up">
            <div
              className={cn(
                'group flex items-center gap-3 rounded-2xl border bg-ink-850/80 p-2 pl-4 shadow-card backdrop-blur-xl transition-all',
                'border-white/10 focus-within:border-rose-500/50 focus-within:shadow-glow'
              )}
            >
              <Search size={20} className="shrink-0 text-ink-400 transition-colors group-focus-within:text-rose-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. cyberpunk action anime with a strong lead…"
                className="w-full bg-transparent py-2.5 text-base text-white placeholder:text-ink-400 focus:outline-none"
                disabled={phase === 'thinking'}
              />
              {query && phase !== 'thinking' && (
                <button
                  type="button"
                  onClick={reset}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-800 hover:text-white"
                  aria-label="Clear"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={!query.trim() || phase === 'thinking'}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
                  query.trim() && phase !== 'thinking'
                    ? 'bg-rose-500 text-white shadow-glow hover:bg-rose-400'
                    : 'cursor-not-allowed bg-ink-700 text-ink-400'
                )}
              >
                {phase === 'thinking' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    Search
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggestions (only when idle) */}
          {phase === 'idle' && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-up">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    runSearch(s);
                  }}
                  className="rounded-full border border-white/10 bg-ink-850/60 px-3.5 py-1.5 text-xs text-ink-200 backdrop-blur transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thinking trace */}
        {phase === 'thinking' && (
          <div className="mt-10 w-full animate-fade-up">
            <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4 backdrop-blur-xl sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-200">
                <Loader2 size={15} className="animate-spin text-rose-500" />
                Thinking…
              </div>
              <ul className="space-y-2.5">
                {(result?.steps ?? aiSearch(query).steps).map((step: SearchStep, i) => {
                  const state =
                    i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
                  return (
                    <li key={step.id} className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] transition-all',
                          state === 'done'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : state === 'active'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-ink-800 text-ink-500'
                        )}
                      >
                        {state === 'done' ? (
                          <Check size={11} />
                        ) : state === 'active' ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            'text-sm transition-colors',
                            state === 'pending' ? 'text-ink-500' : 'text-ink-100'
                          )}
                        >
                          {step.label}
                        </p>
                        {state !== 'pending' && (
                          <p className="text-xs text-ink-400">{step.detail}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Results */}
        {phase === 'done' && result && (
          <div ref={resultsRef} className="mt-8 w-full animate-fade-up">
            {/* AI summary */}
            <div className="mb-6 flex gap-3 rounded-2xl border border-white/10 bg-ink-900/70 p-4 backdrop-blur-xl sm:p-5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  OtakuAI
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-100">{result.summary}</p>
              </div>
            </div>

            {result.results.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-ink-850/40 py-16 text-center">
                <Search size={28} className="text-ink-500" />
                <p className="mt-3 font-display text-lg font-semibold text-white">No matches found</p>
                <p className="mt-1 max-w-sm text-sm text-ink-400">{result.summary}</p>
                <button
                  onClick={reset}
                  className="mt-5 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400"
                >
                  Try another search
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-300">
                    {result.results.length} match{result.results.length > 1 ? 'es' : ''} for{' '}
                    <span className="text-white">"{result.query}"</span>
                  </p>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-white"
                  >
                    New search
                    <CornerDownLeft size={13} />
                  </button>
                </div>

                <ul className="space-y-3">
                  {result.results.map((r, idx) => (
                    <AiResultCard
                      key={r.anime.id}
                      rank={idx + 1}
                      result={r}
                      inMyList={inMyList(r.anime.id)}
                      onOpen={() => onOpenAnime(r.anime)}
                      onPlay={() => onPlay(r.anime)}
                      onToggleList={() => onToggleList(r.anime)}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

/* ---------- Result card ---------- */

function AiResultCard({
  rank,
  result,
  inMyList,
  onOpen,
  onPlay,
  onToggleList,
}: {
  rank: number;
  result: AiSearchResult['results'][number];
  inMyList: boolean;
  onOpen: () => void;
  onPlay: () => void;
  onToggleList: () => void;
}) {
  const { anime, reasons } = result;
  const matchPct = Math.min(99, Math.round(result.score));

  return (
    <li className="group/card overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-card">
      <div className="flex gap-0 sm:gap-4">
        {/* Poster */}
        <button
          onClick={onOpen}
          className="relative hidden shrink-0 sm:block"
          aria-label={`Open ${anime.title}`}
        >
          <SmartImage
            src={anime.poster}
            alt={anime.title}
            rounded="rounded-none"
            className="h-full w-28 lg:w-32"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900/60" />
          <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-md bg-rose-500 text-xs font-bold text-white shadow-glow">
            {rank}
          </span>
        </button>

        {/* Body */}
        <div className="min-w-0 flex-1 p-4 sm:py-4 sm:pr-4">
          {/* Mobile rank row */}
          <div className="mb-2 flex items-center gap-2 sm:hidden">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-rose-500 text-[10px] font-bold text-white">
              {rank}
            </span>
            <MatchBar pct={matchPct} />
          </div>

          <div className="flex items-start justify-between gap-3">
            <button onClick={onOpen} className="min-w-0 text-left">
              <h3 className="font-display text-lg font-bold leading-tight text-white transition-colors group-hover/card:text-rose-300">
                {anime.title}
              </h3>
              <p className="mt-0.5 text-xs text-ink-400">
                {anime.year} · {anime.studio} · {anime.episodesTotal} eps
              </p>
            </button>
            <div className="hidden items-center gap-1.5 sm:flex">
              <MatchBar pct={matchPct} />
            </div>
          </div>

          {/* Match reasons */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {reasons.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-300"
              >
                <Sparkles size={10} />
                {r}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="mt-3 text-sm leading-relaxed text-ink-300 line-clamp-2">{anime.synopsis}</p>

          {/* Genres + rating */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {anime.genres.slice(0, 3).map((g) => (
              <GenrePill key={g} name={g} />
            ))}
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-gold-400">
              <Star size={12} className="fill-gold-400" />
              {anime.rating.toFixed(1)}
            </span>
            <MaturityBadge rating={anime.maturity} />
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:bg-rose-400"
            >
              <Play size={15} className="fill-white" />
              Play
            </button>
            <button
              onClick={onToggleList}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all',
                inMyList
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-400'
                  : 'border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
              )}
            >
              {inMyList ? <Check size={15} /> : <Plus size={15} />}
              {inMyList ? 'Saved' : 'My List'}
            </button>
            <button
              onClick={onOpen}
              className="ml-auto text-sm font-medium text-ink-300 transition-colors hover:text-white"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function MatchBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-cyan-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums text-ink-300">{pct}%</span>
    </div>
  );
}
