import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Maximize,
  Minimize,
  X,
  Settings,
  Rewind,
  FastForward,
} from 'lucide-react';
import type { Anime, Episode } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { formatTime, clamp } from '../utils/format';
import { cn } from '../utils/cn';

type Props = {
  anime: Anime;
  episode: number;
  startPosition?: number;
  onClose: () => void;
  onProgress: (position: number, duration: number, episode: number) => void;
  onEpisodeChange: (episode: number) => void;
};

const EPISODE_DURATION = 24 * 60; // 24 minutes simulated

export function PlayerModal({
  anime,
  episode,
  startPosition = 0,
  onClose,
  onProgress,
  onEpisodeChange,
}: Props) {
  const current: Episode =
    anime.episodes.find((e) => e.number === episode) ?? anime.episodes[0];

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [position, setPosition] = useState(startPosition);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState<'4K' | '1080p' | '720p'>('1080p');
  const [speed, setSpeed] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);
  const lastReport = useRef(0);

  const duration = EPISODE_DURATION;

  // Simulated playback clock
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPosition((p) => {
        const next = p + speed;
        if (next >= duration) {
          // auto-advance to next episode if available
          const hasNext = anime.episodes.some((e) => e.number === episode + 1);
          if (hasNext) {
            onEpisodeChange(episode + 1);
            return 0;
          }
          setPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, speed, duration, episode, anime.episodes, onEpisodeChange]);

  // Report progress to library (throttled)
  useEffect(() => {
    if (position - lastReport.current > 4 || position === 0) {
      lastReport.current = position;
      onProgress(position, duration, episode);
    }
  }, [position, duration, episode, onProgress]);

  // Reset position when episode changes
  useEffect(() => {
    setPosition(0);
    setPlaying(true);
    lastReport.current = 0;
  }, [episode]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case 'ArrowLeft':
          setPosition((p) => clamp(p - 10, 0, duration));
          break;
        case 'ArrowRight':
          setPosition((p) => clamp(p + 10, 0, duration));
          break;
        case 'j':
          setPosition((p) => clamp(p - 10, 0, duration));
          break;
        case 'l':
          setPosition((p) => clamp(p + 10, 0, duration));
          break;
        case 'm':
          setMuted((m) => !m);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          if (!document.fullscreenElement) onClose();
          break;
      }
      poke();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onClose]);

  // Fullscreen sync
  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);

  const poke = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    poke();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [poke]);

  const seek = (pct: number) => {
    setPosition(clamp(pct * duration, 0, duration));
    poke();
  };

  const skip = (dir: 1 | -1) => {
    setPosition((p) => clamp(p + dir * 10, 0, duration));
    poke();
  };

  const changeEpisode = (dir: 1 | -1) => {
    const next = episode + dir;
    if (anime.episodes.some((e) => e.number === next)) onEpisodeChange(next);
  };

  const pct = (position / duration) * 100;
  const progressGradient = `linear-gradient(to right, #ff2d55 ${pct}%, rgba(255,255,255,0.22) ${pct}%)`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] bg-black animate-fade-in"
      onMouseMove={poke}
      onClick={poke}
    >
      {/* "Video" stage: animated banner as faux footage */}
      <div className="absolute inset-0">
        <SmartImage src={anime.banner} alt="" rounded="rounded-none" className="h-full w-full scale-105" />
        <div className="absolute inset-0 bg-black/40" />
        {/* subtle vignette + film grain feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Center play indicator when paused */}
      {!playing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(true);
            poke();
          }}
          className="absolute inset-0 z-10 grid place-items-center"
          aria-label="Play"
        >
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-rose-500/90 shadow-glow">
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-pulse-ring" />
            <Play size={32} className="ml-1 fill-white text-white" />
          </span>
        </button>
      )}

      {/* Top bar */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 sm:p-6',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-all hover:bg-black/80"
          aria-label="Close player"
        >
          <X size={20} />
        </button>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-white sm:text-base">
            {anime.title}
          </p>
          <p className="truncate text-xs text-ink-300">
            Episode {current.number} · {current.title}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:px-6 sm:pb-6',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrub bar */}
        <div className="group/scrub mb-3 flex items-center gap-3">
          <span className="w-12 text-right text-xs font-medium tabular-nums text-ink-200">
            {formatTime(position)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={pct}
              onChange={(e) => seek(Number(e.target.value))}
              className="os-range w-full"
              style={{ background: progressGradient }}
              aria-label="Seek"
            />
          </div>
          <span className="w-12 text-xs font-medium tabular-nums text-ink-200">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => changeEpisode(-1)}
            disabled={!anime.episodes.some((e) => e.number === episode - 1)}
            className="ctrl-btn disabled:opacity-30"
            aria-label="Previous episode"
            title="Previous episode"
          >
            <SkipBack size={18} />
          </button>
          <button onClick={() => skip(-1)} className="ctrl-btn" aria-label="Rewind 10s" title="Rewind 10s (J)">
            <Rewind size={18} />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink-950 transition-all hover:scale-105"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-0.5 fill-current" />}
          </button>
          <button onClick={() => skip(1)} className="ctrl-btn" aria-label="Forward 10s" title="Forward 10s (L)">
            <FastForward size={18} />
          </button>
          <button
            onClick={() => changeEpisode(1)}
            disabled={!anime.episodes.some((e) => e.number === episode + 1)}
            className="ctrl-btn disabled:opacity-30"
            aria-label="Next episode"
            title="Next episode"
          >
            <SkipForward size={18} />
          </button>

          {/* Volume */}
          <div className="group/vol ml-1 flex items-center gap-1.5">
            <button
              onClick={() => setMuted((m) => !m)}
              className="ctrl-btn"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                setMuted(v === 0);
              }}
              className="os-range hidden w-20 transition-all group-hover/vol:block sm:block"
              style={{
                background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.22) ${(muted ? 0 : volume) * 100}%)`,
              }}
              aria-label="Volume"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings((s) => !s)}
                className={cn('ctrl-btn', showSettings && 'text-rose-500')}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="absolute bottom-12 right-0 w-44 rounded-xl border border-white/10 bg-ink-900/95 p-2 shadow-card backdrop-blur-xl animate-slide-down">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    Quality
                  </p>
                  <div className="mb-2 flex gap-1">
                    {(['4K', '1080p', '720p'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={cn(
                          'flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                          quality === q ? 'bg-rose-500 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    Speed
                  </p>
                  <div className="flex gap-1">
                    {[0.5, 1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={cn(
                          'flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                          speed === s ? 'bg-rose-500 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="ctrl-btn" aria-label="Fullscreen" title="Fullscreen (F)">
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Local style for control buttons */}
      <style>{`
        .ctrl-btn {
          display: grid;
          place-items: center;
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 0.75rem;
          color: #d6d6e6;
          transition: all 0.2s;
        }
        .ctrl-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
