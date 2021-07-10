import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

type Theme = 'light' | 'dark';

type useThemeReturn = {
  theme: Theme;
  changeTheme: () => void;
};

export function useTheme(): useThemeReturn {
  const { theme, changeTheme } = useContext(ThemeContext);

  return { theme, changeTheme };
}
