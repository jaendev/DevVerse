'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 1. Intentar obtener el tema del localStorage primero
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // 2. Si no hay tema guardado, usar preferencia del sistema
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // 3. Determinar el tema inicial
    const initialTheme = savedTheme || systemTheme;
    
    // 4. Aplicar el tema al DOM inmediatamente
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTheme(initialTheme);
    setMounted(true);
    
    console.log('Initial theme loaded:', initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Aplicar la clase correctamente (no usar toggle)
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    console.log('Theme changed to:', newTheme);
    
    // Opcional: Disparar un evento personalizado
    window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}