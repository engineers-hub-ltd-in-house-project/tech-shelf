import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'build', '.svelte-kit'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['tests/helpers/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.{js,ts}', '.svelte-kit/', 'build/'],
    },
  },
  resolve: {
    alias: {
      $lib: '/src/lib',
      $app: '/.svelte-kit/runtime/app',
    },
  },
});
