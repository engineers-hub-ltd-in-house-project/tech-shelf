import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/database';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const { id } = params;

  // 認証チェック
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

  // ユーザーが実際に存在するか確認
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
    throw redirect(303, '/login');
  }

  // 記事を取得
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) {
    throw error(404, '記事が見つかりません');
  }

  // 編集権限チェック（作者本人のみ）
  if (post.userId !== existingUser.id) {
    throw error(403, 'この記事を編集する権限がありません');
  }

  return {
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
      tags: post.tags.map((t) => t.tag.name).join(', '),
    },
  };
};

export const actions: Actions = {
  default: async ({ request, params, cookies }) => {
    const { id } = params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const published = formData.get('published') === 'on';
    const uploadedImagesJson = formData.get('uploadedImages') as string;

    let uploadedImages: string[] = [];
    try {
      uploadedImages = JSON.parse(uploadedImagesJson || '[]');
    } catch {
      uploadedImages = [];
    }

    // 認証チェック
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

    // ユーザーが実際に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return fail(401, { error: 'ユーザーが見つかりません' });
    }

    // 記事の存在確認と権限チェック
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true, slug: true, publishedAt: true, isPublished: true },
    });

    if (!existingPost) {
      return fail(404, { error: '記事が見つかりません' });
    }

    if (existingPost.userId !== existingUser.id) {
      return fail(403, { error: 'この記事を編集する権限がありません' });
    }

    // バリデーション
    if (!title || !slug || !content) {
      return fail(400, { error: '必須項目を入力してください' });
    }

    // スラッグの重複チェック（自分の記事以外）
    if (slug !== existingPost.slug) {
      const duplicateSlug = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return fail(400, { error: 'このスラッグは既に使用されています' });
      }
    }

    // タグの処理
    const tagNames = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      // トランザクションで更新
      await prisma.$transaction(async (tx) => {
        // 既存のタグ関連を削除
        await tx.blogTag.deleteMany({
          where: { blogPostId: id },
        });

        // 記事を更新
        await tx.blogPost.update({
          where: { id },
          data: {
            title,
            slug,
            excerpt: excerpt || null,
            content,
            isPublished: published,
            publishedAt: published ? existingPost.publishedAt || new Date() : null,
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

        // 画像を保存し、コンテンツ内のBase64 URLを実際のURLに置換
        let updatedContent = content;

        for (const base64Image of uploadedImages) {
          // Base64データから画像情報を抽出
          const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
          if (!matches) continue;

          const mimeType = matches[1];
          const base64Data = matches[2];
          if (!mimeType || !base64Data) continue;

          const buffer = Buffer.from(base64Data, 'base64');

          // 画像をデータベースに保存
          const savedImage = await tx.blogImage.create({
            data: {
              blogPostId: id,
              filename: `image-${Date.now()}.${mimeType.split('/')[1]}`,
              mimeType,
              size: buffer.length,
              data: buffer,
            },
          });

          // コンテンツ内のBase64 URLを実際のURLに置換
          const imageUrl = `/blog/image/${savedImage.id}`;
          updatedContent = updatedContent.replace(base64Image, imageUrl);
        }

        // コンテンツを更新
        if (uploadedImages.length > 0) {
          await tx.blogPost.update({
            where: { id },
            data: { content: updatedContent },
          });
        }
      });

      // 成功時はリダイレクト
      throw redirect(303, `/blog/${slug}`);
    } catch (error) {
      // SvelteKitのリダイレクトはそのまま投げる
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        throw error;
      }
      console.error('Failed to update blog post:', error);
      return fail(500, { error: '記事の更新に失敗しました' });
    }
  },
};
