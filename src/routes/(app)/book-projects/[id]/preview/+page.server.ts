import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const user = await requireAuth(cookies);
  const { id } = params;

  const project = await prisma.bookCreationProject.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          posts: {
            orderBy: { order: 'asc' },
            include: {
              blogPost: true,
            },
          },
        },
      },
      posts: {
        where: {
          chapterId: null,
          includeInBook: true,
        },
        orderBy: { order: 'asc' },
        include: {
          blogPost: true,
        },
      },
    },
  });

  if (!project) {
    throw error(404, 'プロジェクトが見つかりません');
  }

  if (project.userId !== user.id) {
    throw error(403, 'このプロジェクトへのアクセス権限がありません');
  }

  // 章構成を整形
  const chapters = project.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    content: chapter.content,
    order: chapter.order,
    posts: chapter.posts.map((post) => ({
      id: post.blogPost.id,
      title: post.blogPost.title,
      content: post.blogPost.content,
      excerpt: post.blogPost.excerpt,
      order: post.order,
    })),
  }));

  // 章に割り当てられていない記事
  const unassignedPosts = project.posts.map((post) => ({
    id: post.blogPost.id,
    title: post.blogPost.title,
    content: post.blogPost.content,
    excerpt: post.blogPost.excerpt,
    order: post.order,
  }));

  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
    },
    chapters,
    unassignedPosts,
  };
};
