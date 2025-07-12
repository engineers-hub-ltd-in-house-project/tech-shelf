import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async ({ cookies }) => {
  const existingUser = await requireAuth(cookies);

  const projects = await prisma.bookCreationProject.findMany({
    where: {
      userId: existingUser.id,
    },
    include: {
      posts: {
        include: {
          blogPost: true,
        },
      },
      chapters: {
        orderBy: {
          order: 'asc',
        },
      },
      book: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    projects: projects.map((project) => ({
      ...project,
      postCount: project.posts.length,
      chapterCount: project.chapters.length,
      isPublished: project.book?.isPublished || false,
    })),
  };
};
