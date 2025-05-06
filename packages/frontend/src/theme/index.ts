// Export theme object and provider components
export { default as theme } from './theme';
export {
  colors,
  spacing,
  layout,
  typography,
  borders,
  shadows,
  animations,
} from './theme';
export { ThemeProvider, useTheme } from './ThemeContext';
export {
  color,
  getSpacing,
  fontSize,
  fontWeight,
  radius,
  shadow,
  breakpoint,
  zIndex,
} from './utils';

// Export pre-computed theme constants for non-hook usage
export {
  themeColors,
  themeSpacing,
  themeShadows,
  radii,
  fontSizes,
  fontWeights,
} from './constants';

// Export hooks separately to avoid React refresh issues
export {
  useColors,
  useSpacing,
  useTypography,
  useLayout,
  useBorders,
  useShadows,
  useAnimations,
} from './hooks';

// Re-export theme as default for convenience
import theme from './theme';
export default theme;
