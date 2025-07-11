import { redirect } from '@sveltejs/kit';

export function requireAuth(url: URL) {
  if (!url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
}
