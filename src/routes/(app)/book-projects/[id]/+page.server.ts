import type { PageServerLoad, Actions } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const existingUser = await requireAuth(cookies);

  const project = await prisma.bookCreationProject.findUnique({
    where: { id: params.id },
    include: {
      posts: {
        include: {
          blogPost: {
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          chapter: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      chapters: {
        include: {
          posts: {
            include: {
              blogPost: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      book: true,
    },
  });

  if (!project) {
    error(404, 'プロジェクトが見つかりません');
  }

  if (project.userId !== existingUser.id) {
    error(403, 'このプロジェクトへのアクセス権限がありません');
  }

  // Get available blog posts for adding to project
  const availablePosts = await prisma.blogPost.findMany({
    where: {
      userId: existingUser.id,
      isPublished: true,
      NOT: {
        bookProjects: {
          some: {
            projectId: params.id,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
    },
  });

  return {
    project: {
      ...project,
      posts: project.posts.map((p) => ({
        ...p,
        blogPost: {
          ...p.blogPost,
          tags: p.blogPost.tags.map((t) => t.tag.name),
        },
      })),
    },
    availablePosts,
  };
};

export const actions: Actions = {
  updateProject: async ({ request, params, cookies }) => {
    const user = await requireAuth(cookies);

    const project = await prisma.bookCreationProject.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return fail(404, { error: 'プロジェクトが見つかりません' });
    }

    if (project.userId !== user.id) {
      return fail(403, { error: 'アクセス権限がありません' });
    }

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const description = data.get('description')?.toString().trim();
    const status = data.get('status')?.toString();

    if (!title) {
      return fail(400, { error: 'タイトルは必須です' });
    }

    try {
      await prisma.bookCreationProject.update({
        where: { id: params.id },
        data: {
          title,
          ...(description && { description }),
          status: status || 'draft',
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to update project:', error);
      return fail(500, { error: 'プロジェクトの更新に失敗しました' });
    }
  },

  addPost: async ({ request, params, cookies }) => {
    await requireAuth(cookies); // TODO: 後でuser変数を使用する権限チェック実装予定

    const data = await request.formData();
    const postId = data.get('postId')?.toString();

    if (!postId) {
      return fail(400, { error: '記事を選択してください' });
    }

    const maxOrder = await prisma.bookProjectPost.aggregate({
      where: { projectId: params.id },
      _max: { order: true },
    });

    try {
      await prisma.bookProjectPost.create({
        data: {
          projectId: params.id,
          blogPostId: postId,
          order: (maxOrder._max.order || 0) + 1,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to add post:', error);
      return fail(500, { error: '記事の追加に失敗しました' });
    }
  },

  removePost: async ({ request, cookies }) => {
    const authCookie = cookies.get('mock-auth');
    if (!authCookie) redirect(302, '/login');

    const data = await request.formData();
    const postId = data.get('postId')?.toString();

    if (!postId) {
      return fail(400, { error: '記事IDが不正です' });
    }

    try {
      await prisma.bookProjectPost.delete({
        where: {
          id: postId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to remove post:', error);
      return fail(500, { error: '記事の削除に失敗しました' });
    }
  },

  reorderPosts: async ({ request, cookies }) => {
    const authCookie = cookies.get('mock-auth');
    if (!authCookie) redirect(302, '/login');

    const data = await request.formData();
    const orders = data.get('orders')?.toString();

    if (!orders) {
      return fail(400, { error: '順序データが不正です' });
    }

    try {
      const orderData = JSON.parse(orders) as { id: string; order: number }[];

      await prisma.$transaction(
        orderData.map((item) =>
          prisma.bookProjectPost.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to reorder posts:', error);
      return fail(500, { error: '記事の並び替えに失敗しました' });
    }
  },

  createChapter: async ({ request, params, cookies }) => {
    const authCookie = cookies.get('mock-auth');
    if (!authCookie) redirect(302, '/login');

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const content = data.get('content')?.toString().trim();

    if (!title) {
      return fail(400, { error: '章タイトルは必須です' });
    }

    const maxOrder = await prisma.bookProjectChapter.aggregate({
      where: { projectId: params.id },
      _max: { order: true },
    });

    try {
      await prisma.bookProjectChapter.create({
        data: {
          projectId: params.id,
          title,
          content: content || null,
          order: (maxOrder._max.order || 0) + 1,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to create chapter:', error);
      return fail(500, { error: '章の作成に失敗しました' });
    }
  },

  assignToChapter: async ({ request, cookies }) => {
    const authCookie = cookies.get('mock-auth');
    if (!authCookie) redirect(302, '/login');

    const data = await request.formData();
    const postId = data.get('postId')?.toString();
    const chapterId = data.get('chapterId')?.toString();

    if (!postId) {
      return fail(400, { error: '記事IDが不正です' });
    }

    try {
      await prisma.bookProjectPost.update({
        where: { id: postId },
        data: { chapterId: chapterId || null },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to assign to chapter:', error);
      return fail(500, { error: '章への割り当てに失敗しました' });
    }
  },
};
