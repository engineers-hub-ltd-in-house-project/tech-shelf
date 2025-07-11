<script>
  import '../app.css';
</script>

<div class="min-h-screen bg-surface-50 dark:bg-surface-900">
  <header class="bg-surface-100 dark:bg-surface-800 shadow-lg">
    <nav class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-primary-500">Tech Shelf</a>
        </div>

        <div class="hidden lg:flex items-center space-x-8">
          <a
            href="/"
            class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors"
            >ホーム</a
          >
          <a
            href="/blog"
            class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors"
            >ブログ</a
          >
          <a
            href="/books"
            class="text-surface-600 dark:text-surface-300 hover:text-primary-500 transition-colors"
            >書籍</a
          >
        </div>

        <div class="flex items-center">
          <a href="/login" class="btn variant-filled-primary">ログイン</a>
        </div>

        <button class="lg:hidden btn btn-sm variant-ghost">
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

  <footer class="bg-surface-200 dark:bg-surface-800 mt-auto">
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
