import { useEffect, useRef, useState } from 'react';
import { Search, Menu, Bell, Cast, X, Sparkles } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { searchCatalog } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { cn } from '../utils/cn';

type Props = {
  onMenu: () => void;
  onOpenAnime: (a: Anime) => void;
  onOpenAiSearch: () => void;
};

export function TopBar({ onMenu, onOpenAnime, onOpenAiSearch }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Anime[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchCatalog(query));
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const showDropdown = focused && query.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 glass">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-200 hover:bg-ink-800 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div ref={boxRef} className="relative w-full max-w-xl">
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all',
              focused
                ? 'border-rose-500/50 bg-ink-850 shadow-glow'
                : 'border-white/10 bg-ink-850/70 hover:border-white/20'
            )}
          >
            <Search size={18} className={focused ? 'text-rose-500' : 'text-ink-400'} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search anime, studios, genres…"
              className="w-full bg-transparent text-sm text-white placeholder:text-ink-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setFocused(false);
                }}
                className="text-ink-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-400 sm:block">
              /
            </kbd>
          </div>

          {/* Dropdown results */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-xl animate-slide-down">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-ink-400">
                  No matches for <span className="text-white">“{query}”</span>
                </div>
              ) : (
                <ul className="max-h-[60vh] overflow-y-auto p-2">
                  {results.map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => {
                          onOpenAnime(a);
                          setQuery('');
                          setFocused(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-ink-800"
                      >
                        <SmartImage
                          src={a.poster}
                          alt={a.title}
                          rounded="rounded-lg"
                          className="h-14 w-10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{a.title}</p>
                          <p className="truncate text-xs text-ink-400">
                            {a.year} · {a.studio} · {a.genres.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-gold-400">
                          {a.rating.toFixed(1)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onOpenAiSearch}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:from-rose-400 hover:to-rose-500"
            aria-label="AI search"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">AI Search</span>
          </button>
          <button
            className="hidden h-10 w-10 place-items-center rounded-xl text-ink-300 hover:bg-ink-800 hover:text-white sm:grid"
            aria-label="Cast"
          >
            <Cast size={18} />
          </button>
          <button
            className="relative h-10 w-10 place-items-center rounded-xl text-ink-300 hover:bg-ink-800 hover:text-white grid"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-ink-900" />
          </button>
          <button className="ml-1 flex items-center gap-2 rounded-full border border-white/10 bg-ink-850 py-1 pl-1 pr-3 transition-all hover:border-white/25">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-xs font-bold text-white">
              OS
            </span>
            <span className="hidden text-sm font-medium text-white sm:block">Guest</span>
          </button>
        </div>
      </div>
    </header>
  );
}
