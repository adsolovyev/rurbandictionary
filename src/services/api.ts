const API_BASE = '/api';

export interface Definition {
  id: number;
  word: string;
  definition: string;
  example: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote?: number | null;
}

export interface Suggestion {
  word: string;
  definition: string;
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
export const getWordsByLetter = async (letter: string, page = 1, limit = 20): Promise<{ words: string[], total: number, totalPages: number }> => {
  const res = await fetch(`${API_BASE}/browse?letter=${encodeURIComponent(letter)}&page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch words by letter');
  return res.json();
};

// Получить подсказки для поиска
export const getSuggestions = async (query: string): Promise<Suggestion[]> => {
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

// Получить все слова, не начинающиеся с кириллицы (для раздела '#')
export const getNonCyrillicWords = async (): Promise<string[]> => {
  const data = await getWordsByLetter('#', 1, 100); // загружаем до 100 слов
  return data.words;
};

// Получить определения, добавленные указанным автором (по логину), с пагинацией
export const getDefinitionsByAuthor = async (author: string, page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/definitions/by-author?author=${encodeURIComponent(author)}&page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch definitions by author');
  return res.json();
};

// Админские эндпоинты для модерации определений
// Получить все определения, ожидающие модерации (статус 'pending')
export const getPendingDefinitions = async (): Promise<Definition[]> => {
  const res = await fetch(`${API_BASE}/admin/definitions/pending`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch pending definitions');
  return res.json();
};

// Одобрить определение (меняет статус с 'pending' на 'active')
export const approveDefinition = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/admin/definitions/${id}/approve`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to approve definition');
};

// Отклонить определение (меняет статус на 'rejected' и сохраняет причину)
export const rejectDefinition = async (id: number, reason?: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/admin/definitions/${id}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to reject definition');
};

// Получить список всех жалоб (неразрешённых) – для админки
export const getReports = async () => {
  const res = await fetch(`${API_BASE}/admin/reports`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
};

// Получить активные определения того же слова (точное совпадение) для показа в модерации
export const getDefinitionsByExactWord = async (word: string, limit = 5): Promise<Definition[]> => {
  const res = await fetch(`${API_BASE}/definitions/word/${encodeURIComponent(word)}/exact?limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch definitions by exact word');
  return res.json();
};

// Получить статистику для админ-дашборда (количество ожидающих определений и жалоб)
export const getAdminStats = async () => {
  const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
};

// Получить последние 10 определений на модерации (для дашборда)
export const getRecentPendingDefinitions = async (limit = 10) => {
  const res = await fetch(`${API_BASE}/admin/pending/recent?limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch recent pending definitions');
  return res.json();
};

// Получить последние 10 жалоб (для дашборда)
export const getRecentReports = async (limit = 10) => {
  const res = await fetch(`${API_BASE}/admin/reports/recent?limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch recent reports');
  return res.json();
};

// Детальная информация о жалобе (включая данные определения и автора)
export interface ReportDetails {
  id: number;
  definition_id: number;
  reporter_id: number;
  reason: string;
  comment: string;
  created_at: string;
  resolved: boolean;
  word: string;
  definition: string;
  example: string;
  def_created_at: string;
  upvotes: number;
  downvotes: number;
  def_status: string;
  author_id: number;
  author_login: string;
  is_banned: boolean;
  author_definitions_count: number;
  author_reports_count: number;
}

// Получить все активные (неразрешённые) жалобы с полной информацией
export const getAllActiveReports = async (): Promise<ReportDetails[]> => {
  const res = await fetch(`${API_BASE}/admin/reports/all`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
};

// Закрыть жалобу (отметить как resolved), опционально добавить комментарий администратора
export const resolveReport = async (id: number, adminComment?: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/admin/reports/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminComment }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to resolve report');
};

// Заблокировать определение (меняет статус на 'blocked')
export const blockDefinition = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/admin/definitions/${id}/block`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to block definition');
};

// Заблокировать пользователя (установить is_banned = true) и заблокировать все его активные определения
export const banUser = async (userId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to ban user');
};

// Получить последние определения (сортировка по дате создания, для главной страницы)
export const getLatestDefinitions = async (page = 1, limit = 20): Promise<Definition[]> => {
  const res = await fetch(`${API_BASE}/definitions/latest?page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch latest definitions');
  return res.json();
};

// Получить список всех уникальных слов со статусом 'active' (для подсветки ссылок)
export const getActiveWords = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/words/active`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch active words');
  return res.json();
};

export interface SuggestionData {
  word: string;
  definition: string;
}

export const getSuggestionsData = async (): Promise<SuggestionData[]> => {
  const res = await fetch(`${API_BASE}/definitions/suggestions-data`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch suggestions data');
  return res.json();
};