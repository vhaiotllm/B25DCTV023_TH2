export default function GenreFilter({ genres, selected, onChange }) {
  return (
    <div className="filters">
      <button
        className={selected === 'all' ? 'active' : ''}
        onClick={() => onChange('all')}
      >
        Tất cả
      </button>

      {genres.map(genre => (
        <button
          key={genre}
          className={selected === genre ? 'active' : ''}
          onClick={() => onChange(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
