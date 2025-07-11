import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/types/user';
import { prisma } from '$lib/server/database';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const passwordConfirm = data.get('passwordConfirm') as string;
    const name = data.get('name') as string;

    // Validate input
    if (!email || !password || !name) {
      return {
        error: '必須項目を入力してください',
      };
    }

    if (password !== passwordConfirm) {
      return {
        error: 'パスワードが一致しません',
      };
    }

    if (password.length < 8) {
      return {
        error: 'パスワードは8文字以上で入力してください',
      };
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          error: 'このメールアドレスは既に登録されています',
        };
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      const mockUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar ? user.avatar : undefined,
        role: 'reader',
        providers: [],
        purchasedBooks: [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Set mock auth cookie
      cookies.set('mock-auth', JSON.stringify(mockUser), {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      throw redirect(303, '/');
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      return {
        error: '登録に失敗しました',
      };
    }
  },
};
