import { create } from 'zustand';

interface User {
  id: number;
  login: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<User>;
  register: (login: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = res.ok ? await res.json() : null;
      set({ user: data?.user || null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (login, password) => {
    set({ loading: true });
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    const user = data.user;
    set({ user, loading: false });
    return user;
  },

  register: async (login, email, password) => {
    set({ loading: true });
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, email, password }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Registration failed');
    set({ loading: false });
  },

  logout: async () => {
    set({ loading: true });
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    set({ user: null, loading: false });
  },
}));