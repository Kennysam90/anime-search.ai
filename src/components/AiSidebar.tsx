import { Bookmark, X, Crown, Sparkles, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { cn } from '../utils/cn';

type Props = {
  myList: Anime[];
  onRemove: (id: string) => void;
  onOpenAnime: (a: Anime) => void;
  onClearAll: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onCollapsedChange: (c: boolean) => void;
};

export function AiSidebar({
  myList,
  onRemove,
  onOpenAnime,
  onClearAll,
  mobileOpen,
  onCloseMobile,
  collapsed,
  onCollapsedChange,
}: Props) {

  const content = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={cn('flex items-center px-3 pt-5', isCollapsed ? 'justify-center' : 'justify-between px-5')}>
        <div className={cn('flex items-center gap-2.5', isCollapsed && 'gap-0')}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="leading-none">
              <p className="font-display text-lg font-extrabold tracking-tight text-white">
                Otaku<span className="text-rose-500">AI</span>
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
                Anime discovery
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onCloseMobile}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-300 hover:bg-ink-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* My List label */}
      {!isCollapsed && (
        <div className="mt-5 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Bookmark size={15} className="text-rose-500" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              My List
            </p>
          </div>
          {myList.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-[10px] font-medium text-ink-500 transition-colors hover:text-rose-400"
              aria-label="Clear all"
            >
              <Trash2 size={11} />
              Clear
            </button>
          )}
        </div>
      )}
      {isCollapsed && (
        <div className="mt-5 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-semibold text-ink-300">
            <Bookmark size={10} className="text-rose-500" />
            {myList.length}
          </div>
        </div>
      )}

      <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        {myList.length === 0 ? (
          <EmptyState collapsed={isCollapsed} />
        ) : (
          <ul className="space-y-1.5">
            {myList.map((a) => (
              <li key={a.id} className="group/item">
                {isCollapsed ? (
                  <button
                    onClick={() => onOpenAnime(a)}
                    className="relative block w-full overflow-hidden rounded-lg transition-transform hover:scale-105"
                    title={a.title}
                    aria-label={a.title}
                  >
                    <SmartImage
                      src={a.poster}
                      alt={a.title}
                      rounded="rounded-lg"
                      className="aspect-[2/3] w-full"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-1">
                      <span className="block truncate text-[9px] font-semibold text-white">{a.title}</span>
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 transition-colors hover:bg-ink-800">
                    <button
                      onClick={() => onOpenAnime(a)}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <SmartImage
                        src={a.poster}
                        alt={a.title}
                        rounded="rounded-lg"
                        className="h-12 w-9 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{a.title}</p>
                        <p className="truncate text-[10px] text-ink-400">
                          {a.year} · {a.episodesTotal} eps
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => onRemove(a.id)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink-500 opacity-0 transition-all hover:bg-rose-500/15 hover:text-rose-400 group-hover/item:opacity-100"
                      aria-label={`Remove ${a.title}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Upgrade card / button */}
      {isCollapsed ? (
        <div className="m-3">
          <button
            onClick={() => onCollapsedChange(false)}
            className="grid h-11 w-full place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-[0_0_24px_-6px_rgba(255,213,107,0.6)] transition-transform hover:scale-105"
            title="Go Premium"
            aria-label="Go Premium"
          >
            <Crown size={18} />
          </button>
        </div>
      ) : (
        <div className="m-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/15 via-ink-850 to-ink-850 p-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-[0_0_24px_-6px_rgba(255,213,107,0.6)]">
              <Crown size={16} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white">Go Premium</p>
              <p className="text-[10px] font-medium text-gold-400">From $9.99/mo</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {['4K HDR streaming', 'No ads, ever', 'Offline downloads', 'AI recommendations'].map(
              (feat) => (
                <li key={feat} className="flex items-center gap-2 text-[11px] text-ink-200">
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feat}
                </li>
              )
            )}
          </ul>
          <button className="mt-3.5 w-full rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 py-2 text-xs font-bold text-ink-950 transition-all hover:from-gold-500 hover:to-gold-600 hover:shadow-[0_0_24px_-6px_rgba(255,213,107,0.7)]">
            Upgrade now
          </button>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      <div className="hidden border-t border-white/5 p-2 lg:block">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-400 transition-all hover:bg-ink-800 hover:text-white',
            isCollapsed && 'justify-center'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} className="mr-auto" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — width animates with collapse state */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-white/5 bg-ink-950/95 transition-[width] duration-300 ease-in-out lg:block',
          collapsed ? 'w-20' : 'w-72'
        )}
      >
        {content(collapsed)}
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
          {content(false)}
        </aside>
      </div>
    </>
  );
}

function EmptyState({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="mx-1 mt-2 grid place-items-center rounded-xl border border-dashed border-white/10 bg-ink-850/40 py-6">
        <Bookmark size={18} className="text-ink-600" />
      </div>
    );
  }
  return (
    <div className="mx-2 mt-2 rounded-2xl border border-dashed border-white/10 bg-ink-850/40 p-5 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-ink-500">
        <Bookmark size={18} />
      </div>
      <p className="mt-2.5 text-xs font-medium text-ink-300">No saved anime yet</p>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
        Tap the bookmark on any result to pin it here for later.
      </p>
    </div>
  );
}
