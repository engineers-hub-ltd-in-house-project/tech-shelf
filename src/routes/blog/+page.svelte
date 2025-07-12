<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import BlogList from '$lib/components/blog/BlogList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { posts, tags, pagination, currentTag } = data;

  const handleTagClick = (tagSlug: string) => {
    const url = new globalThis.URL($page.url);
    if (tagSlug === currentTag) {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', tagSlug);
    }
    url.searchParams.delete('page');
    goto(url.toString());
  };

  const handlePageChange = (newPage: number) => {
    const url = new globalThis.URL($page.url);
    url.searchParams.set('page', newPage.toString());
    goto(url.toString());
  };
</script>

<svelte:head>
  <title>ブログ - Tech Shelf</title>
  <meta name="description" content="プログラミングと技術に関する記事を発信しています。" />
</svelte:head>

<main class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">ブログ</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400">
      プログラミングと技術に関する記事を発信しています。
    </p>
  </header>

  <!-- タグフィルター -->
  <section class="mb-8">
    <h2 class="text-xl font-semibold mb-4">タグで絞り込み</h2>
    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1.5 text-sm font-medium rounded-lg border {!currentTag
          ? 'text-white bg-gray-600 border-gray-600 hover:bg-gray-700'
          : 'text-gray-600 bg-transparent border-gray-600 hover:bg-gray-50'}"
        on:click={() => handleTagClick('')}
      >
        すべて
      </button>
      {#each tags as tag}
        <button
          class="px-3 py-1.5 text-sm font-medium rounded-lg border {currentTag === tag.slug
            ? 'text-white bg-gray-600 border-gray-600 hover:bg-gray-700'
            : 'text-gray-600 bg-transparent border-gray-600 hover:bg-gray-50'}"
          on:click={() => handleTagClick(tag.slug)}
        >
          {tag.name}
          <span
            class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded ml-1 dark:bg-gray-700 dark:text-gray-300"
            >{tag._count.blogPosts}</span
          >
        </button>
      {/each}
    </div>
  </section>

  <!-- ブログ記事一覧 -->
  <section class="mb-8">
    <BlogList {posts} />
  </section>

  <!-- ページネーション -->
  {#if pagination.totalPages > 1}
    <section class="flex justify-center">
      <div class="flex">
        <button
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          disabled={!pagination.hasPrev}
          on:click={() => handlePageChange(pagination.page - 1)}
        >
          «
        </button>

        {#each Array(pagination.totalPages) as _, i}
          {@const pageNum = i + 1}
          <button
            class="px-3 py-2 text-sm font-medium border {pageNum === pagination.page
              ? 'z-10 bg-gray-50 border-gray-500 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}"
            on:click={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </button>
        {/each}

        <button
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          disabled={!pagination.hasNext}
          on:click={() => handlePageChange(pagination.page + 1)}
        >
          »
        </button>
      </div>
    </section>
  {/if}
</main>
