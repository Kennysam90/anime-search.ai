import { useCallback, useMemo, useState } from 'react';
import { DetailModal } from './components/DetailModal';
import { PlayerModal } from './components/PlayerModal';
import { AiSearch } from './components/AiSearch';
import { getAnime, type Anime } from './data/catalog';
import { useLibrary, type ProgressEntry } from './hooks/useLibrary';

export default function App() {
  const [detail, setDetail] = useState<Anime | null>(null);
  const [player, setPlayer] = useState<{ anime: Anime; episode: number } | null>(null);

  const { inMyList, toggleMyList, setProgress, getProgress, myListIds } = useLibrary();

  const openPlayer = useCallback((anime: Anime, episode: number) => {
    setPlayer({ anime, episode });
    setDetail(null);
  }, []);

  const playFromCard = useCallback(
    (anime: Anime) => {
      const p = getProgress(anime.id);
      openPlayer(anime, p?.episode ?? 1);
    },
    [getProgress, openPlayer]
  );

  const handleProgress = useCallback(
    (position: number, duration: number, episode: number) => {
      if (!player) return;
      const entry: ProgressEntry = {
        animeId: player.anime.id,
        episode,
        position,
        duration,
        updatedAt: Date.now(),
      };
      setProgress(entry);
    },
    [player, setProgress]
  );

  const handleToggleList = useCallback(
    (anime: Anime) => toggleMyList(anime.id),
    [toggleMyList]
  );

  const myListItems = useMemo(
    () => myListIds.map((id) => getAnime(id)).filter(Boolean) as Anime[],
    [myListIds]
  );

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <AiSearch
        onOpenAnime={setDetail}
        onPlay={playFromCard}
        onToggleList={handleToggleList}
        onRemoveFromList={(id) => toggleMyList(id)}
        onClearList={() => myListIds.forEach((id) => toggleMyList(id))}
        inMyList={inMyList}
        myList={myListItems}
      />

      {detail && (
        <DetailModal
          anime={detail}
          inMyList={inMyList(detail.id)}
          progressEpisode={getProgress(detail.id)?.episode}
          onClose={() => setDetail(null)}
          onPlay={openPlayer}
          onToggleList={handleToggleList}
        />
      )}

      {player && (
        <PlayerModal
          anime={player.anime}
          episode={player.episode}
          startPosition={
            getProgress(player.anime.id)?.episode === player.episode
              ? getProgress(player.anime.id)?.position
              : 0
          }
          onClose={() => setPlayer(null)}
          onProgress={handleProgress}
          onEpisodeChange={(ep) => setPlayer((p) => (p ? { ...p, episode: ep } : p))}
        />
      )}
    </div>
  );
}
