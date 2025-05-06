/** @type {import('tailwindcss').Config} */
import tailwindTheme from './tailwind/theme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...tailwindTheme,
    },
  },
  plugins: [],
};
