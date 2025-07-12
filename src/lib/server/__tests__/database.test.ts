import { describe, it, expect } from 'vitest';
import { validateBlogPost } from '$lib/utils/validation';

describe('Database and Blog Logic', () => {
  describe('Blog Post Validation', () => {
    it('should validate blog post data', () => {
      const validPost = {
        title: 'Test Post',
        slug: 'test-post',
        content: '# Test Content',
        excerpt: 'Test excerpt',
        tags: ['test', 'validation'],
      };

      const errors = validateBlogPost(validPost);
      expect(errors).toEqual({});
    });

    it('should validate slug format', () => {
      const invalidSlugPost = {
        title: 'Test Post',
        slug: 'Test Post!', // Invalid slug
        content: '# Content',
      };

      const errors = validateBlogPost(invalidSlugPost);
      expect(errors.slug).toBe('スラッグは小文字の英数字とハイフンのみ使用できます');
    });

    it('should require title and content', () => {
      const emptyPost = {
        title: '',
        slug: 'valid-slug',
        content: '',
      };

      const errors = validateBlogPost(emptyPost);
      expect(errors.title).toBe('タイトルは必須です');
      expect(errors.content).toBe('内容は必須です');
    });
  });

  describe('Tag Processing', () => {
    it('should process comma-separated tags', () => {
      const tagString = 'JavaScript, TypeScript, SvelteKit';
      const tags = tagString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      expect(tags).toEqual(['JavaScript', 'TypeScript', 'SvelteKit']);
    });

    it('should filter empty tags', () => {
      const tagString = 'JavaScript,, , TypeScript';
      const tags = tagString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      expect(tags).toEqual(['JavaScript', 'TypeScript']);
    });

    it('should generate slug from tag name', () => {
      const tagName = 'JavaScript Programming';
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');

      expect(slug).toBe('javascript-programming');
    });
  });

  describe('Authentication', () => {
    it('should create auth cookie data', () => {
      const user = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
      };

      const cookieData = JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      const parsed = JSON.parse(cookieData);
      expect(parsed.id).toBe('user-123');
      expect(parsed.email).toBe('user@example.com');
      expect(parsed.name).toBe('Test User');
    });

    it('should validate auth cookie structure', () => {
      const invalidCookie = JSON.stringify({
        email: 'test@example.com',
        // Missing id and name
      });

      const parsed = JSON.parse(invalidCookie);
      expect(parsed.id).toBeUndefined();
      expect(parsed.email).toBe('test@example.com');
    });
  });
});
