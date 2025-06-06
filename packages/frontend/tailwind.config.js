/** @type {import('tailwindcss').Config} */
import tailwindTheme from './tailwind/theme';
import lineClamp from '@tailwindcss/line-clamp';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...tailwindTheme,
    },
  },
  plugins: [lineClamp],
};
