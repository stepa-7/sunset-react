import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import { MusicAPI, AudioManager } from '@/lib/apis';

interface Track {
  name: string;
  artist: string;
  album: string;
  image: string;
  preview: string | null;
}

export default function Music() {
  const [searchInput, setSearchInput] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Используйте поиск чтобы найти музыку');
  const musicAPIRef = useRef(new MusicAPI());
  const audioManagerRef = useRef(new AudioManager());
  const playButtonsRef = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const loadTopTracks = async () => {
      try {
        const topTracks = await musicAPIRef.current.getTopTracks();
        if (topTracks.length > 0) {
          setTracks(topTracks);
          setMessage('Популярные');
        }
      } catch (error) {
        console.error('Error loading top tracks:', error);
      }
    };

    loadTopTracks();
  }, []);

  const performSearch = async () => {
    const query = searchInput.trim();

    if (!query) {
      setMessage('Введите название трека или артиста');
      return;
    }

    setLoading(true);
    setMessage('Поиск музыки в iTunes...');

    try {
      const results = await musicAPIRef.current.searchTracks(query);

      if (results.length === 0) {
        setMessage('Музыка не найдена. Попробуйте другой запрос');
        setTracks([]);
      } else {
        setTracks(results);
        setMessage('Найдено');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Ошибка при поиске музыки');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = (index: number, track: Track) => {
    const button = playButtonsRef.current.get(index);
    if (button && track.preview) {
      audioManagerRef.current.playAudio(track.preview, button);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div id="app">
      <Navigation />
      <main>
        <div className="hero">
          <h1>🎵 Музыкальный раздел</h1>
          <p>Откройте для себя новую музыку</p>
        </div>

        <section className="spotify-widget">
          <h2>Поиск музыки</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Введите название трека или артиста..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn" onClick={performSearch} disabled={loading}>
              Поиск
            </button>
          </div>

          <div id="music-results" className="playlist-container">
            {tracks.length === 0 ? (
              <div className="loading">{message}</div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#4a5568', fontSize: '0.9rem' }}>
                  🎵 {message} {tracks.length} треков
                </div>
                <div className="playlist-container">
                  {tracks.map((track, index) => (
                    <div key={index} className="track-row">
                      <div className="track-number">{index + 1}</div>
                      <img src={track.image} alt={track.album} className="track-image" />
                      <div className="track-name" title={track.name}>
                        {track.name}
                      </div>
                      <div className="track-artist" title={track.artist}>
                        {track.artist}
                      </div>
                      <div className="track-album" title={track.album}>
                        {track.album}
                      </div>
                      <div className="track-preview">
                        {track.preview ? (
                          <button
                            className="play-button"
                            ref={(el) => {
                              if (el) playButtonsRef.current.set(index, el);
                            }}
                            onClick={() => handlePlayClick(index, track)}
                          >
                            ▶
                          </button>
                        ) : (
                          <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
