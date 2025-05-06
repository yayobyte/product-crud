import { useTheme } from './ThemeContext';

// These hooks are separated from the ThemeContext component file
// to avoid React refresh issues (ESLint react-refresh/only-export-components)

/**
 * Helper hooks to access specific theme sections
 * Note: It's recommended to use object destructuring from useTheme() instead
 * Example: const { colors } = useTheme();
 */

// Access color tokens
export const useColors = () => useTheme().colors;

// Access spacing tokens
export const useSpacing = () => useTheme().spacing;

// Access typography tokens
export const useTypography = () => useTheme().typography;

// Access layout tokens
export const useLayout = () => useTheme().layout;

// Access border tokens
export const useBorders = () => useTheme().borders;

// Access shadow tokens
export const useShadows = () => useTheme().shadows;

// Access animation tokens
export const useAnimations = () => useTheme().animations;
