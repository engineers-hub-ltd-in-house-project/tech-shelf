<script lang="ts">
  import '../app.css';
  import { auth } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  // Initialize auth state from server data
  $: if (data.user) {
    auth.setUser(data.user, null);
  } else {
    auth.clear();
  }

  // For development, we're using mock auth, so no need for Supabase listeners
  onMount(() => {
    // In production, you would enable Supabase auth listeners here
  });
</script>

<div class="min-h-screen bg-surface-50 dark:bg-surface-900">
  <header class="bg-white dark:bg-surface-800 shadow-lg">
    <nav class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-gray-800 dark:text-gray-200">Tech Shelf</a>
        </div>

        <div class="hidden lg:flex items-center space-x-8">
          <a
            href="/"
            class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >ホーム</a
          >
          <a
            href="/blog"
            class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >ブログ</a
          >
          <a
            href="/books"
            class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >電子書籍</a
          >
        </div>

        <div class="flex items-center gap-4">
          {#if $auth.user}
            <a
              href="/blog/my"
              class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >
              マイブログ
            </a>
            <a
              href="/book-projects"
              class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >
              書籍プロジェクト
            </a>
            <a
              href="/blog/create"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-surface-600 rounded-lg hover:bg-surface-700 focus:ring-4 focus:ring-gray-300 dark:bg-surface-600 dark:hover:bg-surface-700 dark:focus:ring-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新規作成
            </a>
            <a
              href="/profile"
              class="text-surface-600 dark:text-surface-300 hover:text-gray-800 dark:text-gray-200 transition-colors"
            >
              {$auth.user.name}
            </a>
            <form method="POST" action="/logout">
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-surface-600 bg-transparent border border-gray-300 rounded-lg hover:bg-surface-50 focus:ring-4 focus:ring-gray-300 dark:text-surface-300 dark:border-gray-600 dark:hover:bg-surface-700 dark:focus:ring-gray-800"
                >ログアウト</button
              >
            </form>
          {:else}
            <a
              href="/login"
              class="px-4 py-2 text-sm font-medium text-surface-600 bg-transparent border border-gray-300 rounded-lg hover:bg-surface-50 focus:ring-4 focus:ring-gray-300 dark:text-surface-300 dark:border-gray-600 dark:hover:bg-surface-700 dark:focus:ring-gray-800"
              >ログイン</a
            >
            <a
              href="/register"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
              >登録</a
            >
          {/if}
        </div>

        <button
          class="lg:hidden p-2 text-surface-600 bg-transparent border border-gray-300 rounded-lg hover:bg-surface-50 focus:ring-4 focus:ring-gray-300 dark:text-surface-300 dark:border-gray-600 dark:hover:bg-surface-700 dark:focus:ring-gray-800"
          aria-label="メニュー"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="bg-surface-100 dark:bg-surface-800 mt-auto">
    <div class="container mx-auto px-4 py-8 text-center">
      <p class="font-bold text-lg">Tech Shelf</p>
      <p class="text-surface-600 dark:text-surface-400">
        プログラミングと技術の学習プラットフォーム
      </p>
      <p class="text-sm text-surface-500 dark:text-surface-500 mt-2">
        Copyright © 2024 - All right reserved
      </p>
    </div>
  </footer>
</div>
