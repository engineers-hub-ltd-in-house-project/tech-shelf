<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: user = data.user;
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="h2 mb-8">プロフィール</h1>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="card p-6">
          <div class="text-center">
            {#if user?.avatar}
              <img src={user.avatar} alt={user.name} class="w-32 h-32 rounded-full mx-auto mb-4" />
            {:else}
              <div
                class="w-32 h-32 rounded-full bg-surface-300 dark:bg-surface-600 mx-auto mb-4 flex items-center justify-center"
              >
                <span class="text-4xl font-bold text-surface-600 dark:text-surface-300">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            {/if}

            <h2 class="h3 mb-2">{user?.name}</h2>
            <p class="text-surface-600 dark:text-surface-400">{user?.email}</p>

            <div class="mt-4">
              <span class="badge variant-soft-primary">
                {#if user?.role === 'admin'}
                  管理者
                {:else if user?.role === 'author'}
                  著者
                {:else}
                  読者
                {/if}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Account Settings -->
        <div class="card p-6">
          <h3 class="h4 mb-4">アカウント設定</h3>

          <form class="space-y-4">
            <label class="label">
              <span>お名前</span>
              <input type="text" value={user?.name} class="input" placeholder="山田太郎" />
            </label>

            <label class="label">
              <span>メールアドレス</span>
              <input type="email" value={user?.email} class="input" disabled />
            </label>

            <div class="flex justify-end">
              <button type="submit" class="btn variant-filled-primary"> 更新 </button>
            </div>
          </form>
        </div>

        <!-- Author Stats (for authors only) -->
        {#if user?.role === 'author' || user?.role === 'admin'}
          <div class="card p-6">
            <h3 class="h4 mb-4">著者統計</h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <p class="text-3xl font-bold text-primary-500">0</p>
                <p class="text-sm text-surface-600 dark:text-surface-400">ブログ記事</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-primary-500">0</p>
                <p class="text-sm text-surface-600 dark:text-surface-400">電子書籍</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-primary-500">0</p>
                <p class="text-sm text-surface-600 dark:text-surface-400">総売上</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-primary-500">0</p>
                <p class="text-sm text-surface-600 dark:text-surface-400">読者数</p>
              </div>
            </div>

            <div class="mt-6 flex gap-4">
              <a href="/blog/create" class="btn variant-filled-primary"> 新規記事作成 </a>
              <a href="/books/create" class="btn variant-outline-primary"> 新規書籍作成 </a>
            </div>
          </div>
        {/if}

        <!-- Purchase History -->
        <div class="card p-6">
          <h3 class="h4 mb-4">購入履歴</h3>

          {#if user?.purchasedBooks && user.purchasedBooks.length > 0}
            <div class="space-y-4">
              <!-- Purchase items would go here -->
            </div>
          {:else}
            <p class="text-surface-600 dark:text-surface-400">まだ電子書籍を購入していません。</p>
            <a href="/books" class="btn variant-filled-primary mt-4"> 電子書籍を探す </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
