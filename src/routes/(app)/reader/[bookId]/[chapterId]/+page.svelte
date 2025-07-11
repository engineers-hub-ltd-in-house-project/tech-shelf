<script lang="ts">
  import type { PageData } from './$types';
  import WebReader from '$lib/components/reader/WebReader.svelte';
  import TableOfContents from '$lib/components/reader/TableOfContents.svelte';
  import ReadingProgress from '$lib/components/reader/ReadingProgress.svelte';
  import ReaderControls from '$lib/components/reader/ReaderControls.svelte';
  import { reading } from '$lib/stores/reading';
  import { onMount } from 'svelte';

  export let data: PageData;

  let showToc = false;
  let fontSize = 16;
  let theme: 'light' | 'dark' = 'light';

  onMount(() => {
    // 読書セッションを開始
    reading.startSession(data.book.id, data.chapter.id);
  });

  function handleThemeChange(newTheme: 'light' | 'dark') {
    theme = newTheme;
  }

  function handleFontSizeChange(newSize: number) {
    fontSize = newSize;
  }

  function toggleToc() {
    showToc = !showToc;
  }
</script>

<svelte:head>
  <title>{data.chapter.title} - {data.book.title} | Tech Shelf</title>
</svelte:head>

<div class="reader-layout" class:dark-theme={theme === 'dark'}>
  <!-- ヘッダー -->
  <header class="reader-header">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a
          href="/books/{data.book.id}"
          class="text-surface-600 dark:text-surface-400 hover:text-primary-500"
        >
          ← 書籍詳細に戻る
        </a>
        <button on:click={toggleToc} class="btn btn-sm variant-ghost">
          <span class="i-mdi-format-list-bulleted mr-1"></span>
          目次
        </button>
      </div>
      <div class="flex items-center gap-4">
        <ReadingProgress
          currentChapter={data.currentChapterIndex}
          totalChapters={data.totalChapters}
        />
        <ReaderControls
          {fontSize}
          {theme}
          on:themeChange={(e) => handleThemeChange(e.detail)}
          on:fontSizeChange={(e) => handleFontSizeChange(e.detail)}
        />
      </div>
    </div>
  </header>

  <!-- サイドバー（目次） -->
  {#if showToc}
    <aside class="reader-sidebar">
      <TableOfContents
        chapters={data.book.chapters}
        currentChapterId={data.chapter.id}
        bookId={data.book.id}
        on:close={() => (showToc = false)}
      />
    </aside>
  {/if}

  <!-- メインコンテンツ -->
  <main class="reader-main">
    <WebReader book={data.book} chapter={data.chapter} {fontSize} {theme} />

    <!-- ナビゲーション -->
    <nav class="reader-nav">
      <div class="flex justify-between items-center">
        {#if data.previousChapter}
          <a
            href="/reader/{data.book.id}/{data.previousChapter.id}"
            class="btn variant-filled-surface"
          >
            ← 前の章: {data.previousChapter.title}
          </a>
        {:else}
          <div></div>
        {/if}

        {#if data.nextChapter}
          <a href="/reader/{data.book.id}/{data.nextChapter.id}" class="btn variant-filled-primary">
            次の章: {data.nextChapter.title} →
          </a>
        {:else}
          <div></div>
        {/if}
      </div>
    </nav>
  </main>
</div>

<style>
  .reader-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--color-surface-50);
  }

  .dark-theme {
    background: var(--color-surface-900);
    color: var(--color-surface-100);
  }

  .reader-header {
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--color-surface-200);
    background: var(--color-surface-100);
  }

  .dark-theme .reader-header {
    background: var(--color-surface-800);
    border-color: var(--color-surface-700);
  }

  .reader-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background: var(--color-surface-100);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .dark-theme .reader-sidebar {
    background: var(--color-surface-800);
  }

  .reader-main {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  .reader-nav {
    padding: 2rem;
    border-top: 1px solid var(--color-surface-200);
    background: var(--color-surface-100);
  }

  .dark-theme .reader-nav {
    background: var(--color-surface-800);
    border-color: var(--color-surface-700);
  }

  @media (max-width: 768px) {
    .reader-header {
      padding: 0.75rem 1rem;
    }

    .reader-main {
      padding: 1rem;
    }

    .reader-sidebar {
      width: 100%;
    }
  }
</style>
