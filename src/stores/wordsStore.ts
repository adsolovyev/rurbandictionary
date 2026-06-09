import { create } from 'zustand';

interface WordsState {
  words: string[];
  loading: boolean;
  fetchWords: () => Promise<void>;
}

export const useWordsStore = create<WordsState>((set) => ({
  words: [],
  loading: false,
  fetchWords: async () => {
    set({ loading: true });
    try {
      const words = await import('../services/api').then(m => m.getActiveWords());
      set({ words, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));