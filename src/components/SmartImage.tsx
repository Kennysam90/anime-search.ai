import { useState } from 'react';
import { cn } from '../utils/cn';

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** rounded corner radius class, e.g. 'rounded-xl' */
  rounded?: string;
};

/** Image with a shimmer placeholder while loading and a graceful fallback. */
export function SmartImage({ src, alt, className, rounded = 'rounded-xl' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-ink-850', rounded, className)}>
      {!loaded && !errored && (
        <div
          className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#14141f,#1a1a28,#14141f)] bg-[length:1000px_100%]"
          aria-hidden
        />
      )}
      {errored ? (
        <div className="absolute inset-0 grid place-items-center bg-ink-850 text-ink-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 16l4.5-4.5 3 3L15 11l5 5M4 5h16v14H4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-700',
            loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md'
          )}
        />
      )}
    </div>
  );
}
