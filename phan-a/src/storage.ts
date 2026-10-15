const FAVORITE_KEY = 'th2-a-favorites';
const DARK_KEY = 'th2-a-dark';

export function getFavorites(): string[] {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]');
}

export function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(ids));
}

export function getDarkMode(): boolean {
  return JSON.parse(localStorage.getItem(DARK_KEY) || 'false');
}

export function saveDarkMode(value: boolean) {
  localStorage.setItem(DARK_KEY, JSON.stringify(value));
}
