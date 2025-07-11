import '@testing-library/jest-dom/vitest';

// Mock SvelteKit environment
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  building: false,
  version: 'test',
}));

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadCode: vi.fn(),
  preloadData: vi.fn(),
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn(),
  },
  navigating: {
    subscribe: vi.fn(),
  },
  updated: {
    subscribe: vi.fn(),
    check: vi.fn(),
  },
}));
