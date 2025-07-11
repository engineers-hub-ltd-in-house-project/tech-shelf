import type { RequestEvent } from '@sveltejs/kit';
import { createSupabaseServerClient } from './supabase';
import { prisma } from './database';
import type { User } from '$lib/types/user';

export async function getUser(event: RequestEvent): Promise<User | null> {
  const supabase = createSupabaseServerClient(event);

  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    return null;
  }

  // Get or create user in our database
  let user = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  });

  if (!user) {
    // Create user if not exists
    user = await prisma.user.create({
      data: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.['full_name'] || supabaseUser.email!.split('@')[0],
        avatar: supabaseUser.user_metadata?.['avatar_url'] || null,
        role: 'reader',
      },
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar || undefined,
    role: user.role as 'reader' | 'author' | 'admin',
    providers: [],
    purchasedBooks: [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function requireAuth(event: RequestEvent): Promise<User> {
  const user = await getUser(event);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireRole(event: RequestEvent, roles: string[]): Promise<User> {
  const user = await requireAuth(event);

  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}
