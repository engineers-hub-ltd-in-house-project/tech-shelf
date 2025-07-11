import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '$lib/types/user';

// Mock implementation for development without real Supabase
export async function getUser(event: RequestEvent): Promise<User | null> {
  // Check for mock auth cookie
  const mockAuth = event.cookies.get('mock-auth');

  if (!mockAuth) {
    return null;
  }

  try {
    const userData = JSON.parse(mockAuth);
    return userData;
  } catch {
    return null;
  }
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
