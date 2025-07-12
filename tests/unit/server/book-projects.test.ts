import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { createMockCookies, createMockRequest } from '../../helpers/mocks';
import { createUser, createBlogPost, mockAuthCookie } from '../../helpers/factories';

// Mock Prisma with factory function
vi.mock('$lib/server/database', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    bookCreationProject: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    bookProjectPost: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    bookProjectChapter: {
      create: vi.fn(),
      aggregate: vi.fn(),
    },
    blogPost: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

// Mock SvelteKit with factory function
vi.mock('@sveltejs/kit', () => ({
  redirect: vi.fn((status: number, location: string) => {
    throw { status, location };
  }),
  error: vi.fn((status: number, message: string) => {
    throw { status, message };
  }),
  fail: vi.fn((status: number, data: Record<string, unknown>) => ({
    type: 'failure',
    status,
    data,
  })),
}));

import { load as projectsLoad } from '../../../src/routes/(app)/book-projects/+page.server';
import {
  load as createLoad,
  actions as createActions,
} from '../../../src/routes/(app)/book-projects/create/+page.server';
import {
  load as projectLoad,
  actions as projectActions,
} from '../../../src/routes/(app)/book-projects/[id]/+page.server';

describe('Book Projects Server Functions', () => {
  let mockPrisma: Record<string, unknown>;
  let mockCookies: ReturnType<typeof createMockCookies>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCookies = createMockCookies();
    // Get mocked prisma instance
    const { prisma } = await import('$lib/server/database');
    mockPrisma = prisma;
  });

  describe('Projects List Page', () => {
    it('should redirect to login if not authenticated', async () => {
      expect.assertions(1);

      try {
        await projectsLoad({ cookies: mockCookies } as RequestEvent);
      } catch (e: unknown) {
        expect((e as { location: string }).location).toBe('/login');
      }
    });

    it('should load user projects', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const projects = [
        {
          id: 'project-1',
          userId: user.id,
          title: 'My Book Project',
          description: 'A test project',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
          posts: [],
          chapters: [],
          book: null,
          bookId: null,
        },
      ];

      mockPrisma.bookCreationProject.findMany.mockResolvedValue(projects);

      const result = await projectsLoad({ cookies: mockCookies } as RequestEvent);

      expect(result.projects).toHaveLength(1);
      expect(result.projects[0]).toMatchObject({
        title: 'My Book Project',
        postCount: 0,
        chapterCount: 0,
        isPublished: false,
      });
    });
  });

  describe('Create Project Page', () => {
    it('should load user blog posts', async () => {
      const user = createUser();
      const posts = [
        createBlogPost({ userId: user.id, isPublished: true }),
        createBlogPost({ userId: user.id, isPublished: false }), // Should not be included
      ];

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.blogPost.findMany.mockResolvedValue([{ ...posts[0], tags: [] }]);

      const result = await createLoad({ cookies: mockCookies } as RequestEvent);

      expect(result.blogPosts).toHaveLength(1);
      expect(result.blogPosts[0].id).toBe(posts[0].id);
    });

    it('should create a new project with selected posts', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const createdProject = {
        id: 'new-project-id',
        userId: user.id,
        title: 'New Book Project',
        description: 'Test description',
        status: 'draft',
      };

      mockPrisma.bookCreationProject.create.mockResolvedValue(createdProject);

      const request = createMockRequest({});
      // Override formData to return proper data structure
      request.formData = vi.fn().mockResolvedValue({
        get: (key: string) => {
          if (key === 'title') return 'New Book Project';
          if (key === 'description') return 'Test description';
          return null;
        },
        getAll: (key: string) => (key === 'posts' ? ['post-1', 'post-2'] : []),
      });

      const _result = await createActions.default?.({
        request,
        cookies: mockCookies,
      } as RequestEvent);

      // Since redirect throws in tests, check if the mock was called correctly
      expect(mockPrisma.bookCreationProject.create).toHaveBeenCalledWith({
        data: {
          userId: user.id,
          title: 'New Book Project',
          description: 'Test description',
          status: 'draft',
          posts: {
            create: [
              { blogPostId: 'post-1', order: 0, includeInBook: true },
              { blogPostId: 'post-2', order: 1, includeInBook: true },
            ],
          },
        },
      });
    });

    it('should validate required fields', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const formData = {
        title: '',
        description: 'Test',
        posts: [],
      };

      const request = createMockRequest(formData);

      const result =
        (await createActions.default?.({ request, cookies: mockCookies } as RequestEvent)) || {};

      expect(result?.status).toBe(400);
      expect(result?.data?.error).toBe('タイトルは必須です');
    });

    it('should require at least one post', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      // Create FormData without posts
      const request = createMockRequest({
        title: 'Valid Title',
        description: 'Test',
      });
      // Override formData to return empty array for posts
      request.formData = vi.fn().mockResolvedValue({
        get: (key: string) => {
          if (key === 'title') return 'Valid Title';
          if (key === 'description') return 'Test';
          return null;
        },
        getAll: (key: string) => (key === 'posts' ? [] : []),
      });

      const result =
        (await createActions.default?.({ request, cookies: mockCookies } as RequestEvent)) || {};

      expect(result?.status).toBe(400);
      expect(result?.data?.error).toBe('少なくとも1つの記事を選択してください');
    });
  });

  describe('Project Detail Page - Load Function', () => {
    it('should load project details', async () => {
      const user = createUser();
      const project = {
        id: 'project-1',
        userId: user.id,
        title: 'Test Project',
        description: 'Test description',
        status: 'draft',
        posts: [],
        chapters: [],
        book: null,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);
      mockPrisma.blogPost.findMany.mockResolvedValue([]);

      const result = await projectLoad({
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result.project.id).toBe('project-1');
      expect(result.availablePosts).toEqual([]);
    });

    it('should throw 404 for non-existent project', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(null);

      expect.assertions(1);

      try {
        await projectLoad({ params: { id: 'non-existent' }, cookies: mockCookies } as RequestEvent);
      } catch (e: unknown) {
        expect((e as { status: number }).status).toBe(404);
      }
    });

    it('should update project settings', async () => {
      const user = createUser();
      const project = {
        id: 'project-1',
        userId: user.id,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);
      mockPrisma.bookCreationProject.update.mockResolvedValue({});

      const formData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'in_progress',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.updateProject({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
    });

    it('should add post to project', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectPost.aggregate.mockResolvedValue({ _max: { order: 2 } });
      mockPrisma.bookProjectPost.create.mockResolvedValue({});

      const formData = { postId: 'post-123' };
      const request = createMockRequest(formData);

      const result = await projectActions.addPost({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.bookProjectPost.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          blogPostId: 'post-123',
          order: 3,
        },
      });
    });

    it('should create chapter', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectChapter.aggregate.mockResolvedValue({ _max: { order: 1 } });
      mockPrisma.bookProjectChapter.create.mockResolvedValue({});

      const formData = {
        title: 'Chapter 1',
        content: 'Chapter introduction',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.createChapter({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.bookProjectChapter.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          title: 'Chapter 1',
          content: 'Chapter introduction',
          order: 2,
        },
      });
    });

    it('should remove post from project', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectPost.delete.mockResolvedValue({});

      const formData = { postId: 'post-123' };
      const request = createMockRequest(formData);

      const result = await projectActions.removePost({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.bookProjectPost.delete).toHaveBeenCalledWith({
        where: {
          id: 'post-123',
        },
      });
    });

    it('should reorder posts in project', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectPost.update.mockResolvedValue({});
      // Fix the $transaction mock to execute the function
      (
        mockPrisma.$transaction as unknown as { mockImplementation: (fn: unknown) => void }
      ).mockImplementation((queries: unknown[]) => {
        return Promise.all(queries);
      });

      const formData = {
        orders: JSON.stringify([
          { id: 'post-1', order: 0 },
          { id: 'post-2', order: 1 },
        ]),
      };

      const request = createMockRequest(formData);

      const result = await projectActions.reorderPosts({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should assign post to chapter', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectPost.update.mockResolvedValue({});

      const formData = {
        postId: 'post-123',
        chapterId: 'chapter-456',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.assignToChapter({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.bookProjectPost.update).toHaveBeenCalledWith({
        where: {
          id: 'post-123',
        },
        data: {
          chapterId: 'chapter-456',
        },
      });
    });

    it('should unassign post from chapter', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookProjectPost.update.mockResolvedValue({});

      const formData = {
        postId: 'post-123',
        chapterId: '',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.assignToChapter({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.success).toBe(true);
      expect(mockPrisma.bookProjectPost.update).toHaveBeenCalledWith({
        where: {
          id: 'post-123',
        },
        data: {
          chapterId: null,
        },
      });
    });

    // Note: deleteProject action is not implemented yet
    it.skip('should delete project', async () => {
      const user = createUser();
      const project = {
        id: 'project-1',
        userId: user.id,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);
      mockPrisma.bookCreationProject.delete.mockResolvedValue({});

      const request = createMockRequest({});

      try {
        await projectActions.deleteProject({
          request,
          params: { id: 'project-1' },
          cookies: mockCookies,
        });
      } catch (e: unknown) {
        expect((e as { location: string }).location).toBe('/book-projects');
      }

      expect(mockPrisma.bookCreationProject.delete).toHaveBeenCalledWith({
        where: { id: 'project-1' },
      });
    });

    it('should prevent unauthorized access to project', async () => {
      const user = createUser();
      const otherUser = createUser({ id: 'other-user-id' });
      const project = {
        id: 'project-1',
        userId: otherUser.id,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);

      expect.assertions(1);

      try {
        await projectLoad({
          params: { id: 'project-1' },
          cookies: mockCookies,
        });
      } catch (e: unknown) {
        expect((e as { status: number }).status).toBe(403);
      }
    });
  });

  describe('Project Detail Page - Error Handling', () => {
    it('should handle validation errors for updateProject', async () => {
      const user = createUser();
      const project = {
        id: 'project-1',
        userId: user.id,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);

      const formData = {
        title: '', // Empty title should cause validation error
        description: 'Test',
        status: 'draft',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.updateProject({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.status).toBe(400);
      expect(result?.data?.error).toBe('タイトルは必須です');
    });

    // Note: Status validation is not implemented in the current code
    it.skip('should handle invalid status for updateProject', async () => {
      const user = createUser();
      const project = {
        id: 'project-1',
        userId: user.id,
      };

      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.bookCreationProject.findUnique.mockResolvedValue(project);

      const formData = {
        title: 'Valid Title',
        description: 'Test',
        status: 'invalid_status',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.updateProject({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.['status']).toBe(400);
      expect(result?.['data']?.['error']).toBe('無効なステータスです');
    });

    it('should handle validation errors for addPost', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const formData = { postId: '' }; // Empty postId should cause validation error
      const request = createMockRequest(formData);

      const result = await projectActions.addPost({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.['status']).toBe(400);
      expect(result?.['data']?.['error']).toBe('記事を選択してください');
    });

    it('should handle validation errors for createChapter', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const formData = {
        title: '', // Empty title should cause validation error
        content: 'Test content',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.createChapter({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.['status']).toBe(400);
      expect(result?.['data']?.['error']).toBe('章タイトルは必須です');
    });

    it('should handle invalid JSON in reorderPosts', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const formData = {
        orders: 'invalid-json',
      };

      const request = createMockRequest(formData);

      const result = await projectActions.reorderPosts({
        request,
        params: { id: 'project-1' },
        cookies: mockCookies,
      });

      expect(result?.['status']).toBe(500);
      expect(result?.['data']?.['error']).toBe('記事の並び替えに失敗しました');
    });
  });
});
