/**
 * This file contains pre-computed theme constants that can be imported
 * and used in components without requiring hooks.
 * Use this for static/non-reactive styling that doesn't change based on state.
 */
import theme from './theme';

// Pre-computed color constants
export const themeColors = {
  // Primary colors
  primary50: theme.colors.primary[50],
  primary100: theme.colors.primary[100],
  primary500: theme.colors.primary[500],
  primary600: theme.colors.primary[600],
  primary700: theme.colors.primary[700],

  // Gray colors
  gray50: theme.colors.gray[50],
  gray100: theme.colors.gray[100],
  gray200: theme.colors.gray[200],
  gray300: theme.colors.gray[300],
  gray500: theme.colors.gray[500],
  gray600: theme.colors.gray[600],
  gray700: theme.colors.gray[700],
  gray900: theme.colors.gray[900],

  // Semantic colors
  danger50: theme.colors.danger[50],
  danger100: theme.colors.danger[100],
  danger500: theme.colors.danger[500],
  danger700: theme.colors.danger[700],
  success500: theme.colors.success[500],
  warning500: theme.colors.warning[500],

  // Base colors
  white: theme.colors.white,
  black: theme.colors.black,
};

// Pre-computed spacing constants
export const themeSpacing = {
  xs: theme.spacing[1], // 0.25rem
  sm: theme.spacing[2], // 0.5rem
  md: theme.spacing[4], // 1rem
  lg: theme.spacing[6], // 1.5rem
  xl: theme.spacing[8], // 2rem
  xxl: theme.spacing[12], // 3rem
};

// Pre-computed radius constants
export const radii = {
  none: theme.borders.radii.none,
  sm: theme.borders.radii.sm,
  md: theme.borders.radii.md,
  lg: theme.borders.radii.lg,
  xl: theme.borders.radii.xl,
  full: theme.borders.radii.full,
};

// Pre-computed shadow constants
export const themeShadows = {
  sm: theme.shadows.sm,
  md: theme.shadows.md,
  lg: theme.shadows.lg,
};

// Pre-computed font size constants
export const fontSizes = {
  xs: theme.typography.fontSizes.xs,
  sm: theme.typography.fontSizes.sm,
  md: theme.typography.fontSizes.md,
  lg: theme.typography.fontSizes.lg,
  xl: theme.typography.fontSizes.xl,
  xxl: theme.typography.fontSizes['2xl'],
};

// Pre-computed font weight constants
export const fontWeights = {
  normal: theme.typography.fontWeights.normal,
  medium: theme.typography.fontWeights.medium,
  semibold: theme.typography.fontWeights.semibold,
  bold: theme.typography.fontWeights.bold,
};
