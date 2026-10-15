import { addBook, deleteBook, getBooks } from './api';
import { getDarkMode, getFavorites, saveDarkMode, saveFavorites } from './storage';
import type { Book } from './types';
import './style.css';

const list = document.querySelector('#book-list') as HTMLDivElement;
const searchInput = document.querySelector('#search') as HTMLInputElement;
const genreFilter = document.querySelector('#genre-filter') as HTMLSelectElement;
const statusText = document.querySelector('#status') as HTMLParagraphElement;
const favoriteCount = document.querySelector('#favorite-count') as HTMLElement;
const form = document.querySelector('#book-form') as HTMLFormElement;
const titleInput = document.querySelector('#title') as HTMLInputElement;
const authorInput = document.querySelector('#author') as HTMLInputElement;
const bookGenre = document.querySelector('#book-genre') as HTMLSelectElement;
const yearInput = document.querySelector('#year') as HTMLInputElement;
const themeBtn = document.querySelector('#theme-btn') as HTMLButtonElement;

let books: Book[] = [];
let favorites: string[] = getFavorites();
let darkMode = getDarkMode();

function setText(element: HTMLElement, text: string) {
  element.textContent = text;
}

function updateFavoriteCount() {
  favoriteCount.textContent = String(favorites.length);
}

function updateGenres() {
  const genres = [...new Set(books.map(book => book.genre))];
  const oldFilter = genreFilter.value;
  const oldFormGenre = bookGenre.value;

  genreFilter.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'Tất cả thể loại';
  genreFilter.appendChild(allOption);

  bookGenre.replaceChildren();
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = '-- Chọn thể loại --';
  bookGenre.appendChild(emptyOption);

  genres.forEach(genre => {
    const option1 = document.createElement('option');
    option1.value = genre;
    option1.textContent = genre;
    genreFilter.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = genre;
    option2.textContent = genre;
    bookGenre.appendChild(option2);
  });

  if (genres.includes(oldFilter)) genreFilter.value = oldFilter;
  if (genres.includes(oldFormGenre)) bookGenre.value = oldFormGenre;
}

function createBookCard(book: Book) {
  const card = document.createElement('article');
  card.className = 'book-card';

  const title = document.createElement('h3');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.textContent = `Tác giả: ${book.author}`;

  const genre = document.createElement('p');
  genre.textContent = `Thể loại: ${book.genre}`;

  const year = document.createElement('p');
  year.textContent = `Năm: ${book.year}`;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const favoriteBtn = document.createElement('button');
  favoriteBtn.type = 'button';
  favoriteBtn.dataset.action = 'favorite';
  favoriteBtn.dataset.id = book.id;
  favoriteBtn.textContent = favorites.includes(book.id) ? '★ Đã thích' : '☆ Yêu thích';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.dataset.id = book.id;
  deleteBtn.textContent = 'Xóa';

  actions.append(favoriteBtn, deleteBtn);
  card.append(title, author, genre, year, actions);
  return card;
}

function renderBooks() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filtered = books.filter(book => {
    const matchName = book.title.toLowerCase().includes(keyword);
    const matchGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchName && matchGenre;
  });

  list.replaceChildren();
  filtered.forEach(book => list.appendChild(createBookCard(book)));

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Không tìm thấy sách.';
    list.appendChild(empty);
  }

  statusText.textContent = `Đang hiển thị ${filtered.length} / ${books.length} cuốn`;
  updateFavoriteCount();
}

async function loadBooks() {
  statusText.textContent = 'Đang tải...';
  list.replaceChildren();

  try {
    books = await getBooks();
    favorites = favorites.filter(id => books.some(book => book.id === id));
    saveFavorites(favorites);
    updateGenres();
    renderBooks();
  } catch {
    statusText.textContent = 'Có lỗi khi tải danh sách sách.';
  }
}

function toggleFavorite(id: string) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites(favorites);
  renderBooks();
}

list.addEventListener('click', async event => {
  const button = (event.target as HTMLElement).closest('button');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  if (!id || !action) return;

  if (action === 'favorite') {
    toggleFavorite(id);
  }

  if (action === 'delete') {
    const book = books.find(item => item.id === id);
    if (!book || !confirm(`Xóa sách "${book.title}"?`)) return;

    try {
      await deleteBook(id);
      books = books.filter(item => item.id !== id);
      favorites = favorites.filter(item => item !== id);
      saveFavorites(favorites);
      updateGenres();
      renderBooks();
    } catch {
      alert('Xóa sách thất bại.');
    }
  }
});

searchInput.addEventListener('input', renderBooks);
genreFilter.addEventListener('change', renderBooks);

function showError(name: string, message: string) {
  const element = document.querySelector(`#${name}-error`) as HTMLElement;
  element.textContent = message;
}

function validateTitle() {
  const valid = titleInput.value.trim().length >= 3;
  showError('title', valid ? '' : 'Tên sách phải có ít nhất 3 ký tự.');
  return valid;
}

function validateAuthor() {
  const valid = authorInput.value.trim() !== '';
  showError('author', valid ? '' : 'Tác giả không được để trống.');
  return valid;
}

function validateGenre() {
  const valid = bookGenre.value !== '';
  showError('genre', valid ? '' : 'Hãy chọn thể loại.');
  return valid;
}

function validateYear() {
  const year = Number(yearInput.value);
  const currentYear = new Date().getFullYear();
  const valid = Number.isInteger(year) && year >= 1900 && year <= currentYear;
  showError('year', valid ? '' : `Năm phải từ 1900 đến ${currentYear}.`);
  return valid;
}

function validateForm() {
  const a = validateTitle();
  const b = validateAuthor();
  const c = validateGenre();
  const d = validateYear();
  return a && b && c && d;
}

titleInput.addEventListener('input', validateTitle);
authorInput.addEventListener('input', validateAuthor);
bookGenre.addEventListener('change', validateGenre);
yearInput.addEventListener('input', validateYear);

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!validateForm()) return;

  const newBook = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: bookGenre.value,
    year: Number(yearInput.value)
  };

  try {
    const savedBook = await addBook(newBook);
    books.unshift(savedBook);
    form.reset();
    searchInput.value = '';
    genreFilter.value = 'all';
    updateGenres();
    renderBooks();
  } catch {
    alert('Thêm sách thất bại.');
  }
});

function applyTheme() {
  document.body.classList.toggle('dark', darkMode);
}

themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  saveDarkMode(darkMode);
  applyTheme();
});

applyTheme();
updateFavoriteCount();
loadBooks();
