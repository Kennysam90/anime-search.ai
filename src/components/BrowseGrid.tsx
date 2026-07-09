import { useMemo, useState } from 'react';
import { SlidersHorizontal, Grid3x3, LayoutGrid } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { ALL_GENRES } from '../data/catalog';
import { AnimeCard } from './AnimeCard';
import { cn } from '../utils/cn';

type Props = {
  title: string;
  subtitle?: string;
  items: Anime[];
  initialGenre?: string;
  inMyList: (id: string) => boolean;
  progressFor?: (id: string) => number | undefined;
  onOpen: (a: Anime) => void;
  onPlay: (a: Anime) => void;
  onToggleList: (a: Anime) => void;
};

type SortKey = 'rating' | 'year' | 'title' | 'newest';

export function BrowseGrid({
  title,
  subtitle,
  items,
  initialGenre,
  inMyList,
  progressFor,
  onOpen,
  onPlay,
  onToggleList,
}: Props) {
  const [genre, setGenre] = useState<string>(initialGenre ?? 'All');
  const [sort, setSort] = useState<SortKey>('rating');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const filtered = useMemo(() => {
    let list = items;
    if (genre !== 'All') list = list.filter((a) => a.genres.includes(genre));
    const sorted = [...list];
    switch (sort) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'year':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.year - a.year);
        break;
    }
    return sorted;
  }, [items, genre, sort]);

  return (
    <section className="animate-fade-up">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-300">{subtitle}</p>}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/5 bg-ink-850/60 p-3 sm:flex-row sm:items-center">
        {/* Genre chips */}
        <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
          <Chip active={genre === 'All'} onClick={() => setGenre('All')}>
            All
          </Chip>
          {ALL_GENRES.map((g) => (
            <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>
              {g}
            </Chip>
          ))}
        </div>

        {/* Sort + density */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-ink-800 px-2.5 py-1.5">
            <SlidersHorizontal size={14} className="text-ink-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none"
            >
              <option value="rating" className="bg-ink-850">Top Rated</option>
              <option value="year" className="bg-ink-850">Newest First</option>
              <option value="newest" className="bg-ink-850">New Releases</option>
              <option value="title" className="bg-ink-850">A → Z</option>
            </select>
          </div>
          <div className="flex items-center rounded-xl border border-white/10 bg-ink-800 p-0.5">
            <button
              onClick={() => setDensity('comfortable')}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-lg transition-colors',
                density === 'comfortable' ? 'bg-rose-500 text-white' : 'text-ink-300 hover:text-white'
              )}
              aria-label="Comfortable layout"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-lg transition-colors',
                density === 'compact' ? 'bg-rose-500 text-white' : 'text-ink-300 hover:text-white'
              )}
              aria-label="Compact layout"
            >
              <Grid3x3 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-ink-850/40 py-20 text-center">
          <p className="font-display text-lg font-semibold text-white">Nothing here yet</p>
          <p className="mt-1 text-sm text-ink-400">Try a different genre or check back soon.</p>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            density === 'comfortable'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'
          )}
        >
          {filtered.map((a) => (
            <AnimeCard
              key={a.id}
              anime={a}
              size={density === 'compact' ? 'sm' : 'md'}
              inMyList={inMyList(a.id)}
              progressPct={progressFor?.(a.id)}
              onOpen={onOpen}
              onPlay={onPlay}
              onToggleList={onToggleList}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
        active
          ? 'bg-rose-500 text-white shadow-glow'
          : 'border border-white/10 bg-ink-800 text-ink-200 hover:border-white/25 hover:text-white'
      )}
    >
      {children}
    </button>
  );
}
