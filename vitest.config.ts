import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.svelte-kit/', 'build/', 'src/app.d.ts', '**/*.config.*'],
    },
  },
  resolve: {
    alias: {
      $lib: '/src/lib',
    },
  },
});
