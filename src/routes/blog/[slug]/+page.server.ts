import { prisma } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  // まず公開記事を探す
  let post = await prisma.blogPost.findFirst({
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

  // 公開記事が見つからない場合、下書きも含めて検索（作者本人の場合）
  if (!post) {
    const authCookie = cookies.get('mock-auth');
    if (authCookie) {
      try {
        const user = JSON.parse(authCookie);
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // 作者本人なら下書きも表示
          post = await prisma.blogPost.findFirst({
            where: {
              slug: params.slug,
              userId: existingUser.id,
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
        }
      } catch {
        // 認証エラーは無視
      }
    }
  }

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

  // 現在のユーザーが作者かどうかチェック
  let isAuthor = false;
  const authCookie = cookies.get('mock-auth');
  if (authCookie) {
    try {
      const user = JSON.parse(authCookie);
      const currentUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (currentUser && currentUser.id === post.userId) {
        isAuthor = true;
      }
    } catch {
      // 認証エラーは無視
    }
  }

  return {
    post: {
      ...post,
      viewCount: post.viewCount + 1, // 更新後のビュー数を返す
    },
    relatedPosts,
    isAuthor,
  };
};
