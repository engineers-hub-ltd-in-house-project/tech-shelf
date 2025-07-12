import { vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';

// Create a mock Prisma Client
export const createMockPrismaClient = (): PrismaClient => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blogPost: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    book: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    chapter: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blogTag: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  } as unknown as PrismaClient;

  return mockPrisma;
};

// Mock cookies object for SvelteKit
export const createMockCookies = () => {
  const store = new Map<string, string>();

  return {
    get: vi.fn((name: string) => store.get(name)),
    set: vi.fn((name: string, value: string, _options?: any) => {
      store.set(name, value);
    }),
    delete: vi.fn((name: string) => {
      store.delete(name);
    }),
    serialize: vi.fn(),
  };
};

// Mock request object
export const createMockRequest = (formData: Record<string, any> = {}) => {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value?.toString() || '');
  });

  return {
    formData: vi.fn().mockResolvedValue(data),
    json: vi.fn().mockResolvedValue(formData),
    text: vi.fn().mockResolvedValue(JSON.stringify(formData)),
  };
};

// Mock SvelteKit redirect and error functions
export const mockSvelteKitImports = () => {
  const redirect = vi.fn((status: number, location: string) => {
    const error = new Error('REDIRECT');
    (error as any).status = status;
    (error as any).location = location;
    throw error;
  });

  const error = vi.fn((status: number, message: string) => {
    const err = new Error(message);
    (err as any).status = status;
    throw err;
  });

  const fail = vi.fn((status: number, data: any) => ({
    type: 'failure',
    status,
    data,
  }));

  return { redirect, error, fail };
};
