// src/services/api.ts

const API_BASE = '/api'; // прокси на бэк (настроен в vite.config.ts)

export interface Definition {
  id: number;
  word: string;
  definition: string;
  example: string;
  author: string;      // login автора
  created_at: string;
  upvotes: number;
  downvotes: number;
}

// Получить случайные определения (главная страница)
export const getRandomDefinitions = async (limit = 10): Promise<Definition[]> => {
  const res = await fetch(`${API_BASE}/definitions/random?limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch random definitions');
  return res.json();
};

// Получить определения по слову (поиск)
export const getDefinitionsByWord = async (word: string, page = 1, limit = 10): Promise<Definition[]> => {
  const res = await fetch(`${API_BASE}/definitions?word=${encodeURIComponent(word)}&page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch definitions by word');
  return res.json();
};

// Добавить новое определение (требует авторизации)
export const addDefinition = async (data: { word: string; definition: string; example: string; tags?: string[] }) => {
  const res = await fetch(`${API_BASE}/definitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add definition');
  }
  return res.json();
};

// Голосовать за/против (требует авторизации)
export const vote = async (definitionId: number, voteType: 'up' | 'down') => {
  const res = await fetch(`${API_BASE}/definitions/${definitionId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vote: voteType }),
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to vote');
  }
  return res.json();
};

// Пожаловаться на определение (требует авторизации)
export const reportDefinition = async (definitionId: number, reason: string, comment: string) => {
  const res = await fetch(`${API_BASE}/definitions/${definitionId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason, comment }),
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to report');
  }
  return res.json();
};

// Получить уникальные слова по букве (алфавитный указатель)
export const getWordsByLetter = async (letter: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/browse?letter=${encodeURIComponent(letter)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch words by letter');
  return res.json();
};

// Получить подсказки для поиска
export const getSuggestions = async (query: string): Promise<string[]> => {
  if (!query) return [];
  const res = await fetch(`${API_BASE}/suggest?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json();
};

// Получить случайное слово
export const getRandomWord = async (): Promise<string> => {
  const res = await fetch(`${API_BASE}/random-word`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch random word');
  const data = await res.json();
  return data.word;
};

export const getNonCyrillicWords = async (): Promise<string[]> => {
  return getWordsByLetter('#');
};

export const getDefinitionsByAuthor = async (author: string, page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/definitions/by-author?author=${encodeURIComponent(author)}&page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch definitions by author');
  return res.json();
};