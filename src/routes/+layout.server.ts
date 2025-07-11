import type { LayoutServerLoad } from './$types';
import { getUser } from '$lib/server/auth-mock'; // Use mock auth for now

export const load: LayoutServerLoad = async (event) => {
  const user = await getUser(event);

  return {
    user,
  };
};
