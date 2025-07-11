<script lang="ts">
  import type { Book, Chapter } from '@prisma/client';
  import { onMount } from 'svelte';
  import { reading } from '$lib/stores/reading';

  export let book: Book;
  export let chapter: Chapter;
  export let fontSize: number = 16;
  export let theme: 'light' | 'dark' = 'light';

  let contentElement: HTMLDivElement;
  let scrollPosition = 0;

  onMount(() => {
    // スクロール位置の保存
    const handleScroll = () => {
      scrollPosition = contentElement.scrollTop;
      const totalHeight = contentElement.scrollHeight - contentElement.clientHeight;
      const percentage = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;

      reading.updateProgress(book.id, chapter.id, percentage);
    };

    contentElement.addEventListener('scroll', handleScroll);

    // 前回の読書位置を復元
    const savedProgress = reading.getProgress(book.id, chapter.id);
    if (savedProgress && savedProgress.percentage > 0) {
      const totalHeight = contentElement.scrollHeight - contentElement.clientHeight;
      const targetScroll = (savedProgress.percentage / 100) * totalHeight;
      contentElement.scrollTop = targetScroll;
    }

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<article class="web-reader" style="font-size: {fontSize}px;">
  <div class="chapter-header">
    <h1 class="chapter-title">{chapter.title}</h1>
    <div class="chapter-meta">
      <span>第{chapter.partNumber}部 第{chapter.order}章</span>
      {#if chapter.estimatedReadingTime}
        <span>・</span>
        <span>読了時間: 約{chapter.estimatedReadingTime}分</span>
      {/if}
    </div>
  </div>

  <div bind:this={contentElement} class="chapter-content">
    {@html chapter.content}
  </div>
</article>

<style>
  .web-reader {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .chapter-header {
    margin-bottom: 3rem;
    text-align: center;
  }

  .chapter-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .chapter-meta {
    color: var(--color-surface-600);
    font-size: 0.875rem;
  }

  .chapter-content {
    line-height: 1.8;
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    padding-right: 1rem;
  }

  .chapter-content :global(p) {
    margin-bottom: 1.5rem;
  }

  .chapter-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .chapter-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .chapter-content :global(ul),
  .chapter-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  .chapter-content :global(li) {
    margin-bottom: 0.5rem;
  }

  .chapter-content :global(code) {
    background: var(--color-surface-200);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  .chapter-content :global(pre) {
    background: var(--color-surface-900);
    color: var(--color-surface-100);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .chapter-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .chapter-content :global(blockquote) {
    border-left: 4px solid var(--color-primary-500);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--color-surface-600);
  }

  /* スクロールバーのカスタマイズ */
  .chapter-content::-webkit-scrollbar {
    width: 8px;
  }

  .chapter-content::-webkit-scrollbar-track {
    background: var(--color-surface-200);
    border-radius: 4px;
  }

  .chapter-content::-webkit-scrollbar-thumb {
    background: var(--color-surface-400);
    border-radius: 4px;
  }

  .chapter-content::-webkit-scrollbar-thumb:hover {
    background: var(--color-surface-500);
  }

  @media (max-width: 768px) {
    .web-reader {
      padding: 1rem;
    }

    .chapter-title {
      font-size: 1.5rem;
    }

    .chapter-content {
      padding-right: 0.5rem;
    }
  }
</style>
