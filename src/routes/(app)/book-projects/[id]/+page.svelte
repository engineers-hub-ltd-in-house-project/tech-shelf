<script lang="ts">
  import type { PageData, ActionData } from './$types';
  // Removed Skeleton UI imports - using plain HTML/CSS
  import {
    DocumentAddIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    FolderOpenIcon,
    CogIcon,
  } from '$lib/components/icons';
  import { enhance } from '$app/forms';
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';

  export let data: PageData;
  export let form: ActionData;

  let tabSet = 0;
  let draggedPosts = data.project.posts.map((p, i) => ({ ...p, order: i }));
  let showAddPost = false;
  let showAddChapter = false;
  let selectedPostForChapter: string | null = null;

  function handleDndConsider(e: CustomEvent) {
    draggedPosts = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent) {
    draggedPosts = e.detail.items;
    // Update order values
    draggedPosts = draggedPosts.map((post, index) => ({
      ...post,
      order: index,
    }));
  }

  function getStatusOptions() {
    return [
      { value: 'draft', label: '下書き' },
      { value: 'in_progress', label: '作成中' },
      { value: 'review', label: 'レビュー中' },
      { value: 'published', label: '出版済み' },
    ];
  }

  function getChapterPosts(chapterId: string | null) {
    return draggedPosts.filter((p) => p.chapterId === chapterId);
  }
</script>

<svelte:head>
  <title>{data.project.title} - 電子書籍プロジェクト - Tech Shelf</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <div class="mb-8">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold mb-2">{data.project.title}</h1>
        {#if data.project.description}
          <p class="text-gray-600 dark:text-gray-400">
            {data.project.description}
          </p>
        {/if}
      </div>
      <div class="flex gap-2">
        {#if data.project.book}
          <a
            href="/books/{data.project.book.id}"
            class="px-4 py-2 text-sm font-medium rounded-lg ghost-success"
          >
            書籍を表示
          </a>
        {/if}
        <button class="px-4 py-2 text-sm font-medium rounded-lg filled-primary">
          書籍を生成
        </button>
      </div>
    </div>
  </div>

  {#if form?.error}
    <div
      class="bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 p-4 rounded-lg mb-6"
    >
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div
      class="bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 p-4 rounded-lg mb-6"
    >
      更新しました
    </div>
  {/if}

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex space-x-8 px-6" aria-label="Tabs">
        <button
          class="{tabSet === 0
            ? 'border-gray-500 text-gray-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          on:click={() => (tabSet = 0)}
        >
          <span class="flex items-center gap-2">
            <DocumentAddIcon className="w-4 h-4" />
            記事管理
          </span>
        </button>
        <button
          class="{tabSet === 1
            ? 'border-gray-500 text-gray-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          on:click={() => (tabSet = 1)}
        >
          <span class="flex items-center gap-2">
            <FolderOpenIcon className="w-4 h-4" />
            章構成
          </span>
        </button>
        <button
          class="{tabSet === 2
            ? 'border-gray-500 text-gray-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          on:click={() => (tabSet = 2)}
        >
          <span class="flex items-center gap-2">
            <CogIcon className="w-4 h-4" />
            設定
          </span>
        </button>
      </nav>
    </div>
    <div class="p-6">
      {#if tabSet === 0}
        <!-- Posts Management -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">記事一覧</h2>
            <button
              on:click={() => (showAddPost = !showAddPost)}
              class="btn btn-sm variant-ghost-primary"
            >
              <DocumentAddIcon className="w-4 h-4 mr-1" />
              記事を追加
            </button>
          </div>

          {#if showAddPost && data.availablePosts.length > 0}
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
              <form method="POST" action="?/addPost" use:enhance>
                <div class="flex gap-2">
                  <select name="postId" class="select flex-1" required>
                    <option value="">記事を選択...</option>
                    {#each data.availablePosts as post}
                      <option value={post.id}>{post.title}</option>
                    {/each}
                  </select>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    on:click={() => (showAddPost = false)}
                    class="px-4 py-2 text-sm font-medium rounded-lg ghost"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          {/if}

          <div class="space-y-2">
            <form method="POST" action="?/reorderPosts" use:enhance>
              <input
                type="hidden"
                name="orders"
                value={JSON.stringify(draggedPosts.map((p, i) => ({ id: p.id, order: i })))}
              />
              <div
                use:dndzone={{ items: draggedPosts, flipDurationMs: 300 }}
                on:consider={handleDndConsider}
                on:finalize={handleDndFinalize}
                class="space-y-2"
              >
                {#each draggedPosts as post (post.id)}
                  <div animate:flip={{ duration: 300 }} class="group">
                    <div
                      class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-start gap-4">
                        <div class="pt-1">
                          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                          <ChevronDownIcon className="w-5 h-5 text-gray-400 -mt-2" />
                        </div>
                        <div class="flex-1">
                          <h3 class="font-medium">{post.blogPost.title}</h3>
                          {#if post.blogPost.excerpt}
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {post.blogPost.excerpt}
                            </p>
                          {/if}
                          {#if post.chapter}
                            <div class="mt-2">
                              <span class="badge variant-soft-tertiary text-xs">
                                章: {post.chapter.title}
                              </span>
                            </div>
                          {/if}
                        </div>
                        <div
                          class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            type="button"
                            on:click={() => (selectedPostForChapter = post.id)}
                            class="btn btn-sm variant-ghost"
                            title="章に割り当て"
                          >
                            <FolderOpenIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm variant-ghost-error"
                            title="削除"
                            on:click={() => {
                              const formData = new FormData();
                              formData.append('postId', post.id);
                              fetch('?/removePost', {
                                method: 'POST',
                                body: formData,
                              }).then(() => window.location.reload());
                            }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
              {#if draggedPosts.length > 1}
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium rounded-lg ghost-primary mt-4"
                >
                  並び順を保存
                </button>
              {/if}
            </form>
          </div>
        </div>
      {:else if tabSet === 1}
        <!-- Chapter Management -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">章構成</h2>
            <button
              on:click={() => (showAddChapter = !showAddChapter)}
              class="btn btn-sm variant-ghost-primary"
            >
              <FolderOpenIcon className="w-4 h-4 mr-1" />
              章を追加
            </button>
          </div>

          {#if showAddChapter}
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
              <form method="POST" action="?/createChapter" use:enhance>
                <div class="space-y-4">
                  <label class="label">
                    <span>章タイトル</span>
                    <input
                      type="text"
                      name="title"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="第1章 はじめに"
                      required
                    />
                  </label>
                  <label class="label">
                    <span>説明（任意）</span>
                    <textarea
                      name="content"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      rows="2"
                      placeholder="この章の概要や目的"
                    ></textarea>
                  </label>
                  <div class="flex gap-2">
                    <button
                      type="submit"
                      class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
                    >
                      作成
                    </button>
                    <button
                      type="button"
                      on:click={() => (showAddChapter = false)}
                      class="px-4 py-2 text-sm font-medium rounded-lg ghost"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </form>
            </div>
          {/if}

          <div class="space-y-4">
            <!-- Unassigned posts -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h3 class="font-medium mb-3">未割り当ての記事</h3>
              <div class="space-y-2">
                {#each getChapterPosts(null) as post}
                  <div
                    class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    <span class="text-sm">{post.blogPost.title}</span>
                    <button
                      type="button"
                      on:click={() => (selectedPostForChapter = post.id)}
                      class="btn btn-sm variant-ghost"
                    >
                      章に追加
                    </button>
                  </div>
                {:else}
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    すべての記事が章に割り当てられています
                  </p>
                {/each}
              </div>
            </div>

            <!-- Chapters -->
            {#each data.project.chapters as chapter}
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-medium">{chapter.title}</h3>
                    {#if chapter.content}
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {chapter.content}
                      </p>
                    {/if}
                  </div>
                  <button class="btn btn-sm variant-ghost-error">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div class="space-y-2">
                  {#each getChapterPosts(chapter.id) as post}
                    <div
                      class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    >
                      <span class="text-sm">{post.blogPost.title}</span>
                      <button
                        type="button"
                        class="btn btn-sm variant-ghost"
                        title="章から削除"
                        on:click={() => {
                          const formData = new FormData();
                          formData.append('postId', post.id);
                          formData.append('chapterId', '');
                          fetch('?/assignToChapter', {
                            method: 'POST',
                            body: formData,
                          }).then(() => window.location.reload());
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  {:else}
                    <p class="text-sm text-gray-600 dark:text-gray-400 italic">記事がありません</p>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else if tabSet === 2}
        <!-- Project Settings -->
        <div class="mt-6">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">プロジェクト設定</h2>
            <form method="POST" action="?/updateProject" use:enhance>
              <div class="space-y-4">
                <label class="label">
                  <span>タイトル</span>
                  <input
                    type="text"
                    name="title"
                    value={data.project.title}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </label>

                <label class="label">
                  <span>説明</span>
                  <textarea
                    name="description"
                    value={data.project.description || ''}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    rows="4"
                  ></textarea>
                </label>

                <label class="label">
                  <span>ステータス</span>
                  <select
                    name="status"
                    value={data.project.status}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {#each getStatusOptions() as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </label>

                <div class="flex justify-end gap-2">
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
                  >
                    更新
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="p-6 mt-6">
            <h3 class="text-lg font-semibold mb-4 text-error-500">危険な操作</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              プロジェクトを削除すると、すべてのデータが失われます。この操作は取り消せません。
            </p>
            <button class="px-4 py-2 text-sm font-medium rounded-lg filled-error">
              プロジェクトを削除
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Chapter Assignment Modal -->
{#if selectedPostForChapter}
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full p-6">
      <h3 class="text-lg font-semibold mb-4">章に割り当て</h3>
      <form method="POST" action="?/assignToChapter" use:enhance>
        <input type="hidden" name="postId" value={selectedPostForChapter} />
        <div class="space-y-4">
          <label class="label">
            <span>章を選択</span>
            <select
              name="chapterId"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">未割り当て</option>
              {#each data.project.chapters as chapter}
                <option value={chapter.id}>{chapter.title}</option>
              {/each}
            </select>
          </label>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              on:click={() => (selectedPostForChapter = null)}
              class="px-4 py-2 text-sm font-medium rounded-lg ghost"
            >
              キャンセル
            </button>
            <button
              type="submit"
              on:click={() => (selectedPostForChapter = null)}
              class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
            >
              割り当て
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
