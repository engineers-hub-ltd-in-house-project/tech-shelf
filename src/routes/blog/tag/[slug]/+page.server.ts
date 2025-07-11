import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  });

  if (!tag) {
    throw error(404, 'タグが見つかりません');
  }

  const where = {
    isPublished: true,
    tags: {
      some: {
        tagId: tag.id,
      },
    },
  };

  const [posts, totalCount] = await Promise.all([
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
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    tag,
    posts,
    pagination: {
      page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
