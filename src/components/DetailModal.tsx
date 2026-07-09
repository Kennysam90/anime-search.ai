import { useEffect } from 'react';
import { Play, Plus, Check, X, Star, Calendar, Film, Users, Clock, Layers } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { MaturityBadge, StatusDot, GenrePill } from './Badges';
import { formatRuntime } from '../utils/format';
import { cn } from '../utils/cn';

type Props = {
  anime: Anime;
  inMyList: boolean;
  progressEpisode?: number;
  onClose: () => void;
  onPlay: (a: Anime, episode: number) => void;
  onToggleList: (a: Anime) => void;
};

export function DetailModal({
  anime,
  inMyList,
  progressEpisode,
  onClose,
  onPlay,
  onToggleList,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const totalRuntime = formatRuntime(anime.episodesTotal * 24);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/80 p-0 backdrop-blur-md sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 my-0 w-full max-w-4xl animate-scale-in overflow-hidden rounded-none border border-white/10 bg-ink-900 shadow-card sm:my-4 sm:rounded-3xl">
        {/* Hero banner */}
        <div className="relative h-56 w-full sm:h-72">
          <SmartImage src={anime.banner} alt={anime.title} rounded="rounded-none" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink-950/60 text-white backdrop-blur transition-all hover:bg-ink-950/90"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 sm:bottom-6 sm:left-6">
            <SmartImage
              src={anime.poster}
              alt={anime.title}
              rounded="rounded-xl"
              className="hidden h-32 w-24 shrink-0 border border-white/10 shadow-card sm:block"
            />
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
                {anime.title}
              </h2>
              {anime.romaji && anime.romaji !== anime.title && (
                <p className="mt-1 font-display text-sm text-ink-300">{anime.romaji}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-ink-200">
                <StatusDot status={anime.status} />
                <span className="text-ink-500">·</span>
                <span>{anime.year}</span>
                <span className="text-ink-500">·</span>
                <span>{anime.episodesTotal} eps</span>
                <span className="text-ink-500">·</span>
                <MaturityBadge rating={anime.maturity} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
          {/* Action row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(anime, progressEpisode ?? 1)}
              className="group/btn flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white shadow-glow transition-all hover:bg-rose-400"
            >
              <Play size={18} className="fill-white transition-transform group-hover/btn:scale-110" />
              {progressEpisode ? `Resume Ep ${progressEpisode}` : 'Play Ep 1'}
            </button>
            <button
              onClick={() => onToggleList(anime)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold backdrop-blur transition-all',
                inMyList
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-400'
                  : 'border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/20'
              )}
            >
              {inMyList ? <Check size={18} /> : <Plus size={18} />}
              {inMyList ? 'In My List' : 'My List'}
            </button>
            <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <Star size={16} className="fill-gold-400 text-gold-400" />
              <span className="font-display text-lg font-bold text-white">{anime.rating.toFixed(1)}</span>
              <span className="text-xs text-ink-400">/ 10</span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-sm leading-relaxed text-ink-100 sm:text-base line-clamp-4">
            {anime.synopsis}
          </p>

          {/* Genres */}
          <div className="mt-5 flex flex-wrap gap-2">
            {anime.genres.map((g) => (
              <GenrePill key={g} name={g} />
            ))}
          </div>

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Meta icon={Calendar} label="Released" value={String(anime.year)} />
            <Meta icon={Layers} label="Seasons" value={String(anime.seasons)} />
            <Meta icon={Film} label="Episodes" value={String(anime.episodesTotal)} />
            <Meta icon={Clock} label="Total" value={totalRuntime} />
            <Meta icon={Users} label="Studio" value={anime.studio} className="col-span-2 sm:col-span-1" />
            <Meta icon={Star} label="Rating" value={`${anime.rating.toFixed(1)}/10`} className="col-span-2 sm:col-span-1" />
          </div>

          {/* Episode list */}
          <h3 className="mt-8 mb-3 font-display text-lg font-semibold text-white">Episodes</h3>
          <ul className="space-y-2">
            {anime.episodes.map((ep) => {
              const isCurrent = progressEpisode === ep.number;
              return (
                <li key={ep.number}>
                  <button
                    onClick={() => onPlay(anime, ep.number)}
                    className={cn(
                      'group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all',
                      isCurrent
                        ? 'border-rose-500/40 bg-rose-500/10'
                        : 'border-white/5 bg-ink-850 hover:border-white/15 hover:bg-ink-800'
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold',
                        isCurrent ? 'bg-rose-500 text-white' : 'bg-ink-700 text-ink-200'
                      )}
                    >
                      {ep.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{ep.title}</p>
                      <p className="truncate text-xs text-ink-400">{ep.description}</p>
                    </div>
                    <span className="hidden text-xs text-ink-400 sm:block">{ep.duration}m</span>
                    <span
                      className={cn(
                        'grid h-9 w-9 place-items-center rounded-full transition-all',
                        isCurrent
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 text-ink-300 group-hover:bg-rose-500 group-hover:text-white'
                      )}
                    >
                      <Play size={15} className="ml-0.5 fill-current" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-white/5 bg-ink-850 p-3', className)}>
      <div className="flex items-center gap-1.5 text-ink-400">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
