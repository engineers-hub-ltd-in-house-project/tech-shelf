import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseServerClient(event: RequestEvent) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, {
          path: options?.path || '/',
          secure: true,
          sameSite: 'lax',
          httpOnly: true,
          maxAge: options?.maxAge,
        });
      },
      remove: (key, options) => {
        event.cookies.delete(key, {
          path: options?.path || '/',
        });
      },
    },
  });
}
