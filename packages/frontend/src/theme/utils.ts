import theme from './theme';

/**
 * Get a color value from the theme
 * @example color('primary.500') // returns the primary color at shade 500
 * @example color('gray.200')
 * @example color('white')
 */
export const color = (path: string): string => {
  const parts = path.split('.');

  if (parts.length === 1) {
    // For base colors like 'white', 'black', 'transparent'
    if (typeof theme.colors[parts[0]] === 'string') {
      return theme.colors[parts[0]];
    }
    throw new Error(`Theme color "${path}" not found`);
  }

  // For color scales like 'primary.500'
  const [colorName, shade] = parts;
  if (theme.colors[colorName]?.[shade]) {
    return theme.colors[colorName][shade];
  }

  throw new Error(`Theme color "${path}" not found`);
};

/**
 * Get a spacing value from the theme
 * @example getSpacing(4) // returns '1rem'
 * @example getSpacing(2) // returns '0.5rem'
 */
export const getSpacing = (value: number | string): string => {
  if (theme.spacing[value]) {
    return theme.spacing[value];
  }

  throw new Error(`Theme spacing "${value}" not found`);
};

/**
 * Get a font size value from the theme
 * @example fontSize('md') // returns '1rem'
 * @example fontSize('2xl') // returns '1.5rem'
 */
export const fontSize = (size: string): string => {
  if (theme.typography.fontSizes[size]) {
    return theme.typography.fontSizes[size];
  }

  throw new Error(`Theme font size "${size}" not found`);
};

/**
 * Get a font weight value from the theme
 * @example fontWeight('bold') // returns 700
 * @example fontWeight('normal') // returns 400
 */
export const fontWeight = (weight: string): number => {
  if (theme.typography.fontWeights[weight]) {
    return theme.typography.fontWeights[weight];
  }

  throw new Error(`Theme font weight "${weight}" not found`);
};

/**
 * Get a border radius value from the theme
 * @example radius('md') // returns '0.375rem'
 * @example radius('full') // returns '9999px'
 */
export const radius = (size: string): string => {
  if (theme.borders.radii[size]) {
    return theme.borders.radii[size];
  }

  throw new Error(`Theme border radius "${size}" not found`);
};

/**
 * Get a shadow value from the theme
 * @example shadow('md') // returns the medium shadow value
 * @example shadow('lg') // returns the large shadow value
 */
export const shadow = (size: string): string => {
  if (theme.shadows[size]) {
    return theme.shadows[size];
  }

  throw new Error(`Theme shadow "${size}" not found`);
};

/**
 * Get a breakpoint value from the theme
 * @example breakpoint('md') // returns '768px'
 * @example breakpoint('lg') // returns '1024px'
 */
export const breakpoint = (size: string): string => {
  if (theme.layout.breakpoints[size]) {
    return theme.layout.breakpoints[size];
  }

  throw new Error(`Theme breakpoint "${size}" not found`);
};

/**
 * Get a z-index value from the theme
 * @example zIndex('modal') // returns 1400
 * @example zIndex('dropdown') // returns 1000
 */
export const zIndex = (layer: string): number | string => {
  if (theme.layout.zIndex[layer] !== undefined) {
    return theme.layout.zIndex[layer];
  }

  throw new Error(`Theme z-index "${layer}" not found`);
};
