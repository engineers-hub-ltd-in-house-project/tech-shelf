import type { User, BlogPost, Book, Chapter, Tag } from '@prisma/client';

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  role: 'author',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'test-post-id',
  userId: 'test-user-id',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  content: '# Test Content\n\nThis is a test blog post.',
  excerpt: 'This is a test blog post.',
  coverImage: null,
  isPublished: false,
  publishedAt: null,
  viewCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'test-book-id',
  title: 'Test Book',
  author: 'Test Author',
  description: 'This is a test book.',
  coverImage: null,
  price: 1000,
  currency: 'JPY',
  language: 'ja',
  category: 'web-development',
  difficulty: 'intermediate',
  isPublished: true,
  publishedAt: new Date(),
  authorId: 'test-user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createChapter = (overrides: Partial<Chapter> = {}): Chapter => ({
  id: 'test-chapter-id',
  bookId: 'test-book-id',
  title: 'Chapter 1: Introduction',
  content: '# Introduction\n\nThis is the first chapter.',
  order: 1,
  wordCount: 100,
  estimatedReadingTime: 1,
  partNumber: 1,
  slug: 'chapter-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTag = (overrides: Partial<Tag> = {}): Tag => ({
  id: 'test-tag-id',
  name: 'Test Tag',
  slug: 'test-tag',
  ...overrides,
});

// Helper to create blog post with relations
type BlogPostRelationsOverrides = {
  id?: string;
  author?: Partial<User>;
  tags?: Tag[];
};

export const createBlogPostWithRelations = (overrides: BlogPostRelationsOverrides = {}) => {
  const user = createUser(overrides.author || {});
  const tags = overrides.tags || [createTag()];

  return {
    ...createBlogPost(overrides),
    author: user,
    tags: tags.map((tag: Tag) => ({
      blogPostId: overrides.id || 'test-post-id',
      tagId: tag.id,
      tag,
    })),
  };
};

// Mock data for authentication
export const mockAuthCookie = (user: Partial<User> = {}) => {
  const userData = createUser(user);
  return JSON.stringify({
    id: userData.id,
    email: userData.email,
    name: userData.name,
  });
};
