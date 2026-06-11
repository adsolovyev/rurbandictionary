import { create } from 'zustand';
import type { SuggestionData } from '../services/api';

interface SuggestionsState {
  data: SuggestionData[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

export const useSuggestionsStore = create<SuggestionsState>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    set({ loading: true });
    try {
      const data = await import('../services/api').then(m => m.getSuggestionsData());
      set({ data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
}));