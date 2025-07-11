import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const [recentPosts, recentBooks] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    }),
    prisma.book.findMany({
      where: {
        isPublished: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    }),
  ]);

  return {
    recentPosts,
    recentBooks,
  };
};
