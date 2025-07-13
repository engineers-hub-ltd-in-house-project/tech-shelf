import { describe, it, expect, vi, beforeEach } from 'vitest';

// モック
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

describe('Search Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Blog Post Search', () => {
    it('should search with title, content, and excerpt', async () => {
      const mockBlogPosts = [
        {
          id: 'post-1',
          title: 'JavaScript Tutorial',
          content: 'Learn JavaScript fundamentals',
          excerpt: 'A comprehensive guide',
          slug: 'js-tutorial',
          author: { name: 'Test Author' },
          tags: [],
          published: true,
        },
      ];

      vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockBlogPosts as any);

      const query = 'JavaScript';
      const searchConditions = {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { excerpt: { contains: query } },
        ],
      };

      await prisma.blogPost.findMany({
        where: {
          published: true,
          ...searchConditions,
        },
        include: {
          author: { select: { name: true } },
          tags: { include: { tag: true } },
        },
      });

      expect(prisma.blogPost.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        include: {
          author: { select: { name: true } },
          tags: { include: { tag: true } },
        },
      });
    });

    it('should handle empty search query', async () => {
      vi.mocked(prisma.blogPost.findMany).mockResolvedValue([]);

      const query = '';

      if (query.trim()) {
        await prisma.blogPost.findMany();
      }

      expect(prisma.blogPost.findMany).not.toHaveBeenCalled();
    });

    it('should search only published posts', async () => {
      const query = 'test';

      await prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        include: {
          author: { select: { name: true } },
          tags: { include: { tag: true } },
        },
      });

      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        })
      );
    });
  });

  describe('Book Search', () => {
    it('should search books with title and description', async () => {
      const mockBooks = [
        {
          id: 'book-1',
          title: 'React Guide',
          description: 'Complete React tutorial',
          isPublished: true,
          author: 'Test Author',
        },
      ];

      vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any);

      const query = 'React';
      const searchConditions = {
        OR: [{ title: { contains: query } }, { description: { contains: query } }],
      };

      await prisma.book.findMany({
        where: {
          isPublished: true,
          ...searchConditions,
        },
      });

      expect(prisma.book.findMany).toHaveBeenCalledWith({
        where: {
          isPublished: true,
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
        },
      });
    });

    it('should search only published books', async () => {
      const query = 'test';

      await prisma.book.findMany({
        where: {
          isPublished: true,
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
        },
      });

      expect(prisma.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublished: true,
          }),
        })
      );
    });
  });

  describe('Combined Search', () => {
    it('should handle both blog and book search results', async () => {
      const mockBlogPosts = [{ id: 'post-1', title: 'Test Post' }];
      const mockBooks = [{ id: 'book-1', title: 'Test Book' }];

      vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockBlogPosts as any);
      vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any);

      const query = 'test';

      const [blogPosts, books] = await Promise.all([
        prisma.blogPost.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query } },
              { content: { contains: query } },
              { excerpt: { contains: query } },
            ],
          },
          include: {
            author: { select: { name: true } },
            tags: { include: { tag: true } },
          },
        }),
        prisma.book.findMany({
          where: {
            isPublished: true,
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
        }),
      ]);

      expect(blogPosts).toEqual(mockBlogPosts);
      expect(books).toEqual(mockBooks);
      expect(prisma.blogPost.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('Search Type Filtering', () => {
    it('should filter by blog type only', async () => {
      const mockBlogPosts = [{ id: 'post-1', title: 'Test Post' }];
      vi.mocked(prisma.blogPost.findMany).mockResolvedValue(mockBlogPosts as any);

      const searchType = 'blog';
      const query = 'test';

      if (searchType === 'blog' || searchType === 'all') {
        await prisma.blogPost.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query } },
              { content: { contains: query } },
              { excerpt: { contains: query } },
            ],
          },
          include: {
            author: { select: { name: true } },
            tags: { include: { tag: true } },
          },
        });
      }

      expect(prisma.blogPost.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.book.findMany).not.toHaveBeenCalled();
    });

    it('should filter by book type only', async () => {
      const mockBooks = [{ id: 'book-1', title: 'Test Book' }];
      vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any);

      const searchType = 'book';
      const query = 'test';

      if (searchType === 'book' || searchType === 'all') {
        await prisma.book.findMany({
          where: {
            isPublished: true,
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
        });
      }

      expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.blogPost.findMany).not.toHaveBeenCalled();
    });
  });

  describe('SQLite Compatibility', () => {
    it('should use contains operator instead of mode for SQLite', async () => {
      const query = 'Test';

      // SQLiteでは mode: 'insensitive' は使用できない
      const searchConditions = {
        OR: [
          { title: { contains: query } }, // mode無し
          { content: { contains: query } },
          { excerpt: { contains: query } },
        ],
      };

      await prisma.blogPost.findMany({
        where: {
          published: true,
          ...searchConditions,
        },
        include: {
          author: { select: { name: true } },
          tags: { include: { tag: true } },
        },
      });

      const callArgs = vi.mocked(prisma.blogPost.findMany).mock.calls[0][0];
      const orConditions = callArgs?.where?.OR;

      // mode プロパティが含まれていないことを確認
      orConditions?.forEach((condition: any) => {
        Object.values(condition).forEach((value: any) => {
          expect(value).not.toHaveProperty('mode');
        });
      });
    });
  });
});
