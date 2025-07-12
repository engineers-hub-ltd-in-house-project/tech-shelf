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
<section
  class="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center"
>
  <div class="text-center px-4">
    <h1 class="text-5xl font-bold text-white mb-6">Tech Shelf</h1>
    <p class="text-xl text-white/90 mb-8">プログラミングと技術の学習プラットフォーム</p>
    <div class="flex gap-4 justify-center">
      <a
        href="/blog"
        class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300"
        >ブログを読む</a
      >
      <a
        href="/books"
        class="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-600 focus:ring-4 focus:ring-gray-300"
        >書籍を見る</a
      >
    </div>
  </div>
</section>

<!-- 最新のブログ記事 -->
<section class="py-16 bg-surface-50 dark:bg-surface-900">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">最新のブログ記事</h2>
    {#if recentPosts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each recentPosts as post}
          <BlogCard {post} />
        {/each}
      </div>
      <div class="text-center mt-8">
        <a
          href="/blog"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300"
          >すべての記事を見る</a
        >
      </div>
    {:else}
      <div class="text-center">
        <p class="text-lg text-surface-600 dark:text-surface-400">まだ記事がありません。</p>
      </div>
    {/if}
  </div>
</section>

<!-- 最新の書籍 -->
<section class="py-16 bg-surface-100 dark:bg-surface-800">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">最新の書籍</h2>
    {#if recentBooks.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each recentBooks as book}
          <div class="bg-white dark:bg-surface-800 shadow-lg rounded-lg">
            {#if book.coverImage}
              <header>
                <img src={book.coverImage} alt={book.title} class="w-full h-48 object-cover" />
              </header>
            {/if}
            <div class="p-4 space-y-4">
              <h3 class="text-lg font-bold">{book.title}</h3>
              <p class="text-surface-600 dark:text-surface-400">{book.description}</p>
              <div class="flex flex-wrap gap-2">
                {#each book.tags as { tag }}
                  <span
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-surface-600 bg-surface-100 rounded dark:bg-surface-700 dark:text-surface-300"
                    >{tag.name}</span
                  >
                {/each}
              </div>
              <div class="flex justify-end">
                <a
                  href="/books/{book.id}"
                  class="px-3 py-1.5 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300"
                  >詳細を見る</a
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="text-center mt-8">
        <a
          href="/books"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300"
          >すべての書籍を見る</a
        >
      </div>
    {:else}
      <div class="text-center">
        <p class="text-lg text-surface-600 dark:text-surface-400">まだ書籍がありません。</p>
      </div>
    {/if}
  </div>
</section>

<!-- 特徴セクション -->
<section class="py-16 bg-surface-50 dark:bg-surface-900">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Tech Shelfの特徴</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div
          class="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">豊富な学習コンテンツ</h3>
        <p class="text-surface-600 dark:text-surface-400">
          ブログ記事から体系的な電子書籍まで、様々な形式の学習コンテンツを提供
        </p>
      </div>
      <div class="text-center">
        <div
          class="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">実践的な内容</h3>
        <p class="text-surface-600 dark:text-surface-400">
          現場で使える実践的な知識とスキルを身につけることができる
        </p>
      </div>
      <div class="text-center">
        <div
          class="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">コミュニティ</h3>
        <p class="text-surface-600 dark:text-surface-400">
          同じ技術を学ぶ仲間と情報交換や議論を行うことができる
        </p>
      </div>
    </div>
  </div>
</section>
