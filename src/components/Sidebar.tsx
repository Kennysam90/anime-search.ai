import {
  Home,
  Compass,
  Flame,
  Bookmark,
  Clock,
  Tv,
  Film,
  Sparkles,
  Heart,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { ALL_GENRES } from '../data/catalog';

export type View =
  | { kind: 'home' }
  | { kind: 'browse' }
  | { kind: 'trending' }
  | { kind: 'mylist' }
  | { kind: 'continue' }
  | { kind: 'genre'; genre: string };

type NavItem = {
  key: string;
  label: string;
  icon: typeof Home;
  view: View;
};

const PRIMARY: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home, view: { kind: 'home' } },
  { key: 'browse', label: 'Browse', icon: Compass, view: { kind: 'browse' } },
  { key: 'trending', label: 'Trending', icon: Flame, view: { kind: 'trending' } },
  { key: 'mylist', label: 'My List', icon: Bookmark, view: { kind: 'mylist' } },
  { key: 'continue', label: 'Continue Watching', icon: Clock, view: { kind: 'continue' } },
];

const COLLECTIONS: NavItem[] = [
  { key: 'col-series', label: 'Series', icon: Tv, view: { kind: 'browse' } },
  { key: 'col-movies', label: 'Films', icon: Film, view: { kind: 'browse' } },
  { key: 'col-new', label: 'New & Notable', icon: Sparkles, view: { kind: 'browse' } },
];

function isActive(view: View, item: View): boolean {
  if (view.kind !== item.kind) return false;
  if (view.kind === 'genre' && item.kind === 'genre') return view.genre === item.genre;
  return true;
}

type Props = {
  view: View;
  onNavigate: (v: View) => void;
  myListCount: number;
  continueCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  view,
  onNavigate,
  myListCount,
  continueCount,
  mobileOpen,
  onCloseMobile,
}: Props) {
  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 4v16l7-5 7 5V4"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="leading-none">
            <p className="font-display text-lg font-extrabold tracking-tight text-white">
              Otaku<span className="text-rose-500">Stream</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
              Anime · HD
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-300 hover:bg-ink-800 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-6 no-scrollbar">
        <SectionLabel>Discover</SectionLabel>
        <ul className="space-y-1">
          {PRIMARY.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={isActive(view, item.view)}
              badge={
                item.key === 'mylist'
                  ? myListCount
                  : item.key === 'continue'
                  ? continueCount
                  : undefined
              }
              onClick={() => onNavigate(item.view)}
            />
          ))}
        </ul>

        <SectionLabel className="mt-6">Collections</SectionLabel>
        <ul className="space-y-1">
          {COLLECTIONS.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={isActive(view, item.view)}
              onClick={() => onNavigate(item.view)}
            />
          ))}
        </ul>

        <SectionLabel className="mt-6">Genres</SectionLabel>
        <ul className="space-y-1">
          {ALL_GENRES.slice(0, 10).map((g) => {
            const item: NavItem = {
              key: `genre-${g}`,
              label: g,
              icon: Heart,
              view: { kind: 'genre', genre: g },
            };
            return (
              <NavLink
                key={item.key}
                item={item}
                active={isActive(view, item.view)}
                onClick={() => onNavigate(item.view)}
              />
            );
          })}
        </ul>
      </nav>

      {/* Footer promo card */}
      <div className="m-3 rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/15 via-ink-850 to-ink-850 p-4">
        <p className="font-display text-sm font-semibold text-white">Go Premium</p>
        <p className="mt-1 text-xs text-ink-300">
          4K streaming, no ads, and offline downloads.
        </p>
        <button className="mt-3 w-full rounded-lg bg-rose-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-400">
          Upgrade
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/5 bg-ink-950/95 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-ink-950 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400',
        className
      )}
    >
      {children}
    </p>
  );
}

function NavLink({
  item,
  active,
  badge,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          active
            ? 'bg-rose-500/15 text-white'
            : 'text-ink-300 hover:bg-ink-800 hover:text-white'
        )}
      >
        <Icon
          size={18}
          className={cn(
            'shrink-0 transition-colors',
            active ? 'text-rose-500' : 'text-ink-400 group-hover:text-rose-400'
          )}
        />
        <span className="flex-1 text-left">{item.label}</span>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
        {typeof badge === 'number' && badge > 0 && (
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-ink-100">
            {badge}
          </span>
        )}
      </button>
    </li>
  );
}
