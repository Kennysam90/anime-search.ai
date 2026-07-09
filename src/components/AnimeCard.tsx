import { Play, Plus, Check, Star, Info } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { MaturityBadge } from './Badges';
import { cn } from '../utils/cn';

type Props = {
  anime: Anime;
  inMyList: boolean;
  progressPct?: number;
  size?: 'sm' | 'md' | 'lg';
  onOpen: (anime: Anime) => void;
  onPlay: (anime: Anime) => void;
  onToggleList: (anime: Anime) => void;
};

const sizeMap = {
  sm: 'w-36 sm:w-40',
  md: 'w-44 sm:w-52',
  lg: 'w-56 sm:w-64',
} as const;

export function AnimeCard({
  anime,
  inMyList,
  progressPct,
  size = 'md',
  onOpen,
  onPlay,
  onToggleList,
}: Props) {
  return (
    <div className={cn('group/card shrink-0 snap-start', sizeMap[size])}>
      <div className="relative">
        {/* Poster */}
        <button
          onClick={() => onOpen(anime)}
          className="block w-full overflow-hidden rounded-xl border border-white/5 bg-ink-850 shadow-card outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-glow focus-visible:-translate-y-1.5"
          style={{ aspectRatio: '2 / 3' }}
          aria-label={`Open ${anime.title}`}
        >
          <SmartImage src={anime.poster} alt={anime.title} rounded="rounded-xl" className="h-full w-full" />
          {/* gradient + hover content */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent opacity-90" />

          {/* Top badges */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            <div className="flex items-center gap-1.5">
              {anime.isNew && (
                <span className="rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow">
                  New
                </span>
              )}
              <MaturityBadge rating={anime.maturity} />
            </div>
            {anime.trendingRank && (
              <span className="flex items-center gap-0.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-gold-400 backdrop-blur">
                <Star size={10} className="fill-gold-400" />
                {anime.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Bottom title */}
          <div className="absolute inset-x-0 bottom-0 p-3 text-left">
            <p className="font-display text-sm font-semibold leading-tight text-white drop-shadow line-clamp-2">
              {anime.title}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-300">
              {anime.year} &middot; {anime.episodesTotal} eps
            </p>
          </div>

          {/* Hover overlay actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/card:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(anime);
              }}
              className="grid h-11 w-11 place-items-center rounded-full bg-rose-500 text-white shadow-glow transition-transform hover:scale-110"
              aria-label="Play"
            >
              <Play size={18} className="ml-0.5 fill-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleList(anime);
              }}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-full border text-white transition-transform hover:scale-110',
                inMyList
                  ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-400'
                  : 'border-white/20 bg-white/10'
              )}
              aria-label={inMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {inMyList ? <Check size={18} /> : <Plus size={18} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen(anime);
              }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-transform hover:scale-110"
              aria-label="More info"
            >
              <Info size={18} />
            </button>
          </div>
        </button>

        {/* Continue-watching progress bar */}
        {typeof progressPct === 'number' && progressPct > 0 && (
          <div className="absolute -bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-white/10">
            <div
              className="h-full bg-rose-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
