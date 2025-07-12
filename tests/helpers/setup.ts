import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit's $app/navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  prefetch: vi.fn(),
  prefetchRoutes: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
}));

// Mock SvelteKit's $app/stores
vi.mock('$app/stores', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
  const { readable } = require('svelte/store');

  const getStores = () => ({
    page: readable({
      url: new URL('http://localhost'),
      params: {},
      route: { id: '/' },
      status: 200,
      error: null,
      data: {},
      form: null,
    }),
    navigating: readable(null),
    updated: readable(false),
  });

  const page = {
    subscribe: readable({
      url: new URL('http://localhost'),
      params: {},
      route: { id: '/' },
      status: 200,
      error: null,
      data: {},
      form: null,
    }).subscribe,
  };

  return {
    getStores,
    page,
    navigating: readable(null),
    updated: readable(false),
  };
});

// Mock SvelteKit's $app/environment
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  building: false,
  version: 'test',
}));

// Mock $env/dynamic/public
vi.mock('$env/dynamic/public', () => ({
  PUBLIC_APP_URL: 'http://localhost:5173',
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
