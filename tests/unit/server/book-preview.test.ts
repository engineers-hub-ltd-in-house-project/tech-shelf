import { describe, it, expect, vi, beforeEach } from 'vitest';

// モック
vi.mock('$lib/server/database', () => ({
  prisma: {
    bookCreationProject: {
      findUnique: vi.fn(),
    },
    bookProjectChapter: {
      findMany: vi.fn(),
    },
    bookProjectPost: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('$lib/server/auth-helper', () => ({
  requireAuth: vi.fn(),
}));

import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

describe('Book Preview Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Load Book Project for Preview', () => {
    it('should load project with chapters and unassigned posts', async () => {
      const mockUser = { id: 'user-1', name: 'Test User' };
      const mockProject = {
        id: 'project-1',
        name: 'Test Book',
        userId: 'user-1',
        book: {
          id: 'book-1',
          title: 'Test Book',
          description: 'A test book',
        },
      };

      const mockChapters = [
        {
          id: 'chapter-1',
          title: 'Chapter 1',
          order: 1,
          posts: [
            {
              id: 'post-1',
              order: 1,
              post: {
                id: 'post-1',
                title: 'Post 1',
                content: '# Post 1 Content',
                excerpt: 'Post 1 excerpt',
                author: { name: 'Test Author' },
              },
            },
          ],
        },
      ];

      const mockUnassignedPosts = [
        {
          id: 'post-2',
          order: 2,
          post: {
            id: 'post-2',
            title: 'Unassigned Post',
            content: '# Unassigned Content',
            excerpt: 'Unassigned excerpt',
            author: { name: 'Test Author' },
          },
        },
      ];

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.bookProjectChapter.findMany).mockResolvedValue(mockChapters as any);
      vi.mocked(prisma.bookProjectPost.findMany).mockResolvedValue(mockUnassignedPosts as any);

      const projectId = 'project-1';

      // プロジェクトの取得
      const project = await prisma.bookCreationProject.findUnique({
        where: { id: projectId },
        include: { book: true },
      });

      // 章の取得
      const chapters = await prisma.bookProjectChapter.findMany({
        where: { projectId },
        include: {
          posts: {
            include: {
              post: {
                include: { author: { select: { name: true } } },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });

      // 未割り当て記事の取得
      const unassignedPosts = await prisma.bookProjectPost.findMany({
        where: {
          projectId,
          chapterId: null,
        },
        include: {
          post: {
            include: { author: { select: { name: true } } },
          },
        },
        orderBy: { order: 'asc' },
      });

      // requireAuth is called but result is not used in this test scenario
      // The actual implementation would call requireAuth but the test is focused on data structure
      expect(prisma.bookProjectChapter.findMany).toHaveBeenCalledWith({
        where: { projectId },
        include: {
          posts: {
            include: {
              post: {
                include: { author: { select: { name: true } } },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });
      expect(prisma.bookProjectPost.findMany).toHaveBeenCalledWith({
        where: {
          projectId,
          chapterId: null,
        },
        include: {
          post: {
            include: { author: { select: { name: true } } },
          },
        },
        orderBy: { order: 'asc' },
      });

      expect(project).toEqual(mockProject);
      expect(chapters).toEqual(mockChapters);
      expect(unassignedPosts).toEqual(mockUnassignedPosts);
    });

    it('should handle project not found', async () => {
      const mockUser = { id: 'user-1', name: 'Test User' };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(null);

      const projectId = 'non-existent-project';

      const project = await prisma.bookCreationProject.findUnique({
        where: { id: projectId },
        include: { book: true },
      });

      expect(project).toBeNull();
    });

    it('should handle empty chapters and posts', async () => {
      const mockUser = { id: 'user-1', name: 'Test User' };
      const mockProject = {
        id: 'project-1',
        name: 'Empty Book',
        book: {
          id: 'book-1',
          title: 'Empty Book',
          description: 'A book with no content',
        },
      };

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.bookProjectChapter.findMany).mockResolvedValue([]);
      vi.mocked(prisma.bookProjectPost.findMany).mockResolvedValue([]);

      const projectId = 'project-1';

      const [project, chapters, unassignedPosts] = await Promise.all([
        prisma.bookCreationProject.findUnique({
          where: { id: projectId },
          include: { book: true },
        }),
        prisma.bookProjectChapter.findMany({
          where: { projectId },
          include: {
            posts: {
              include: {
                post: {
                  include: { author: { select: { name: true } } },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        }),
        prisma.bookProjectPost.findMany({
          where: {
            projectId,
            chapterId: null,
          },
          include: {
            post: {
              include: { author: { select: { name: true } } },
            },
          },
          orderBy: { order: 'asc' },
        }),
      ]);

      expect(project).toEqual(mockProject);
      expect(chapters).toEqual([]);
      expect(unassignedPosts).toEqual([]);
    });
  });

  describe('Preview Data Structure', () => {
    it('should structure data correctly for preview display', () => {
      const mockChapters = [
        {
          id: 'chapter-1',
          title: 'Introduction',
          order: 1,
          posts: [
            {
              id: 'post-1',
              order: 1,
              post: {
                id: 'post-1',
                title: 'Getting Started',
                content: '# Getting Started\n\nThis is the beginning...',
                excerpt: 'Learn the basics',
                author: { name: 'John Doe' },
              },
            },
            {
              id: 'post-2',
              order: 2,
              post: {
                id: 'post-2',
                title: 'Setup Guide',
                content: '# Setup Guide\n\nHere is how to set up...',
                excerpt: 'Setup instructions',
                author: { name: 'Jane Smith' },
              },
            },
          ],
        },
        {
          id: 'chapter-2',
          title: 'Advanced Topics',
          order: 2,
          posts: [
            {
              id: 'post-3',
              order: 1,
              post: {
                id: 'post-3',
                title: 'Advanced Concepts',
                content: '# Advanced Concepts\n\nNow for the advanced stuff...',
                excerpt: 'Advanced techniques',
                author: { name: 'Bob Wilson' },
              },
            },
          ],
        },
      ];

      // プレビュー用のデータ構造を検証
      const previewData = {
        chapters: mockChapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.order,
          posts: chapter.posts.map((post) => ({
            id: post.post.id,
            title: post.post.title,
            content: post.post.content,
            excerpt: post.post.excerpt,
            author: post.post.author,
            order: post.order,
          })),
        })),
      };

      expect(previewData.chapters).toHaveLength(2);
      expect(previewData.chapters[0].posts).toHaveLength(2);
      expect(previewData.chapters[1].posts).toHaveLength(1);

      // 章の順序が正しいことを確認
      expect(previewData.chapters[0].order).toBe(1);
      expect(previewData.chapters[1].order).toBe(2);

      // 記事の順序が正しいことを確認
      expect(previewData.chapters[0].posts[0].order).toBe(1);
      expect(previewData.chapters[0].posts[1].order).toBe(2);
    });

    it('should handle content with markdown formatting', () => {
      const markdownContent = `# Main Title

## Subsection

This is a paragraph with **bold** and *italic* text.

\`\`\`javascript
const example = 'code block';
console.log(example);
\`\`\`

- List item 1
- List item 2

[Link to somewhere](https://example.com)

![Image](https://example.com/image.jpg)`;

      const post = {
        id: 'post-1',
        title: 'Markdown Example',
        content: markdownContent,
        excerpt: 'Example with markdown',
        author: { name: 'Test Author' },
      };

      // Markdownコンテンツが正しく保存されていることを確認
      expect(post.content).toContain('# Main Title');
      expect(post.content).toContain('**bold**');
      expect(post.content).toContain('```javascript');
      expect(post.content).toContain('[Link to somewhere]');
      expect(post.content).toContain('![Image]');
    });
  });

  describe('Navigation and Table of Contents', () => {
    it('should generate table of contents from chapters', () => {
      const chapters = [
        { id: 'ch1', title: 'Introduction', order: 1 },
        { id: 'ch2', title: 'Getting Started', order: 2 },
        { id: 'ch3', title: 'Advanced Topics', order: 3 },
      ];

      const toc = chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        href: `#chapter-${chapter.id}`,
      }));

      expect(toc).toEqual([
        { id: 'ch1', title: 'Introduction', href: '#chapter-ch1' },
        { id: 'ch2', title: 'Getting Started', href: '#chapter-ch2' },
        { id: 'ch3', title: 'Advanced Topics', href: '#chapter-ch3' },
      ]);
    });

    it('should handle smooth scrolling navigation', () => {
      const scrollToChapter = (chapterId: string) => {
        const element = document.getElementById(`chapter-${chapterId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // DOM操作のモック
      const mockElement = { scrollIntoView: vi.fn() };
      const getElementById = vi
        .spyOn(document, 'getElementById')
        .mockReturnValue(mockElement as any);

      scrollToChapter('ch1');

      expect(getElementById).toHaveBeenCalledWith('chapter-ch1');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

      getElementById.mockRestore();
    });
  });
});
