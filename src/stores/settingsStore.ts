import { create } from 'zustand';
import { API_BASE } from '../services/api';

interface SettingsState {
  dyslexicFont: boolean;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  toggleDyslexicFont: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  dyslexicFont: false,
  loading: true,

  fetchSettings: async () => {
    const saved = localStorage.getItem('dyslexicFont');
    if (saved !== null) {
      const isEnabled = saved === 'true';
      set({ dyslexicFont: isEnabled, loading: false });
      document.body.classList.toggle('dyslexic', isEnabled);
    } else {
      set({ loading: false });
    }

    try {
      const res = await fetch(`${API_BASE}/user/settings`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const isEnabled = data.dyslexic_font === 'true';
        set({ dyslexicFont: isEnabled, loading: false });
        document.body.classList.toggle('dyslexic', isEnabled);
        localStorage.setItem('dyslexicFont', String(isEnabled));
      }
    } catch (err) {
      void err;
    } finally {
      set({ loading: false });
    }
  },

  toggleDyslexicFont: async () => {
    const current = get().dyslexicFont;
    const newValue = !current;
    set({ dyslexicFont: newValue });
    document.body.classList.toggle('dyslexic', newValue);

    localStorage.setItem('dyslexicFont', String(newValue));

    try {
      await fetch(`${API_BASE}/user/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'dyslexic_font', value: String(newValue) }),
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to save setting on server', err);
    }
  },
}));