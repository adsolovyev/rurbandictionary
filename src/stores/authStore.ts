import { create } from 'zustand';

interface User {
  id: number;
  login: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = res.ok ? await res.json() : null;
      set({ user: data?.user || null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (login, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    set({ user: data.user });
  },

  register: async (login, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, email, password }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Registration failed');
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    set({ user: null });
  },
}));