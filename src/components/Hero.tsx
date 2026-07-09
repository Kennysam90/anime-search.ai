import { useEffect, useState } from 'react';
import { Play, Info, Plus, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { MaturityBadge, StatusDot } from './Badges';
import { cn } from '../utils/cn';

type Props = {
  items: Anime[];
  inMyList: (id: string) => boolean;
  onOpen: (a: Anime) => void;
  onPlay: (a: Anime) => void;
  onToggleList: (a: Anime) => void;
};

export function Hero({ items, inMyList, onOpen, onPlay, onToggleList }: Props) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!current) return null;
  const listed = inMyList(current.id);

  return (
    <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
      {/* Backgrounds (crossfade) */}
      {items.map((a, i) => (
        <div
          key={a.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={i !== index}
        >
          <SmartImage src={a.banner} alt="" rounded="rounded-none" className="h-full w-full" />
        </div>
      ))}

      {/* Gradients for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
      <div className="absolute inset-0 bg-radial-fade opacity-70" />

      {/* Content */}
      <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16 lg:pb-20">
        <div key={current.id} className="animate-fade-up">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white shadow-glow">
              Featured
            </span>
            <StatusDot status={current.status} />
            <span className="text-xs text-ink-300">{current.year}</span>
            <span className="text-ink-500">·</span>
            <span className="text-xs text-ink-300">{current.episodesTotal} episodes</span>
            <span className="text-ink-500">·</span>
            <span className="text-xs text-ink-300">{current.studio}</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl text-balance">
            {current.title}
          </h1>
          {current.romaji && current.romaji !== current.title && (
            <p className="mt-2 font-display text-sm tracking-wide text-ink-300">{current.romaji}</p>
          )}

          <p className="mt-4 max-w-xl text-base text-ink-100 sm:text-lg line-clamp-2">
            {current.tagline}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {current.genres.slice(0, 4).map((g) => (
              <span
                key={g}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-ink-200"
              >
                {g}
              </span>
            ))}
            <span className="ml-1 flex items-center gap-1 text-sm font-semibold text-gold-400">
              <Star size={14} className="fill-gold-400" />
              {current.rating.toFixed(1)}
            </span>
            <MaturityBadge rating={current.maturity} />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(current)}
              className="group/btn flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white shadow-glow transition-all hover:bg-rose-400 hover:shadow-[0_0_50px_-6px_rgba(255,45,85,0.7)]"
            >
              <Play size={20} className="fill-white transition-transform group-hover/btn:scale-110" />
              Play Now
            </button>
            <button
              onClick={() => onOpen(current)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-all hover:border-white/30 hover:bg-white/20"
            >
              <Info size={20} />
              More Info
            </button>
            <button
              onClick={() => onToggleList(current)}
              className={cn(
                'grid h-12 w-12 place-items-center rounded-xl border backdrop-blur transition-all',
                listed
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-400'
                  : 'border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/20'
              )}
              aria-label={listed ? 'Remove from My List' : 'Add to My List'}
            >
              {listed ? <Check size={20} /> : <Plus size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      {items.length > 1 && (
        <>
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-8 bg-rose-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-8 right-6 z-20 hidden items-center gap-1.5 sm:flex">
            <button
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-ink-100 backdrop-blur transition-all hover:border-white/30 hover:bg-ink-800"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-ink-100 backdrop-blur transition-all hover:border-white/30 hover:bg-ink-800"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
