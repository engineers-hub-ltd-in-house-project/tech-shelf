import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMockPrismaClient,
  createMockCookies,
  mockSvelteKitImports,
} from '../../helpers/mocks';
import { createUser, createBlogPost, mockAuthCookie } from '../../helpers/factories';

// Mock Prisma
vi.mock('$lib/server/database', () => ({
  prisma: createMockPrismaClient(),
}));

// Mock SvelteKit imports
vi.mock('@sveltejs/kit', () => mockSvelteKitImports());

describe('Blog API Integration Tests', () => {
  let mockPrisma: ReturnType<typeof createMockPrismaClient>;
  let mockCookies: ReturnType<typeof createMockCookies>;
  const { redirect: _redirect, error: _error, fail: _fail } = mockSvelteKitImports();

  beforeEach(() => {
    vi.clearAllMocks();
    const database = vi.importActual('$lib/server/database') as any;
    mockPrisma = database.prisma;
    mockCookies = createMockCookies();
  });

  describe('Blog Creation Flow', () => {
    it('should handle complete blog creation flow', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(null);

      const newPost = createBlogPost({
        title: 'New Integration Test Post',
        slug: 'new-integration-test-post',
        userId: user.id,
      });

      mockPrisma.blogPost.create.mockResolvedValue(newPost);

      // Simulate form submission
      const formData = new FormData();
      formData.append('title', 'New Integration Test Post');
      formData.append('slug', 'new-integration-test-post');
      formData.append('content', '# Test Content\n\nIntegration test content.');
      formData.append('tags', 'test, integration');

      const request = {
        formData: vi.fn().mockResolvedValue(formData),
      };

      // Import and execute create action
      const { actions } = await import('../../../src/routes/(app)/blog/create/+page.server');

      expect.assertions(1);
      try {
        await actions.default({ request, cookies: mockCookies } as any);
      } catch (e: any) {
        expect(e.location).toBe('/blog/new-integration-test-post');
      }
    });
  });

  describe('Blog Edit Flow', () => {
    it('should handle complete blog edit flow', async () => {
      const user = createUser();
      const existingPost = createBlogPost({
        id: 'existing-post-id',
        userId: user.id,
        title: 'Original Title',
        slug: 'original-slug',
      });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(existingPost);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      // Simulate form submission
      const formData = new FormData();
      formData.append('title', 'Updated Title');
      formData.append('slug', 'updated-slug');
      formData.append('content', '# Updated Content');
      formData.append('tags', 'updated, tags');
      formData.append('published', 'on');

      const request = {
        formData: vi.fn().mockResolvedValue(formData),
      };

      // Import and execute edit action
      const { actions } = await import('../../../src/routes/(app)/blog/edit/[id]/+page.server');

      expect.assertions(1);
      try {
        await actions.default({
          request,
          params: { id: 'existing-post-id' },
          cookies: mockCookies,
        } as any);
      } catch (e: any) {
        expect(e.location).toBe('/blog/updated-slug');
      }
    });

    it('should handle validation errors in edit flow', async () => {
      const user = createUser();
      const existingPost = createBlogPost({
        id: 'existing-post-id',
        userId: user.id,
      });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findUnique.mockResolvedValue(existingPost);

      // Simulate form submission with invalid data
      const formData = new FormData();
      formData.append('title', ''); // Empty title
      formData.append('slug', '');
      formData.append('content', '');
      formData.append('tags', '');

      const request = {
        formData: vi.fn().mockResolvedValue(formData),
      };

      const { actions } = await import('../../../src/routes/(app)/blog/edit/[id]/+page.server');

      const result = await actions.default({
        request,
        params: { id: 'existing-post-id' },
        cookies: mockCookies,
      } as any);

      expect(result.type).toBe('failure');
      expect(result.status).toBe(400);
      expect(result.data.error).toBe('必須項目を入力してください');
    });
  });

  describe('Blog List and Filtering', () => {
    it('should load user blog posts with pagination', async () => {
      const user = createUser();
      const posts = [
        createBlogPost({ userId: user.id, isPublished: true }),
        createBlogPost({ userId: user.id, isPublished: false }),
      ];

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findMany.mockResolvedValue(posts);
      mockPrisma.blogPost.count.mockResolvedValue(2);

      const { load } = await import('../../../src/routes/(app)/blog/my/+page.server');

      const result = await load({
        cookies: mockCookies,
        url: new URL('http://localhost/blog/my'),
      } as any);

      expect(result.posts).toHaveLength(2);
      expect(result.pagination).toMatchObject({
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should filter posts by status', async () => {
      const user = createUser();
      const publishedPost = createBlogPost({ userId: user.id, isPublished: true });

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findMany.mockResolvedValue([publishedPost]);
      mockPrisma.blogPost.count.mockResolvedValue(1);

      const { load } = await import('../../../src/routes/(app)/blog/my/+page.server');

      const result = await load({
        cookies: mockCookies,
        url: new URL('http://localhost/blog/my?status=published'),
      } as any);

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].isPublished).toBe(true);
      expect(result.currentStatus).toBe('published');
    });
  });
});
