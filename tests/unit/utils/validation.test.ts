import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateSlug,
  validateBlogPost,
  validateBookData,
  sanitizeHtml,
} from '../../../src/lib/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.jp')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateSlug', () => {
    it('should validate correct slugs', () => {
      expect(validateSlug('valid-slug')).toBe(true);
      expect(validateSlug('123-numbers')).toBe(true);
      expect(validateSlug('lowercase-only')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(validateSlug('Invalid-Slug')).toBe(false);
      expect(validateSlug('spaces not allowed')).toBe(false);
      expect(validateSlug('special@chars')).toBe(false);
      expect(validateSlug('日本語')).toBe(false);
      expect(validateSlug('')).toBe(false);
      expect(validateSlug('-start-with-dash')).toBe(false);
      expect(validateSlug('end-with-dash-')).toBe(false);
    });
  });

  describe('validateBlogPost', () => {
    it('should validate correct blog post data', () => {
      const validPost = {
        title: 'Valid Title',
        slug: 'valid-title',
        content: '# Content\n\nThis is valid content.',
        excerpt: 'This is an excerpt',
        tags: ['tag1', 'tag2'],
      };

      const errors = validateBlogPost(validPost);
      expect(errors).toEqual({});
    });

    it('should return errors for invalid data', () => {
      const invalidPost = {
        title: '',
        slug: 'Invalid Slug!',
        content: '',
        excerpt: 'a'.repeat(201), // Too long
        tags: ['', 'valid-tag'], // Empty tag
      };

      const errors = validateBlogPost(invalidPost);

      expect(errors['title']).toBe('タイトルは必須です');
      expect(errors['slug']).toBe('スラッグは小文字の英数字とハイフンのみ使用できます');
      expect(errors['content']).toBe('内容は必須です');
      expect(errors['excerpt']).toBe('概要は200文字以内で入力してください');
      expect(errors['tags']).toBe('空のタグは使用できません');
    });

    it('should validate title length', () => {
      const longTitle = {
        title: 'a'.repeat(101),
        slug: 'valid-slug',
        content: 'Content',
      };

      const errors = validateBlogPost(longTitle);
      expect(errors['title']).toBe('タイトルは100文字以内で入力してください');
    });
  });

  describe('validateBookData', () => {
    it('should validate correct book data', () => {
      const validBook = {
        title: 'Valid Book Title',
        description: 'This is a valid description',
        price: 1000,
        author: 'Author Name',
      };

      const errors = validateBookData(validBook);
      expect(errors).toEqual({});
    });

    it('should return errors for invalid book data', () => {
      const invalidBook = {
        title: '',
        description: 'a'.repeat(1001), // Too long
        price: -100, // Negative price
        author: '',
      };

      const errors = validateBookData(invalidBook);

      expect(errors['title']).toBe('タイトルは必須です');
      expect(errors['description']).toBe('説明は1000文字以内で入力してください');
      expect(errors['price']).toBe('価格は0以上の数値を入力してください');
      expect(errors['author']).toBe('著者名は必須です');
    });

    it('should validate price as non-numeric', () => {
      const invalidPrice = {
        title: 'Title',
        description: 'Description',
        price: 'not a number' as any,
        author: 'Author',
      };

      const errors = validateBookData(invalidPrice);
      expect(errors['price']).toBe('価格は数値を入力してください');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const html = '<p>This is <strong>bold</strong> and <em>italic</em></p>';
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toBe(html);
    });

    it('should remove dangerous tags', () => {
      const dangerous = '<script>alert("XSS")</script><p>Safe content</p>';
      const sanitized = sanitizeHtml(dangerous);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    it('should remove dangerous attributes', () => {
      const dangerous = '<p onclick="alert(\'XSS\')">Click me</p>';
      const sanitized = sanitizeHtml(dangerous);

      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('<p>Click me</p>');
    });

    it('should handle empty input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null as any)).toBe('');
      expect(sanitizeHtml(undefined as any)).toBe('');
    });
  });
});
