import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Suppress Svelte 5 warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('hydration_mismatch')) return;
  originalConsoleWarn(...args);
};

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
  browser: true,
  dev: true,
  building: false,
  version: 'test',
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadCode: vi.fn(),
  preloadData: vi.fn(),
}));

vi.mock('$app/stores', () => {
  const readable = (value) => ({
    subscribe: (fn) => {
      fn(value);
      return () => {};
    },
  });

  return {
    page: readable({}),
    navigating: readable(null),
    updated: readable(false),
  };
});
