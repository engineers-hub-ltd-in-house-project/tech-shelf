<script lang="ts">
  import BlogCard from '$lib/components/blog/BlogCard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { posts, pagination, currentStatus } = data;
</script>

<svelte:head>
  <title>マイブログ - Tech Shelf</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-4xl font-bold">マイブログ</h1>
    <a href="/blog/create" class="btn btn-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      新規作成
    </a>
  </div>

  <!-- フィルタータブ -->
  <div class="tabs tabs-boxed mb-8">
    <a href="/blog/my" class="tab {!currentStatus ? 'tab-active' : ''}"> すべて </a>
    <a
      href="/blog/my?status=published"
      class="tab {currentStatus === 'published' ? 'tab-active' : ''}"
    >
      公開済み
    </a>
    <a href="/blog/my?status=draft" class="tab {currentStatus === 'draft' ? 'tab-active' : ''}">
      下書き
    </a>
  </div>

  <!-- 記事一覧 -->
  {#if posts.length === 0}
    <div class="text-center py-12">
      <p class="text-lg mb-4">
        {#if currentStatus === 'published'}
          公開済みの記事はありません
        {:else if currentStatus === 'draft'}
          下書きの記事はありません
        {:else}
          まだ記事を投稿していません
        {/if}
      </p>
      <a href="/blog/create" class="btn btn-primary"> 最初の記事を書く </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {#each posts as post}
        <div class="relative">
          <BlogCard {post} />

          <!-- 編集ボタンと状態表示 -->
          <div class="absolute top-2 right-2 flex gap-2">
            <a
              href="/blog/edit/{post.id}"
              class="btn btn-sm btn-circle btn-ghost bg-base-100"
              title="編集"
              aria-label="記事を編集"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </a>
          </div>

          {#if !post.isPublished}
            <div class="absolute top-2 left-2">
              <span class="badge badge-warning badge-sm">下書き</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- ページネーション -->
    {#if pagination.totalPages > 1}
      <div class="flex justify-center gap-2">
        {#if pagination.hasPrev}
          <a
            href="/blog/my?page={pagination.page - 1}{currentStatus
              ? `&status=${currentStatus}`
              : ''}"
            class="btn btn-outline"
          >
            前へ
          </a>
        {/if}

        <div class="flex items-center gap-2">
          <span class="text-sm">
            {pagination.page} / {pagination.totalPages} ページ
          </span>
        </div>

        {#if pagination.hasNext}
          <a
            href="/blog/my?page={pagination.page + 1}{currentStatus
              ? `&status=${currentStatus}`
              : ''}"
            class="btn btn-outline"
          >
            次へ
          </a>
        {/if}
      </div>
    {/if}
  {/if}
</main>

<style>
  .tabs {
    width: fit-content;
  }
</style>
