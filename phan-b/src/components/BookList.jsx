import BookCard from './BookCard';

export default function BookList({ books, favorites, onFavorite }) {
  return (
    <div className="book-list">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          favorite={favorites.includes(book.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
