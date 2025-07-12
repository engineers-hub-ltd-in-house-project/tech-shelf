<script lang="ts">
  import type { PageData, ActionData } from './$types';
  // Removed Skeleton UI imports
  import { BookOpenIcon, DocumentCheckIcon } from '$lib/components/icons';
  import { enhance } from '$app/forms';

  export let data: PageData;
  export let form: ActionData;

  let selectedPosts = new Set<string>((form?.values?.selectedPosts as string[]) || []);
  let searchQuery = '';

  $: filteredPosts = data.blogPosts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  function togglePost(postId: string) {
    if (selectedPosts.has(postId)) {
      selectedPosts.delete(postId);
    } else {
      selectedPosts.add(postId);
    }
    selectedPosts = new Set(selectedPosts);
  }

  function selectAll() {
    filteredPosts.forEach((post) => selectedPosts.add(post.id));
    selectedPosts = new Set(selectedPosts);
  }

  function deselectAll() {
    selectedPosts.clear();
    selectedPosts = new Set(selectedPosts);
  }
</script>

<svelte:head>
  <title>新規電子書籍プロジェクト - Tech Shelf</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">新規電子書籍プロジェクト</h1>
    <p class="text-gray-600 dark:text-gray-400">ブログ記事を選択して電子書籍を作成します</p>
  </div>

  {#if form?.error}
    <div
      class="bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 p-4 rounded-lg mb-6"
    >
      {form.error}
    </div>
  {/if}

  <form method="POST" use:enhance>
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Project Details -->
      <div>
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5" />
            プロジェクト情報
          </h2>

          <div class="space-y-4">
            <label class="label">
              <span>タイトル <span class="text-error-500">*</span></span>
              <input
                type="text"
                name="title"
                value={form?.values?.title || ''}
                class="input"
                placeholder="例: プログラミング実践ガイド"
                required
              />
            </label>

            <label class="label">
              <span>説明</span>
              <textarea
                name="description"
                value={form?.values?.description || ''}
                class="textarea"
                rows="4"
                placeholder="この電子書籍の概要や目的を入力してください"
              ></textarea>
            </label>

            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p class="text-sm font-medium mb-2">選択された記事</p>
              <p class="text-2xl font-bold text-primary-500">
                {selectedPosts.size} 件
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Blog Post Selection -->
      <div>
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <DocumentCheckIcon className="w-5 h-5" />
              記事を選択
            </h2>
            <div class="flex gap-2">
              <button type="button" on:click={selectAll} class="btn btn-sm variant-ghost">
                すべて選択
              </button>
              <button type="button" on:click={deselectAll} class="btn btn-sm variant-ghost">
                選択解除
              </button>
            </div>
          </div>

          <div class="mb-4">
            <input
              type="search"
              bind:value={searchQuery}
              placeholder="記事を検索..."
              class="input"
            />
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            {#if filteredPosts.length === 0}
              <p class="text-center py-8 text-gray-600 dark:text-gray-400">
                {searchQuery ? '検索結果がありません' : '公開済みの記事がありません'}
              </p>
            {:else}
              {#each filteredPosts as post}
                <label
                  class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    name="posts"
                    value={post.id}
                    checked={selectedPosts.has(post.id)}
                    on:change={() => togglePost(post.id)}
                    class="checkbox mt-1"
                  />
                  <div class="flex-1">
                    <h3 class="font-medium">{post.title}</h3>
                    {#if post.excerpt}
                      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    {/if}
                    {#if post.tags.length > 0}
                      <div class="flex gap-2 mt-2">
                        {#each post.tags as tag}
                          <span class="badge variant-soft-primary text-xs">
                            {tag}
                          </span>
                        {/each}
                      </div>
                    {/if}
                    <time class="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                      {new Date(post.publishedAt || new Date()).toLocaleDateString('ja-JP')}
                    </time>
                  </div>
                </label>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mt-8">
      <a href="/book-projects" class="px-4 py-2 text-sm font-medium rounded-lg ghost">
        キャンセル
      </a>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
        disabled={selectedPosts.size === 0}
      >
        プロジェクトを作成
      </button>
    </div>
  </form>
</div>
