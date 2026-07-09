import { useCallback, useEffect, useState } from 'react';

/**
 * Persisted state backed by localStorage with cross-tab sync.
 * Used for My List and Continue Watching progress.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [key, state]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [state, setState] as const;
}

export type ProgressEntry = {
  animeId: string;
  episode: number;
  position: number; // seconds
  duration: number; // seconds
  updatedAt: number;
};

export type LibraryState = {
  myList: string[]; // anime ids
  progress: Record<string, ProgressEntry>;
};

const LIBRARY_KEY = 'otakustream:library:v1';
const EMPTY: LibraryState = { myList: [], progress: {} };

export function useLibrary() {
  const [state, setState] = usePersistentState<LibraryState>(LIBRARY_KEY, EMPTY);

  const toggleMyList = useCallback(
    (animeId: string) => {
      setState((s) => ({
        ...s,
        myList: s.myList.includes(animeId)
          ? s.myList.filter((id) => id !== animeId)
          : [animeId, ...s.myList],
      }));
    },
    [setState]
  );

  const setProgress = useCallback(
    (entry: ProgressEntry) => {
      setState((s) => ({
        ...s,
        progress: { ...s.progress, [entry.animeId]: entry },
      }));
    },
    [setState]
  );

  const clearProgress = useCallback(
    (animeId: string) => {
      setState((s) => {
        const next = { ...s.progress };
        delete next[animeId];
        return { ...s, progress: next };
      });
    },
    [setState]
  );

  const inMyList = useCallback(
    (animeId: string) => state.myList.includes(animeId),
    [state.myList]
  );

  const getProgress = useCallback(
    (animeId: string) => state.progress[animeId],
    [state.progress]
  );

  return {
    state,
    toggleMyList,
    setProgress,
    clearProgress,
    inMyList,
    getProgress,
    myListIds: state.myList,
    progressMap: state.progress,
  };
}
