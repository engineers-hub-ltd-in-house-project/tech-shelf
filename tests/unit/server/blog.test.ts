import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  load as editLoad,
  actions as editActions,
} from '../../../src/routes/(app)/blog/edit/[id]/+page.server';
import {
  load as createLoad,
  actions as createActions,
} from '../../../src/routes/(app)/blog/create/+page.server';
import {
  createMockPrismaClient,
  createMockCookies,
  createMockRequest,
  mockSvelteKitImports,
} from '../../helpers/mocks';
import { createUser, createBlogPost, createTag, mockAuthCookie } from '../../helpers/factories';

// Mock Prisma
vi.mock('$lib/server/database', () => ({
  prisma: createMockPrismaClient(),
}));

// Mock SvelteKit imports
vi.mock('@sveltejs/kit', () => mockSvelteKitImports());

describe('Blog Edit Server Functions', () => {
  let mockPrisma: ReturnType<typeof createMockPrismaClient>;
  let mockCookies: ReturnType<typeof createMockCookies>;
  const { redirect: _redirect, error: _error, fail } = mockSvelteKitImports();

  beforeEach(() => {
    vi.clearAllMocks();
    const database = vi.importActual('$lib/server/database') as any;
    mockPrisma = database.prisma;
    mockCookies = createMockCookies();
  });

  describe('load function', () => {
    it('should redirect to login if not authenticated', async () => {
      expect.assertions(1);

      try {
        await editLoad({ params: { id: 'test-id' }, cookies: mockCookies } as any);
      } catch (e: any) {
        expect(e.location).toBe('/login');
      }
    });

    it('should load blog post for authorized user', async () => {
      const user = createUser();
      const post = createBlogPost({ userId: user.id });
      const tag = createTag();

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        ...post,
        tags: [{ tag }],
      });

      const result = await editLoad({
        params: { id: post.id },
        cookies: mockCookies,
      } as any);

      expect(result.post).toMatchObject({
        ...post,
        tags: tag.name,
      });
    });

    it('should throw 404 if post not found', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(null);

      expect.assertions(1);

      try {
        await editLoad({
          params: { id: 'non-existent-id' },
          cookies: mockCookies,
        } as any);
      } catch (e: any) {
        expect(e.status).toBe(404);
      }
    });

    it('should throw 403 if user is not the author', async () => {
      const user = createUser();
      const otherUser = createUser({ id: 'other-user-id' });
      const post = createBlogPost({ userId: otherUser.id });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(post);

      expect.assertions(1);

      try {
        await editLoad({
          params: { id: post.id },
          cookies: mockCookies,
        } as any);
      } catch (e: any) {
        expect(e.status).toBe(403);
      }
    });
  });

  describe('actions', () => {
    it('should update blog post with valid data', async () => {
      const user = createUser();
      const post = createBlogPost({ userId: user.id });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(post);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      const formData = {
        title: 'Updated Title',
        slug: 'updated-slug',
        excerpt: 'Updated excerpt',
        content: '# Updated Content',
        tags: 'tag1, tag2',
        published: 'on',
      };

      const request = createMockRequest(formData);

      expect.assertions(1);

      try {
        await editActions.default({
          request,
          params: { id: post.id },
          cookies: mockCookies,
        } as any);
      } catch (e: any) {
        expect(e.location).toBe('/blog/updated-slug');
      }
    });

    it('should validate required fields', async () => {
      const user = createUser();
      const post = createBlogPost({ userId: user.id });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(post);

      const formData = {
        title: '',
        slug: '',
        content: '',
      };

      const request = createMockRequest(formData);

      const result = await editActions.default({
        request,
        params: { id: post.id },
        cookies: mockCookies,
      } as any);

      expect(result.status).toBe(400);
      expect(result.data.error).toBe('必須項目を入力してください');
    });

    it('should check slug uniqueness', async () => {
      const user = createUser();
      const post = createBlogPost({ userId: user.id, slug: 'original-slug' });
      const existingPost = createBlogPost({ id: 'other-id', slug: 'taken-slug' });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique
        .mockResolvedValueOnce(post) // First call for existing post
        .mockResolvedValueOnce(existingPost); // Second call for slug check

      const formData = {
        title: 'Updated Title',
        slug: 'taken-slug',
        content: '# Content',
        tags: '',
      };

      const request = createMockRequest(formData);

      const result = await editActions.default({
        request,
        params: { id: post.id },
        cookies: mockCookies,
      } as any);

      expect(result.status).toBe(400);
      expect(result.data.error).toBe('このスラッグは既に使用されています');
    });
  });
});

describe('Blog Create Server Functions', () => {
  let mockPrisma: ReturnType<typeof createMockPrismaClient>;
  let mockCookies: ReturnType<typeof createMockCookies>;
  const { redirect: _redirect, error: _error, fail } = mockSvelteKitImports();

  beforeEach(() => {
    vi.clearAllMocks();
    const database = vi.importActual('$lib/server/database') as any;
    mockPrisma = database.prisma;
    mockCookies = createMockCookies();
  });

  describe('load function', () => {
    it('should redirect to login if not authenticated', async () => {
      expect.assertions(1);

      try {
        await createLoad({ cookies: mockCookies } as any);
      } catch (e: any) {
        expect(e.location).toBe('/login');
      }
    });

    it('should return empty object for authenticated user', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));

      const result = await createLoad({ cookies: mockCookies } as any);
      expect(result).toEqual({});
    });
  });

  describe('actions', () => {
    it('should create new blog post', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(null); // No duplicate slug
      mockPrisma.blogPost.create.mockResolvedValue(createBlogPost());

      const formData = {
        title: 'New Blog Post',
        slug: 'new-blog-post',
        excerpt: 'This is a new post',
        content: '# New Content',
        tags: 'tag1, tag2',
      };

      const request = createMockRequest(formData);

      expect.assertions(1);

      try {
        await createActions.default({ request, cookies: mockCookies } as any);
      } catch (e: any) {
        expect(e.location).toBe('/blog/new-blog-post');
      }
    });

    it('should handle tag creation correctly', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(null);
      mockPrisma.blogPost.create.mockResolvedValue(createBlogPost());

      const formData = {
        title: 'Post with Tags',
        slug: 'post-with-tags',
        content: '# Content',
        tags: 'JavaScript, TypeScript, SvelteKit',
      };

      const request = createMockRequest(formData);

      try {
        await createActions.default({ request, cookies: mockCookies } as any);
      } catch (e) {
        // Expected redirect
      }

      expect(mockPrisma.blogPost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tags: {
              create: expect.arrayContaining([
                expect.objectContaining({
                  tag: {
                    connectOrCreate: expect.objectContaining({
                      where: { name: 'JavaScript' },
                      create: { name: 'JavaScript', slug: 'javascript' },
                    }),
                  },
                }),
              ]),
            },
          }),
        })
      );
    });
  });
});
