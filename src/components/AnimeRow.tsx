import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { AnimeCard } from './AnimeCard';
import { cn } from '../utils/cn';

type Props = {
  title: string;
  subtitle?: string;
  accent?: string;
  items: Anime[];
  size?: 'sm' | 'md' | 'lg';
  inMyList: (id: string) => boolean;
  progressFor?: (id: string) => number | undefined;
  onOpen: (a: Anime) => void;
  onPlay: (a: Anime) => void;
  onToggleList: (a: Anime) => void;
};

export function AnimeRow({
  title,
  subtitle,
  accent = '#ff2d55',
  items,
  size = 'md',
  inMyList,
  progressFor,
  onOpen,
  onPlay,
  onToggleList,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scroller.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="group/row relative animate-fade-up">
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full" style={{ background: accent }} />
          <div>
            <h2 className="font-display text-lg font-semibold text-white sm:text-xl">{title}</h2>
            {subtitle && <p className="text-xs text-ink-300">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover/row:opacity-100">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canLeft}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-800/80 text-ink-100 backdrop-blur transition-all hover:border-white/25 hover:bg-ink-700',
              !canLeft && 'cursor-not-allowed opacity-30'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canRight}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-800/80 text-ink-100 backdrop-blur transition-all hover:border-white/25 hover:bg-ink-700',
              !canRight && 'cursor-not-allowed opacity-30'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-6"
      >
        {items.map((a) => (
          <AnimeCard
            key={a.id}
            anime={a}
            size={size}
            inMyList={inMyList(a.id)}
            progressPct={progressFor?.(a.id)}
            onOpen={onOpen}
            onPlay={onPlay}
            onToggleList={onToggleList}
          />
        ))}
      </div>
    </section>
  );
}
