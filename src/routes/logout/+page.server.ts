import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ cookies }) => {
    // Clear mock auth cookie
    cookies.delete('mock-auth', { path: '/' });

    throw redirect(303, '/');
  },
};
