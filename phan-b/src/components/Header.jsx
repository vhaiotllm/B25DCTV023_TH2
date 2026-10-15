export default function Header({ favoriteCount, onToggleTheme }) {
  return (
    <header>
      <div>
        <h1>Thư viện lớp</h1>
        <p>Yêu thích: <strong>{favoriteCount}</strong></p>
      </div>
      <button onClick={onToggleTheme}>Sáng / Tối</button>
    </header>
  );
}
