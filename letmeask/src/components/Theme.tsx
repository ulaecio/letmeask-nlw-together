import { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

type ThemeProps = {
  children: ReactNode;
};

export function Theme({ children }: ThemeProps): JSX.Element {
  const { theme } = useTheme();

  return <div className={theme}>{children}</div>;
}
