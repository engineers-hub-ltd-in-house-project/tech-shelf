import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/types/user';

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const email = data.get('email') as string | null;
    const password = data.get('password') as string | null;

    // Mock authentication for development
    if (email && password) {
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        name: email.split('@')[0] || 'User',
        avatar: undefined,
        role: 'author',
        providers: [],
        purchasedBooks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Set mock auth cookie
      cookies.set('mock-auth', JSON.stringify(mockUser), {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      const redirectTo = url.searchParams.get('redirectTo') || '/';
      throw redirect(303, redirectTo);
    }

    return {
      error: 'Invalid credentials',
    };
  },
};
