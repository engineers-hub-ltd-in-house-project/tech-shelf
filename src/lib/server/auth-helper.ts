import { redirect } from '@sveltejs/kit';
import { prisma } from './database';
import type { Cookies } from '@sveltejs/kit';

export async function requireAuth(cookies: Cookies) {
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

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
    throw redirect(303, '/login');
  }

  return existingUser;
}
