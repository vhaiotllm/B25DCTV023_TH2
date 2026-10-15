import type { Book } from './types';

const API = 'https://6ac7086fbea0e72cf5c966bd.mockapi.io/api/v1/books';

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(API);
  if (!response.ok) throw new Error('Không tải được dữ liệu');
  return response.json();
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });

  if (!response.ok) throw new Error('Không thêm được sách');
  return response.json();
}

export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Không xóa được sách');
}
