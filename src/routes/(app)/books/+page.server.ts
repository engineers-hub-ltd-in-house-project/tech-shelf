import type { PageServerLoad } from './$types';
import { getBooks } from '$lib/server/books';
import { error } from '@sveltejs/kit';
import type { Prisma } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page')) || 1;
    const category = url.searchParams.get('category') || undefined;
    const tag = url.searchParams.get('tag') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const perPage = 12;
    const skip = (page - 1) * perPage;

    const where: Prisma.BookWhereInput = { isPublished: true };

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { author: { contains: search } },
      ];
    }

    const { books, total } = await getBooks({
      skip,
      take: perPage,
      where,
      orderBy: { publishedAt: 'desc' },
    });

    return {
      books,
      pagination: {
        total,
        perPage,
        currentPage: page,
        totalPages: Math.ceil(total / perPage),
      },
      filters: {
        category,
        tag,
        search,
      },
    };
  } catch (err) {
    console.error('Error loading books:', err);
    throw error(500, 'Failed to load books');
  }
};
