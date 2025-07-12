import { prisma } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const authCookie = cookies.get('mock-auth');
  if (!authCookie) {
    throw redirect(303, '/login');
  }

  let user;
  try {
    user = JSON.parse(authCookie);
  } catch {
    throw redirect(303, '/login');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
    throw redirect(303, '/login');
  }

  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;
  const status = url.searchParams.get('status'); // 'published', 'draft', or null for all

  const where = {
    userId: existingUser.id,
    ...(status === 'published' && { isPublished: true }),
    ...(status === 'draft' && { isPublished: false }),
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
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts,
    pagination: {
      page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    currentStatus: status,
    user: existingUser,
  };
};
