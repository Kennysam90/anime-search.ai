import { cn } from '../utils/cn';

export function MaturityBadge({ rating, className }: { rating: string; className?: string }) {
  const tone =
    rating === '18+'
      ? 'border-rose-500/60 text-rose-300 bg-rose-500/10'
      : rating === '16+'
      ? 'border-gold-500/50 text-gold-400 bg-gold-500/10'
      : rating === '13+'
      ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
      : 'border-ink-400/50 text-ink-200 bg-white/5';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide',
        tone,
        className
      )}
    >
      {rating}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  const color =
    status === 'Ongoing'
      ? 'bg-cyan-400'
      : status === 'Upcoming'
      ? 'bg-gold-400'
      : 'bg-ink-400';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-300">
      <span className={cn('h-1.5 w-1.5 rounded-full', color)} />
      {status}
    </span>
  );
}

export function GenrePill({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-ink-200',
        className
      )}
    >
      {name}
    </span>
  );
}
