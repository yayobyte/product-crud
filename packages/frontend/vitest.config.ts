import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        'src/**/index.ts',
        'src/**/*.test.{ts,tsx}',
        'src/components/ui/Icon*.tsx',
        'src/types/**/',
        'src/context/**/',
        'src/store/**/',
        'src/services/api.ts',
        'src/App.tsx',
        'src/features/products/routes.tsx',
      ],
    },
  },
});
