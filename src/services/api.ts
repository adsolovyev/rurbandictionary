// src/services/api.ts

export interface Definition {
  id: number;
  word: string;
  definition: string;
  example: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

const mockDefinitions: Definition[] = [
  { id: 1, word: "кринж", definition: "Чувство стыда или неловкости за чужие действия.", example: "Его выступление было полным кринжем.", author: "user123", createdAt: "2024-03-15", upvotes: 15, downvotes: 3 },
  { id: 2, word: "хайп", definition: "Ажиотаж, искусственно созданный интерес вокруг чего-либо.", example: "Этот блогер создаёт хайп вокруг каждого видео.", author: "trendsetter", createdAt: "2024-03-10", upvotes: 22, downvotes: 2 },
  { id: 3, word: "чекать", definition: "Проверять, смотреть, изучать.", example: "Чекни мои новые фотки в инсте.", author: "slangmaster", createdAt: "2024-03-05", upvotes: 9, downvotes: 1 }
];

const mockUniqueWords = [
  "кринж", "хайп", "чекать", "кек", "лол", "рофл", "шмот", "агриться", "бамп", "вайб",
  "гайз", "даун", "ебать", "ёк", "жмых", "зиг", "изи", "йоу", "кап", "лампово"
];

const nonCyrillicWords = [
  "lol", "kek", "cheburek", "google", "windows", "xbox", "4k", "2fast"
];

export const getNonCyrillicWords = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return nonCyrillicWords;
};

export const getRandomDefinitions = async (limit = 10): Promise<Definition[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const result: Definition[] = [];
  for (let i = 0; i < limit; i++) {
    result.push({ ...mockDefinitions[i % mockDefinitions.length], id: i + 1 });
  }
  return result;
};

export const vote = async (definitionId: number, voteType: 'up' | 'down') => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Голос ${voteType} за определение ${definitionId}`);
  return { success: true };
};

export const addDefinition = async (data: { word: string; definition: string; example: string; tags?: string[] }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Новое определение:', data);
  return { success: true, id: Math.floor(Math.random() * 1000) };
};

export const reportDefinition = async (definitionId: number, reason: string, comment: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Жалоба на определение ${definitionId}: причина=${reason}, комментарий=${comment}`);
  return { success: true };
};

export const getWordsByLetter = async (letter: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const lowerLetter = letter.toLowerCase();
  return mockUniqueWords.filter(word => word.startsWith(lowerLetter));
};

export const getSuggestions = async (query: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockUniqueWords.filter(word => word.startsWith(lowerQuery)).slice(0, 5);
};

export const getDefinitionsByWord = async (word: string): Promise<Definition[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDefinitions.filter(def => def.word.toLowerCase() === word.toLowerCase());
};

export const getRandomWord = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const randomIndex = Math.floor(Math.random() * mockUniqueWords.length);
  return mockUniqueWords[randomIndex];
};