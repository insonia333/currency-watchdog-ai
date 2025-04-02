import { useStore } from '@/store';

export const toggleTheme = () => {
  const { theme, setTheme } = useStore.getState();
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.classList.toggle('dark');
};

export const initializeTheme = () => {
  const { theme } = useStore.getState();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
};

export const getThemeColors = () => {
  const { theme } = useStore.getState();
  return {
    primary: theme === 'light' ? '#000000' : '#ffffff',
    secondary: theme === 'light' ? '#666666' : '#a0a0a0',
    background: theme === 'light' ? '#ffffff' : '#1a1a1a',
    surface: theme === 'light' ? '#f5f5f5' : '#2d2d2d',
    error: '#ff4444',
    success: '#00c851',
    warning: '#ffbb33',
    info: '#33b5e5',
  };
}; 