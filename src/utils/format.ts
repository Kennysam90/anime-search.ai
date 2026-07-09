/** Format seconds as m:ss or h:mm:ss */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Format minutes as "24m" or "1h 36m" */
export function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Percent of an episode watched, 0-100 */
export function watchPercent(position: number, duration: number): number {
  if (!duration) return 0;
  return Math.min(100, Math.max(0, (position / duration) * 100));
}

/** Clamp helper */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
