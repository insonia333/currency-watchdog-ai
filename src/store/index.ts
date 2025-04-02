import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        setTheme: (theme) => set({ theme }),
        isLoading: false,
        setIsLoading: (loading) => set({ isLoading: loading }),
        error: null,
        setError: (error) => set({ error }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
); 