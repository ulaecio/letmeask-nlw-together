import { ReactNode, useState, useEffect, createContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  changeTheme: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext({} as ThemeContextValue);

export function ThemeContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  const userSavedTheme = localStorage.getItem('theme') ?? 'light';
  const [theme, setTheme] = useState(userSavedTheme as Theme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  function changeTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
