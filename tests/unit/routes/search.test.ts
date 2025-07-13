import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../../../src/routes/search/+page.server';
import type { RequestEvent } from '@sveltejs/kit';

// Prismaのモック
vi.mock('$lib/server/database', () => ({
  prisma: {
    blogPost: {
      findMany: vi.fn(),
    },
    book: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '$lib/server/database';

describe('Search Page Server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty results when no query provided', async () => {
    const mockEvent = {
      url: new URL('http://localhost:5173/search'),
    } as RequestEvent;

    const result = await load(mockEvent);

    expect(result).toEqual({
      query: '',
      type: 'all',
      blogPosts: [],
      books: [],
    });
  });

  it('should search blog posts with query', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Rust Programming',
        slug: 'rust-programming',
        content: 'Learn Rust',
        excerpt: 'Introduction to Rust',
        isPublished: true,
        publishedAt: new Date(),
        author: {
          name: 'Test Author',
          avatar: null,
        },
        tags: [{ tag: { id: '1', name: 'Rust', slug: 'rust' } }],
        viewCount: 100,
      },
    ];

    vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockPosts as any);
    vi.mocked(prisma.book.findMany).mockResolvedValue([]);

    const mockEvent = {
      url: new URL('http://localhost:5173/search?q=Rust&type=blog'),
    } as RequestEvent;

    const result = await load(mockEvent);

    expect(result.query).toBe('Rust');
    expect(result.type).toBe('blog');
    expect(result.blogPosts).toHaveLength(1);
    expect(result.blogPosts[0]).toMatchObject({
      title: 'Rust Programming',
      slug: 'rust-programming',
    });
  });

  it('should search books with query', async () => {
    const mockBooks = [
      {
        id: '1',
        title: 'Rust Guide',
        author: 'Test Author',
        description: 'Complete Rust guide',
        coverImage: null,
        price: 2000,
        isPublished: true,
        publishedAt: new Date(),
        chapters: [{ id: '1' }, { id: '2' }],
        tags: [{ tag: { id: '1', name: 'Rust', slug: 'rust' } }],
      },
    ];

    vi.mocked(prisma.blogPost.findMany).mockResolvedValue([]);
    vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any);

    const mockEvent = {
      url: new URL('http://localhost:5173/search?q=Rust&type=book'),
    } as RequestEvent;

    const result = await load(mockEvent);

    expect(result.query).toBe('Rust');
    expect(result.type).toBe('book');
    expect(result.books).toHaveLength(1);
    expect(result.books[0]).toMatchObject({
      title: 'Rust Guide',
      author: 'Test Author',
      chapterCount: 2,
    });
  });

  it('should search all types when type is all', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Rust Programming',
        isPublished: true,
        tags: [],
      },
    ];

    const mockBooks = [
      {
        id: '1',
        title: 'Rust Guide',
        isPublished: true,
        chapters: [],
        tags: [],
      },
    ];

    vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockPosts as any);
    vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any);

    const mockEvent = {
      url: new URL('http://localhost:5173/search?q=Rust'),
    } as RequestEvent;

    const result = await load(mockEvent);

    expect(result.query).toBe('Rust');
    expect(result.type).toBe('all');
    expect(result.blogPosts).toHaveLength(1);
    expect(result.books).toHaveLength(1);
  });
});
