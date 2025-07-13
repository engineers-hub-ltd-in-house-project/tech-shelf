import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/database';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const type = url.searchParams.get('type') || 'all';

  if (!query) {
    return {
      query: '',
      type,
      blogPosts: [],
      books: [],
    };
  }

  // 検索条件を準備
  const searchConditions = {
    OR: [
      { title: { contains: query } },
      { content: { contains: query } },
      { excerpt: { contains: query } },
    ],
  };

  // ブログ記事の検索
  let blogPosts: any[] = [];
  if (type === 'all' || type === 'blog') {
    blogPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        ...searchConditions,
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });
  }

  // 書籍の検索
  let books: any[] = [];
  if (type === 'all' || type === 'book') {
    books = await prisma.book.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { author: { contains: query } },
        ],
      },
      include: {
        chapters: {
          select: {
            id: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });
  }

  // タグでの検索も追加
  if (type === 'all' || type === 'blog') {
    const taggedPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        tags: {
          some: {
            tag: {
              name: { contains: query },
            },
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });

    // 重複を除去してマージ
    const postIds = new Set(blogPosts.map((p) => p.id));
    taggedPosts.forEach((post) => {
      if (!postIds.has(post.id)) {
        blogPosts.push(post);
      }
    });
  }

  if (type === 'all' || type === 'book') {
    const taggedBooks = await prisma.book.findMany({
      where: {
        isPublished: true,
        tags: {
          some: {
            tag: {
              name: { contains: query },
            },
          },
        },
      },
      include: {
        chapters: {
          select: {
            id: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });

    // 重複を除去してマージ
    const bookIds = new Set(books.map((b) => b.id));
    taggedBooks.forEach((book) => {
      if (!bookIds.has(book.id)) {
        books.push(book);
      }
    });
  }

  return {
    query,
    type,
    blogPosts: blogPosts.map((post) => ({
      ...post,
      tags: post.tags, // BlogCardが期待する形式をそのまま渡す
    })),
    books: books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
      price: book.price,
      chapterCount: book.chapters.length,
      tags: book.tags.map((t: any) => t.tag),
    })),
  };
};
