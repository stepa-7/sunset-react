// Music API
export class MusicAPI {
  async searchTracks(query: string) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicTrack&country=US`
      );

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return this.getDemoTracks(query);
      }

      return data.results.map((track: any) => ({
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName || 'Неизвестный альбом',
        image: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '250x250bb') : this.getDefaultImage(),
        preview: track.previewUrl
      }));
    } catch (error) {
      console.error('Music API error:', error);
      return this.getDemoTracks(query);
    }
  }

  async getTopTracks() {
    try {
      const popularQueries = ['pop', 'rock', 'hip hop', 'electronic', 'r&b', 'dance'];
      const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];

      const response = await fetch(
        `https://itunes.apple.com/search?term=${randomQuery}&entity=musicTrack&country=US`
      );

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return this.getDemoTopTracks();
      }

      return data.results.map((track: any) => ({
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName || 'Неизвестный альбом',
        image: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '250x250bb') : this.getDefaultImage(),
        preview: track.previewUrl
      }));
    } catch (error) {
      console.error('Top tracks error:', error);
      return this.getDemoTopTracks();
    }
  }

  getDefaultImage() {
    return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=250&h=250&fit=crop';
  }

  getDemoTracks(query: string) {
    const allTracks = this.getDemoTopTracks();
    const filtered = allTracks.filter(track =>
      track.name.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.length > 0 ? filtered : allTracks.slice(0, 4);
  }

  getDemoTopTracks() {
    return [
      {
        name: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d1/3d/33/d13d33a9-91c9-d555-7b71-241ac2cb0a0a/20UMGIM53933.rgb.jpg/250x250bb.jpg",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/50/5c/32/505c32a1-04e5-8f6f-8676-6e4c24c0a837/mzaf_13346412281003489284.plus.aac.p.m4a"
      },
      {
        name: "Flowers",
        artist: "Miley Cyrus",
        album: "Endless Summer Vacation",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/60/0a/6c/600a6c87-ecd7-5e1b-5b13-7e8c4d811d41/23UMGIM89099.rgb.jpg/250x250bb.jpg",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5e/4b/3c/5e4b3c9c-7d8b-8c8c-7b4f-7e9e4b3c9c7d/mzaf_13346412281003489284.plus.aac.p.m4a"
      }
    ];
  }
}

// Books API
export class BooksAPI {
  async searchBooks(query: string) {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&printType=books`);

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map((item: any) => {
        const volumeInfo = item.volumeInfo;
        return {
          title: volumeInfo.title || 'Название неизвестно',
          author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Автор неизвестен',
          year: volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : 'Год неизвестен',
          description: volumeInfo.description ?
            volumeInfo.description.substring(0, 120) + '...' :
            'Описание отсутствует',
          image: volumeInfo.imageLinks ?
            volumeInfo.imageLinks.thumbnail :
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=128&h=168&fit=crop',
          preview: volumeInfo.previewLink || null,
          info: volumeInfo.infoLink || null
        };
      });
    } catch (error) {
      console.error('Books API error:', error);
      throw new Error('Не удалось найти книги');
    }
  }
}

// Currency API
export async function fetchRates(base = 'USD') {
  const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
  if (!response.ok) throw new Error('Ошибка при загрузке курсов');
  const data = await response.json();
  if (data.result !== 'success') throw new Error('Ошибка API');
  return data.rates;
}

// Audio Manager
export class AudioManager {
  currentAudio: HTMLAudioElement | null = null;
  currentPlayingButton: HTMLButtonElement | null = null;

  playAudio(previewUrl: string, button: HTMLButtonElement) {
    if (this.currentPlayingButton === button && this.currentAudio) {
      if (this.currentAudio.paused) {
        this.currentAudio.play();
        button.innerHTML = '⏸';
        button.classList.add('playing');
      } else {
        this.currentAudio.pause();
        button.innerHTML = '▶';
        button.classList.remove('playing');
      }
      return;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      if (this.currentPlayingButton) {
        this.currentPlayingButton.innerHTML = '▶';
        this.currentPlayingButton.classList.remove('playing');
      }
    }

    if (!previewUrl) {
      button.style.opacity = '0.5';
      return;
    }

    try {
      this.currentAudio = new Audio(previewUrl);
      this.currentPlayingButton = button;

      button.innerHTML = '⏸';
      button.classList.add('playing');

      this.currentAudio.play();

      this.currentAudio.onended = () => this.onAudioEnded();
      this.currentAudio.onerror = () => this.onAudioError();
    } catch (error) {
      console.error('Audio error:', error);
      this.onAudioError();
    }
  }

  onAudioEnded() {
    if (this.currentPlayingButton) {
      this.currentPlayingButton.innerHTML = '▶';
      this.currentPlayingButton.classList.remove('playing');
    }
    this.currentAudio = null;
    this.currentPlayingButton = null;
  }

  onAudioError() {
    if (this.currentPlayingButton) {
      this.currentPlayingButton.innerHTML = '▶';
      this.currentPlayingButton.classList.remove('playing');
      this.currentPlayingButton.style.opacity = '0.5';
    }
    this.currentAudio = null;
    this.currentPlayingButton = null;
  }
}
