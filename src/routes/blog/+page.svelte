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
    <h1 class="text-4xl font-bold text-base-content mb-4">ブログ</h1>
    <p class="text-lg text-base-content/70">プログラミングと技術に関する記事を発信しています。</p>
  </header>

  <!-- タグフィルター -->
  <section class="mb-8">
    <h2 class="text-xl font-semibold mb-4">タグで絞り込み</h2>
    <div class="flex flex-wrap gap-2">
      <button
        class="btn btn-sm"
        class:btn-primary={!currentTag}
        class:btn-outline={currentTag}
        on:click={() => handleTagClick('')}
      >
        すべて
      </button>
      {#each tags as tag}
        <button
          class="btn btn-sm"
          class:btn-primary={currentTag === tag.slug}
          class:btn-outline={currentTag !== tag.slug}
          on:click={() => handleTagClick(tag.slug)}
        >
          {tag.name}
          <span class="badge badge-sm ml-1">{tag._count.blogPosts}</span>
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
</main>
