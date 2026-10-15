export default function BookCard({ book, favorite, onFavorite }) {
  return (
    <article className="book-card">
      <h3>{book.title}</h3>
      <p>Tác giả: {book.author}</p>
      <p>Thể loại: {book.genre}</p>
      <p>Năm: {book.year}</p>
      <button onClick={() => onFavorite(book.id)}>
        {favorite ? '★ Đã thích' : '☆ Yêu thích'}
      </button>
    </article>
  );
}
