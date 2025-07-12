import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'tests/e2e/**',
      'tests/unit/server/auth.test.ts',
      'tests/unit/server/blog.test.ts',
      'tests/integration/**',
    ],
    setupFiles: ['./vitest-setup.ts'],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.svelte-kit/', 'build/', 'src/app.d.ts', '**/*.config.*'],
    },
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
});
