<script lang="ts">
  import BlogCard from '$lib/components/blog/BlogCard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { recentPosts, recentBooks } = data;
</script>

<svelte:head>
  <title>Tech Shelf - プログラミングと技術の学習プラットフォーム</title>
  <meta
    name="description"
    content="Rustを中心としたプログラミング技術の記事と電子書籍を提供するプラットフォーム"
  />
</svelte:head>

<!-- ヒーローセクション -->
<section class="hero min-h-screen bg-gradient-to-r from-primary to-secondary">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold text-primary-content">Tech Shelf</h1>
      <p class="py-6 text-primary-content/80">プログラミングと技術の学習プラットフォーム</p>
      <div class="space-x-4">
        <a href="/blog" class="btn btn-primary">ブログを読む</a>
        <a href="/books" class="btn btn-outline btn-primary">書籍を見る</a>
      </div>
    </div>
  </div>
</section>

<!-- 最新のブログ記事 -->
<section class="py-16 bg-base-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">最新のブログ記事</h2>
    {#if recentPosts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each recentPosts as post}
          <BlogCard {post} />
        {/each}
      </div>
      <div class="text-center mt-8">
        <a href="/blog" class="btn btn-primary">すべての記事を見る</a>
      </div>
    {:else}
      <div class="text-center">
        <p class="text-lg text-base-content/60">まだ記事がありません。</p>
      </div>
    {/if}
  </div>
</section>

<!-- 最新の書籍 -->
<section class="py-16 bg-base-200">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">最新の書籍</h2>
    {#if recentBooks.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each recentBooks as book}
          <div class="card bg-base-100 shadow-xl">
            {#if book.coverImage}
              <figure>
                <img src={book.coverImage} alt={book.title} class="w-full h-48 object-cover" />
              </figure>
            {/if}
            <div class="card-body">
              <h3 class="card-title">{book.title}</h3>
              <p class="text-base-content/70">{book.description}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                {#each book.tags as { tag }}
                  <span class="badge badge-secondary badge-sm">{tag.name}</span>
                {/each}
              </div>
              <div class="card-actions justify-end">
                <a href="/books/{book.id}" class="btn btn-primary btn-sm">詳細を見る</a>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="text-center mt-8">
        <a href="/books" class="btn btn-primary">すべての書籍を見る</a>
      </div>
    {:else}
      <div class="text-center">
        <p class="text-lg text-base-content/60">まだ書籍がありません。</p>
      </div>
    {/if}
  </div>
</section>

<!-- 特徴セクション -->
<section class="py-16 bg-base-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Tech Shelfの特徴</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div
          class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-primary-content"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">豊富な学習コンテンツ</h3>
        <p class="text-base-content/70">
          ブログ記事から体系的な電子書籍まで、様々な形式の学習コンテンツを提供
        </p>
      </div>
      <div class="text-center">
        <div
          class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-primary-content"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">実践的な内容</h3>
        <p class="text-base-content/70">現場で使える実践的な知識とスキルを身につけることができる</p>
      </div>
      <div class="text-center">
        <div
          class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-primary-content"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">コミュニティ</h3>
        <p class="text-base-content/70">同じ技術を学ぶ仲間と情報交換や議論を行うことができる</p>
      </div>
    </div>
  </div>
</section>
