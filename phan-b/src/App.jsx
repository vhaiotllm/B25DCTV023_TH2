import { useState } from 'react';
import { books } from './data/books';
import Header from './components/Header';
import Section from './components/Section';
import GenreFilter from './components/GenreFilter';
import BookList from './components/BookList';
import Footer from './components/Footer';
import './style.css';

export default function App() {
  const [genre, setGenre] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [dark, setDark] = useState(false);

  const genres = [...new Set(books.map(book => book.genre))];
  const filteredBooks = genre === 'all'
    ? books
    : books.filter(book => book.genre === genre);

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Header
        favoriteCount={favorites.length}
        onToggleTheme={() => setDark(!dark)}
      />

      <main>
        <Section title="Lọc theo thể loại">
          <GenreFilter
            genres={genres}
            selected={genre}
            onChange={setGenre}
          />
        </Section>

        <Section title="Danh sách sách">
          <p>Đang hiển thị {filteredBooks.length} / {books.length} cuốn</p>
          <BookList
            books={filteredBooks}
            favorites={favorites}
            onFavorite={toggleFavorite}
          />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
