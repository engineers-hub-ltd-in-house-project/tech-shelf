import { prisma } from '$lib/server/database';
import type { Book, Chapter, Prisma } from '@prisma/client';

export interface BookWithDetails extends Book {
  chapterCount: number;
  authorUser: {
    name: string;
    avatar: string | null;
  };
  tags: string[];
}

export interface BookWithChapters extends BookWithDetails {
  chapters: Chapter[];
}

export async function getBooks(
  options: {
    skip?: number;
    take?: number;
    where?: Prisma.BookWhereInput;
    orderBy?: Prisma.BookOrderByWithRelationInput;
  } = {}
): Promise<{ books: BookWithDetails[]; total: number }> {
  const {
    skip = 0,
    take = 12,
    where = { isPublished: true },
    orderBy = { publishedAt: 'desc' },
  } = options;

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        authorUser: {
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
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  return {
    books: books.map((book) => ({
      ...book,
      chapterCount: book._count.chapters,
      tags: book.tags.map((t) => t.tag.name),
    })),
    total,
  };
}

export async function getBookById(id: string): Promise<BookWithDetails | null> {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      authorUser: {
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
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  if (!book) return null;

  return {
    ...book,
    chapterCount: book._count.chapters,
    tags: book.tags.map((t) => t.tag.name),
  };
}

export async function getBooksByTag(tag: string, skip = 0, take = 12) {
  return getBooks({
    skip,
    take,
    where: {
      isPublished: true,
      tags: {
        some: {
          tag: {
            name: tag,
          },
        },
      },
    },
  });
}

export async function getBooksByCategory(category: string, skip = 0, take = 12) {
  return getBooks({
    skip,
    take,
    where: {
      isPublished: true,
      category,
    },
  });
}

export async function searchBooks(query: string, skip = 0, take = 12) {
  return getBooks({
    skip,
    take,
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { author: { contains: query } },
      ],
    },
  });
}

export async function getBookWithChapters(id: string): Promise<BookWithChapters | null> {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      authorUser: {
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
      chapters: {
        orderBy: [{ partNumber: 'asc' }, { order: 'asc' }],
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  if (!book) return null;

  return {
    ...book,
    chapterCount: book._count.chapters,
    tags: book.tags.map((t) => t.tag.name),
  };
}

export async function getRelatedBooks(
  bookId: string,
  tags: string[],
  limit = 4
): Promise<BookWithDetails[]> {
  const { books } = await getBooks({
    take: limit,
    where: {
      id: { not: bookId },
      isPublished: true,
      tags: {
        some: {
          tag: {
            name: {
              in: tags,
            },
          },
        },
      },
    },
  });

  return books;
}
