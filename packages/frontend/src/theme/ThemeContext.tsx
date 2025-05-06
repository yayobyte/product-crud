import { createContext, useContext, type ReactNode } from 'react';
import theme from './theme';

// Create a context with our theme
const ThemeContext = createContext(theme);

interface ThemeProviderProps {
  children: ReactNode;
  value?: typeof theme;
}

/**
 * Theme provider component to make theme tokens available throughout the app
 */
export const ThemeProvider = ({
  children,
  value = theme,
}: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme tokens
 * Use object destructuring to access specific sections:
 *
 * Example:
 * const { colors, spacing } = useTheme();
 * colors.primary[500]
 * spacing[4]
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
