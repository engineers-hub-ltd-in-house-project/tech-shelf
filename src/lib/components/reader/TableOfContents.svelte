<script lang="ts">
  import type { Chapter } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';

  export let chapters: Chapter[];
  export let currentChapterId: string;
  export let bookId: string;

  const dispatch = createEventDispatcher();

  // 章をパート番号でグループ化
  $: groupedChapters = chapters.reduce(
    (acc, chapter) => {
      const partNumber = chapter.partNumber;
      if (!acc[partNumber]) {
        acc[partNumber] = [];
      }
      acc[partNumber]!.push(chapter);
      return acc;
    },
    {} as Record<number, Chapter[]>
  );

  $: partNumbers = Object.keys(groupedChapters)
    .map(Number)
    .sort((a, b) => a - b);

  function closeToc() {
    dispatch('close');
  }
</script>

<div class="toc-container">
  <div class="toc-header">
    <h2 class="text-xl font-bold">目次</h2>
    <button on:click={closeToc} class="btn btn-sm variant-ghost" aria-label="目次を閉じる">
      ✕
    </button>
  </div>

  <nav class="toc-content">
    {#each partNumbers as partNumber}
      <div class="part-section">
        <h3 class="part-title">第{partNumber}部</h3>
        <ul class="chapter-list">
          {#each groupedChapters[partNumber] || [] as chapter}
            <li class="chapter-item" class:active={chapter.id === currentChapterId}>
              <a href="/reader/{bookId}/{chapter.id}" class="chapter-link" on:click={closeToc}>
                <span class="chapter-number">第{chapter.order}章</span>
                <span class="chapter-title">{chapter.title}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
</div>

<style>
  .toc-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-surface-300);
  }

  .toc-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .part-section {
    margin-bottom: 1.5rem;
  }

  .part-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-surface-600);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .chapter-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .chapter-item {
    margin-bottom: 0.25rem;
  }

  .chapter-link {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    text-decoration: none;
    color: var(--color-surface-700);
    transition: all 0.2s;
  }

  .chapter-link:hover {
    background: var(--color-surface-200);
    color: var(--color-surface-900);
  }

  .chapter-item.active .chapter-link {
    background: var(--color-primary-500);
    color: white;
  }

  .chapter-number {
    font-size: 0.75rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.125rem;
  }

  .chapter-title {
    font-size: 0.875rem;
    display: block;
  }

  /* スクロールバーのカスタマイズ */
  .toc-content::-webkit-scrollbar {
    width: 6px;
  }

  .toc-content::-webkit-scrollbar-track {
    background: var(--color-surface-200);
  }

  .toc-content::-webkit-scrollbar-thumb {
    background: var(--color-surface-400);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    .toc-header {
      padding: 0.75rem;
    }

    .chapter-link {
      padding: 0.5rem 0.75rem;
    }
  }
</style>
