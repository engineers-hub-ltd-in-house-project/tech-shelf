import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const published = formData.get('published') === 'on';

    // 認証チェック（モック認証）
    const authCookie = cookies.get('mock-auth');
    if (!authCookie) {
      return fail(401, { error: 'ログインが必要です' });
    }

    let user;
    try {
      user = JSON.parse(authCookie);
    } catch {
      return fail(401, { error: '無効なセッションです' });
    }

    if (!user.id) {
      return fail(401, { error: 'ログインが必要です' });
    }

    // ユーザーが実際に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return fail(401, { error: 'ユーザーが見つかりません' });
    }

    // バリデーション
    if (!title || !slug || !content) {
      return fail(400, { error: '必須項目を入力してください' });
    }

    // スラッグの重複チェック
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return fail(400, { error: 'このスラッグは既に使用されています' });
    }

    // タグの処理
    const tagNames = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      // 記事作成
      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt: excerpt || null,
          content,
          isPublished: published,
          publishedAt: published ? new Date() : null,
          userId: existingUser.id,
          tags: {
            create: tagNames.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: {
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                  },
                },
              },
            })),
          },
        },
      });

      // 成功時はリダイレクト
      throw redirect(303, `/blog/${post.slug}`);
    } catch (error) {
      // SvelteKitのリダイレクトはそのまま投げる
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        throw error;
      }
      console.error('Failed to create blog post:', error);
      return fail(500, { error: '記事の作成に失敗しました' });
    }
  },
};
