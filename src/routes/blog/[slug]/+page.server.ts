import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug: params.slug,
      isPublished: true,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!post) {
    throw error(404, 'ブログ記事が見つかりません');
  }

  // ビュー数を増やす
  await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  // 関連記事を取得
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      isPublished: true,
      tags: {
        some: {
          tagId: {
            in: post.tags.map((t) => t.tagId),
          },
        },
      },
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
  });

  return {
    post: {
      ...post,
      viewCount: post.viewCount + 1, // 更新後のビュー数を返す
    },
    relatedPosts,
  };
};
