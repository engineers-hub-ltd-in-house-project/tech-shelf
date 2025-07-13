import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '$routes/(app)/book-projects/[id]/preview/+page.server';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// モック
vi.mock('$lib/server/database', () => ({
  prisma: {
    bookCreationProject: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('$lib/server/auth-helper', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@sveltejs/kit', () => ({
  error: vi.fn(),
}));

import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

describe('Book Preview Page Server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load project preview data', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockProject = {
      id: 'project-1',
      userId: 'user-1',
      title: 'My Book Project',
      description: 'A great book',
      status: 'draft',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Introduction',
          content: 'Chapter intro',
          order: 0,
          posts: [
            {
              order: 0,
              blogPost: {
                id: 'post-1',
                title: 'First Post',
                content: '# First Post\n\nContent here',
                excerpt: 'Excerpt',
              },
            },
          ],
        },
      ],
      posts: [
        {
          order: 0,
          blogPost: {
            id: 'post-2',
            title: 'Unassigned Post',
            content: 'Content',
            excerpt: null,
          },
        },
      ],
    };

    vi.mocked(requireAuth).mockResolvedValue(mockUser);
    vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject as any);

    const mockEvent = {
      params: { id: 'project-1' },
      cookies: {},
    } as unknown as RequestEvent;

    const result = await load(mockEvent);

    expect(result.project).toEqual({
      id: 'project-1',
      title: 'My Book Project',
      description: 'A great book',
      status: 'draft',
    });

    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0]).toMatchObject({
      id: 'chapter-1',
      title: 'Introduction',
      posts: [
        {
          id: 'post-1',
          title: 'First Post',
          content: '# First Post\n\nContent here',
          excerpt: 'Excerpt',
          order: 0,
        },
      ],
    });

    expect(result.unassignedPosts).toHaveLength(1);
    expect(result.unassignedPosts[0]).toMatchObject({
      id: 'post-2',
      title: 'Unassigned Post',
    });
  });

  it('should throw 404 when project not found', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };

    vi.mocked(requireAuth).mockResolvedValue(mockUser);
    vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(null);

    const mockEvent = {
      params: { id: 'nonexistent' },
      cookies: {},
    } as unknown as RequestEvent;

    await load(mockEvent);

    expect(error).toHaveBeenCalledWith(404, 'プロジェクトが見つかりません');
  });

  it('should throw 403 when user is not the owner', async () => {
    const mockUser = { id: 'user-2', email: 'other@example.com' };
    const mockProject = {
      id: 'project-1',
      userId: 'user-1',
      chapters: [],
      posts: [],
    };

    vi.mocked(requireAuth).mockResolvedValue(mockUser);
    vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject as any);

    const mockEvent = {
      params: { id: 'project-1' },
      cookies: {},
    } as unknown as RequestEvent;

    await load(mockEvent);

    expect(error).toHaveBeenCalledWith(403, 'このプロジェクトへのアクセス権限がありません');
  });
});
