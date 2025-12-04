import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { BooksAPI } from '@/lib/apis';

interface Book {
  title: string;
  author: string;
  year: string;
  description: string;
  image: string;
  preview: string | null;
  info: string | null;
}

export default function Books() {
  const [searchInput, setSearchInput] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Используйте поиск чтобы найти книги');
  const booksAPIRef = new BooksAPI();

  useEffect(() => {
    const loadInitialBooks = async () => {
      try {
        const initialBooks = await booksAPIRef.searchBooks('Музыка');
        if (initialBooks.length > 0) {
          setBooks(initialBooks.slice(0, 20));
          setMessage('Популярные книги о программировании');
        }
      } catch (error) {
        console.error('Error loading initial books:', error);
      }
    };

    loadInitialBooks();
  }, []);

  const performSearch = async () => {
    const query = searchInput.trim();

    if (!query) {
      setMessage('Введите поисковый запрос');
      setBooks([]);
      return;
    }

    setLoading(true);
    setMessage('Поиск книг...');

    try {
      const results = await booksAPIRef.searchBooks(query);

      if (results.length === 0) {
        setMessage('Книги не найдены. Попробуйте другой запрос');
        setBooks([]);
      } else {
        setBooks(results);
        setMessage('Найдено');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Ошибка при поиске книг');
      setBooks([]);
    } finally {
      setLoading(false);
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
          <h1>📚 Книги</h1>
          <p>Найдите интересные книги для чтения</p>
        </div>

        <section className="spotify-widget">
          <h2>Поиск книг</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Введите название книги или автора..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn" onClick={performSearch} disabled={loading}>
              Поиск
            </button>
          </div>

          <div id="books-results" className="playlist-container">
            {books.length === 0 ? (
              <div className="loading">{message}</div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#4a5568', fontSize: '0.9rem' }}>
                  📚 {message} {books.length} книг
                </div>
                <div className="books-container">
                  {books.map((book, index) => (
                    <div key={index} className="book-row">
                      <div className="book-number">{index + 1}</div>
                      <img src={book.image} alt={book.title} className="book-image" />
                      <div className="book-title" title={book.title}>
                        {book.title}
                      </div>
                      <div className="book-author" title={book.author}>
                        {book.author}
                      </div>
                      <div className="book-year">{book.year}</div>
                      <div className="book-actions">
                        {book.preview ? (
                          <a href={book.preview} target="_blank" rel="noopener noreferrer" className="preview-button">
                            📖 Читать
                          </a>
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
