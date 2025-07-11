<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import BlogList from '$lib/components/blog/BlogList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { tag, posts, pagination } = data;

  const handlePageChange = (newPage: number) => {
    const url = new globalThis.URL($page.url);
    url.searchParams.set('page', newPage.toString());
    goto(url.toString());
  };
</script>

<svelte:head>
  <title>{tag.name} - ブログ - Tech Shelf</title>
  <meta name="description" content="{tag.name}に関する記事一覧" />
</svelte:head>

<main class="container mx-auto px-4 py-8">
  <!-- パンくずナビ -->
  <nav class="breadcrumbs text-sm mb-6">
    <ul>
      <li><a href="/" class="text-primary hover:underline">ホーム</a></li>
      <li><a href="/blog" class="text-primary hover:underline">ブログ</a></li>
      <li>{tag.name}</li>
    </ul>
  </nav>

  <header class="mb-8">
    <h1 class="text-4xl font-bold text-base-content mb-4">
      <span class="badge badge-primary badge-lg mr-2">{tag.name}</span>
      の記事
    </h1>
    <p class="text-lg text-base-content/70">
      {pagination.totalCount}件の記事があります
    </p>
  </header>

  <!-- ブログ記事一覧 -->
  <section class="mb-8">
    <BlogList {posts} />
  </section>

  <!-- ページネーション -->
  {#if pagination.totalPages > 1}
    <section class="flex justify-center">
      <div class="join">
        <button
          class="join-item btn"
          class:btn-disabled={!pagination.hasPrev}
          on:click={() => handlePageChange(pagination.page - 1)}
        >
          «
        </button>

        {#each Array(pagination.totalPages) as _, i}
          {@const pageNum = i + 1}
          <button
            class="join-item btn"
            class:btn-active={pageNum === pagination.page}
            on:click={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </button>
        {/each}

        <button
          class="join-item btn"
          class:btn-disabled={!pagination.hasNext}
          on:click={() => handlePageChange(pagination.page + 1)}
        >
          »
        </button>
      </div>
    </section>
  {/if}

  <!-- ブログ一覧に戻る -->
  <section class="text-center mt-8">
    <a href="/blog" class="btn btn-outline btn-primary"> ← ブログ一覧に戻る </a>
  </section>
</main>
