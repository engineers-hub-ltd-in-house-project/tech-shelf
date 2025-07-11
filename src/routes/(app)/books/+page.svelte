<script lang="ts">
  import type { PageData } from './$types';
  import BookCard from '$lib/components/books/BookCard.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data: PageData;

  const categories = [
    { value: '', label: 'すべて' },
    { value: 'programming', label: 'プログラミング' },
    { value: 'web', label: 'Web開発' },
    { value: 'mobile', label: 'モバイル開発' },
    { value: 'ai', label: 'AI・機械学習' },
    { value: 'security', label: 'セキュリティ' },
    { value: 'database', label: 'データベース' },
    { value: 'devops', label: 'DevOps' },
    { value: 'other', label: 'その他' },
  ];

  let searchQuery = data.filters.search || '';

  function handleCategoryChange(category: string) {
    const url = new URL($page.url);
    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }
    url.searchParams.delete('page');
    goto(url.toString());
  }

  function handleSearch() {
    const url = new URL($page.url);
    if (searchQuery) {
      url.searchParams.set('search', searchQuery);
    } else {
      url.searchParams.delete('search');
    }
    url.searchParams.delete('page');
    goto(url.toString());
  }

  function goToPage(pageNum: number) {
    const url = new URL($page.url);
    url.searchParams.set('page', pageNum.toString());
    goto(url.toString());
  }
</script>

<svelte:head>
  <title>電子書籍一覧 - Tech Shelf</title>
  <meta name="description" content="プログラミングやWeb開発に関する電子書籍を探す" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="space-y-8">
    <!-- Header -->
    <header class="space-y-4">
      <h1 class="h1">電子書籍</h1>
      <p class="text-xl opacity-75">プログラミングやWeb開発に関する書籍をお探しください</p>
    </header>

    <!-- Filters -->
    <div class="card p-4 space-y-4">
      <!-- Search -->
      <form on:submit|preventDefault={handleSearch} class="flex gap-2">
        <input
          type="search"
          bind:value={searchQuery}
          placeholder="タイトル、著者、説明で検索..."
          class="input flex-1"
        />
        <button type="submit" class="btn variant-filled-primary"> 検索 </button>
      </form>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2">
        {#each categories as category}
          <button
            type="button"
            class="btn btn-sm {data.filters.category === category.value
              ? 'variant-filled'
              : 'variant-soft'}"
            on:click={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </button>
        {/each}
      </div>

      <!-- Active Filters -->
      {#if data.filters.tag || data.filters.search}
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm opacity-75">絞り込み:</span>
          {#if data.filters.tag}
            <a href="/books" class="badge variant-filled-surface">
              タグ: {data.filters.tag} ✕
            </a>
          {/if}
          {#if data.filters.search}
            <a href="/books" class="badge variant-filled-surface">
              検索: {data.filters.search} ✕
            </a>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Results Count -->
    <div class="text-sm opacity-75">
      {data.pagination.total}件の書籍が見つかりました
    </div>

    <!-- Books Grid -->
    {#if data.books.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each data.books as book}
          <BookCard {book} />
        {/each}
      </div>

      <!-- Pagination -->
      {#if data.pagination.totalPages > 1}
        <nav class="flex justify-center items-center gap-2">
          <button
            type="button"
            class="btn variant-soft"
            disabled={data.pagination.currentPage === 1}
            on:click={() => goToPage(data.pagination.currentPage - 1)}
          >
            前へ
          </button>

          <div class="flex gap-1">
            {#each Array(data.pagination.totalPages) as _, i}
              {#if i + 1 === 1 || i + 1 === data.pagination.totalPages || Math.abs(i + 1 - data.pagination.currentPage) <= 2}
                <button
                  type="button"
                  class="btn btn-sm {i + 1 === data.pagination.currentPage
                    ? 'variant-filled'
                    : 'variant-soft'}"
                  on:click={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              {:else if Math.abs(i + 1 - data.pagination.currentPage) === 3}
                <span class="px-2">...</span>
              {/if}
            {/each}
          </div>

          <button
            type="button"
            class="btn variant-soft"
            disabled={data.pagination.currentPage === data.pagination.totalPages}
            on:click={() => goToPage(data.pagination.currentPage + 1)}
          >
            次へ
          </button>
        </nav>
      {/if}
    {:else}
      <div class="card p-8 text-center">
        <p class="text-lg opacity-75">
          {#if data.filters.search || data.filters.category || data.filters.tag}
            条件に一致する書籍が見つかりませんでした
          {:else}
            まだ書籍が登録されていません
          {/if}
        </p>
      </div>
    {/if}
  </div>
</div>
