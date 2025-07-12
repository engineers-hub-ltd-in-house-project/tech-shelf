import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async ({ cookies }) => {
  const existingUser = await requireAuth(cookies);

  // Get user's published blog posts for selection
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      userId: existingUser.id,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return {
    blogPosts: blogPosts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag.name),
    })),
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const existingUser = await requireAuth(cookies);

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const description = data.get('description')?.toString().trim();
    const selectedPosts = data.getAll('posts');

    // Validation
    if (!title) {
      return fail(400, {
        error: 'タイトルは必須です',
        values: {
          title,
          description,
          selectedPosts,
        },
      });
    }

    if (selectedPosts.length === 0) {
      return fail(400, {
        error: '少なくとも1つの記事を選択してください',
        values: {
          title,
          description,
          selectedPosts,
        },
      });
    }

    try {
      // Create the project with initial posts
      const project = await prisma.bookCreationProject.create({
        data: {
          userId: existingUser.id,
          title,
          description: description || null,
          status: 'draft',
          posts: {
            create: selectedPosts.map((postId, index) => ({
              blogPostId: postId.toString(),
              order: index,
              includeInBook: true,
            })),
          },
        },
      });

      redirect(302, `/book-projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      return fail(500, {
        error: 'プロジェクトの作成に失敗しました',
        values: {
          title,
          description,
          selectedPosts,
        },
      });
    }
  },
};
