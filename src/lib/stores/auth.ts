import { writable, derived } from 'svelte/store';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '$lib/types/user';

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    supabaseUser: null,
    loading: true,
    error: null,
  });

  return {
    subscribe,
    setUser: (user: User | null, supabaseUser: SupabaseUser | null) => {
      update((state) => ({
        ...state,
        user,
        supabaseUser,
        loading: false,
        error: null,
      }));
    },
    setLoading: (loading: boolean) => {
      update((state) => ({ ...state, loading }));
    },
    setError: (error: string | null) => {
      update((state) => ({ ...state, error, loading: false }));
    },
    clear: () => {
      set({
        user: null,
        supabaseUser: null,
        loading: false,
        error: null,
      });
    },
  };
}

export const auth = createAuthStore();

// Derived stores for convenient access
export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
export const isLoading = derived(auth, ($auth) => $auth.loading);
export const authError = derived(auth, ($auth) => $auth.error);
