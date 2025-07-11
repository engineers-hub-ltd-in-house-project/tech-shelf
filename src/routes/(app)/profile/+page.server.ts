import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth-mock';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  try {
    const user = await requireAuth(event);
    return {
      user,
    };
  } catch {
    // Redirect to login if not authenticated
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
  }
};
