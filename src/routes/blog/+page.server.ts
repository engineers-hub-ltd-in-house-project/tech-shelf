import { prisma } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;
  const tag = url.searchParams.get('tag');

  const where = {
    isPublished: true,
    ...(tag && {
      tags: {
        some: {
          tag: {
            slug: tag,
          },
        },
      },
    }),
  };

  const [posts, totalCount, tags] = await Promise.all([
    prisma.blogPost.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
    prisma.tag.findMany({
      where: {
        blogPosts: {
          some: {
            blogPost: {
              isPublished: true,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                blogPost: {
                  isPublished: true,
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts,
    tags,
    pagination: {
      page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    currentTag: tag,
  };
};
