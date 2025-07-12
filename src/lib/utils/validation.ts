export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSlug(slug: string): boolean {
  // 小文字の英数字とハイフンのみ、先頭と末尾はハイフン以外
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

interface BlogPostValidation {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
}

export function validateBlogPost(data: BlogPostValidation): Record<string, string> {
  const errors: Record<string, string> = {};

  // タイトルのバリデーション
  if (!data.title || data.title.trim() === '') {
    errors.title = 'タイトルは必須です';
  } else if (data.title.length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください';
  }

  // スラッグのバリデーション
  if (!data.slug || data.slug.trim() === '') {
    errors.slug = 'スラッグは必須です';
  } else if (!validateSlug(data.slug)) {
    errors.slug = 'スラッグは小文字の英数字とハイフンのみ使用できます';
  }

  // コンテンツのバリデーション
  if (!data.content || data.content.trim() === '') {
    errors.content = '内容は必須です';
  }

  // 概要のバリデーション
  if (data.excerpt && data.excerpt.length > 200) {
    errors.excerpt = '概要は200文字以内で入力してください';
  }

  // タグのバリデーション
  if (data.tags && data.tags.some((tag) => tag.trim() === '')) {
    errors.tags = '空のタグは使用できません';
  }

  return errors;
}

interface BookValidation {
  title: string;
  description: string;
  price: number | string;
  author: string;
}

export function validateBookData(data: BookValidation): Record<string, string> {
  const errors: Record<string, string> = {};

  // タイトルのバリデーション
  if (!data.title || data.title.trim() === '') {
    errors.title = 'タイトルは必須です';
  } else if (data.title.length > 200) {
    errors.title = 'タイトルは200文字以内で入力してください';
  }

  // 説明のバリデーション
  if (!data.description || data.description.trim() === '') {
    errors.description = '説明は必須です';
  } else if (data.description.length > 1000) {
    errors.description = '説明は1000文字以内で入力してください';
  }

  // 価格のバリデーション
  const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  if (isNaN(price)) {
    errors.price = '価格は数値を入力してください';
  } else if (price < 0) {
    errors.price = '価格は0以上の数値を入力してください';
  }

  // 著者名のバリデーション
  if (!data.author || data.author.trim() === '') {
    errors.author = '著者名は必須です';
  }

  return errors;
}

// 危険なHTMLタグやスクリプトを除去
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // 簡易的なサニタイズ（本番環境では DOMPurify などのライブラリを使用推奨）
  const _allowedTags = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'a',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ];
  const _allowedAttributes = ['href', 'title', 'target', 'rel'];

  // スクリプトタグを除去
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // イベントハンドラ属性を除去
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, ' ');

  // 危険な属性を除去
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized;
}
