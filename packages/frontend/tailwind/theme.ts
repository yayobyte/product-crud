/**
 * Tailwind CSS theme extension that maps to our design tokens
 * This allows us to use the same color values in both our theme system
 * and Tailwind classes.
 */

// Import the theme colors from our theme file
import theme from '../src/theme/theme';

/**
 * Generate color config for Tailwind
 * This creates a flat structure for Tailwind
 * Example: 'primary-500': '#3f83f8' becomes accessible as bg-primary-500
 */
function generateColorConfig(colorObj) {
  const colorConfig = {};

  // Process each color category
  Object.entries(colorObj).forEach(([category, value]) => {
    // Skip if it's not an object (base colors)
    if (typeof value !== 'object') {
      colorConfig[category] = value;
      return;
    }

    // Process color scales
    Object.entries(value).forEach(([shade, color]) => {
      colorConfig[`${category}-${shade}`] = color;
    });
  });

  return colorConfig;
}

// Generate the tailwind theme config
const tailwindTheme = {
  colors: generateColorConfig(theme.colors),

  // Map our spacing scale to Tailwind's spacing
  spacing: theme.spacing,

  // Border radius
  borderRadius: theme.borders.radii,

  // Shadows
  boxShadow: theme.shadows,

  // Typography settings
  fontFamily: {
    sans: theme.typography.fonts.body.split(', '),
    mono: theme.typography.fonts.mono.split(', '),
  },

  fontSize: theme.typography.fontSizes,

  fontWeight: theme.typography.fontWeights,

  lineHeight: theme.typography.lineHeights,

  letterSpacing: theme.typography.letterSpacings,
};

export default tailwindTheme;
