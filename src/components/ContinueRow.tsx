import { Play, X } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { MaturityBadge } from './Badges';
import { formatTime, watchPercent } from '../utils/format';
import type { ProgressEntry } from '../hooks/useLibrary';

type Props = {
  items: { anime: Anime; progress: ProgressEntry }[];
  onPlay: (a: Anime, episode: number) => void;
  onRemove: (animeId: string) => void;
};

/** Wide, landscape continue-watching cards with episode context + progress bar. */
export function ContinueRow({ items, onPlay, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-ink-850/40 py-16 text-center animate-fade-up">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-ink-800 text-ink-400">
          <Play size={20} />
        </div>
        <p className="mt-3 font-display text-lg font-semibold text-white">Nothing in progress</p>
        <p className="mt-1 max-w-sm text-sm text-ink-400">
          Start watching something and it'll show up here so you can pick up right where you left off.
        </p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-1 animate-fade-up">
      {items.map(({ anime, progress }) => {
        const pct = watchPercent(progress.position, progress.duration);
        const ep = anime.episodes.find((e) => e.number === progress.episode);
        return (
          <div
            key={anime.id}
            className="group/cw relative w-72 shrink-0 snap-start sm:w-80"
          >
            <button
              onClick={() => onPlay(anime, progress.episode)}
              className="block w-full overflow-hidden rounded-2xl border border-white/5 bg-ink-850 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-glow"
            >
              <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                <SmartImage src={anime.banner} alt={anime.title} rounded="rounded-none" className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />

                {/* Hover play */}
                <div className="absolute inset-0 grid place-items-center bg-ink-950/40 opacity-0 transition-opacity duration-300 group-hover/cw:opacity-100">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-rose-500 text-white shadow-glow transition-transform group-hover/cw:scale-110">
                    <Play size={24} className="ml-1 fill-white" />
                  </span>
                </div>

                {/* Top-left title */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <MaturityBadge rating={anime.maturity} />
                </div>
                {/* Remove button */}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(anime.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove(anime.id);
                    }
                  }}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ink-950/60 text-ink-200 opacity-0 backdrop-blur transition-all hover:bg-rose-500 hover:text-white group-hover/cw:opacity-100"
                  aria-label="Remove from Continue Watching"
                >
                  <X size={14} />
                </span>
              </div>

              <div className="p-3">
                <p className="truncate font-display text-sm font-semibold text-white">{anime.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink-400">
                  Ep {progress.episode}
                  {ep ? ` · ${ep.title}` : ''} · {formatTime(progress.position)} left
                </p>
                {/* Progress */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-medium tabular-nums text-ink-400">{Math.round(pct)}%</span>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
