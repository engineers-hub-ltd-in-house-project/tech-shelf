<script lang="ts">
  export let currentChapter: number;
  export let totalChapters: number;

  $: percentage = totalChapters > 0 ? (currentChapter / totalChapters) * 100 : 0;
</script>

<div class="reading-progress">
  <span class="progress-text">
    {currentChapter} / {totalChapters} 章
  </span>
  <div class="progress-bar">
    <div class="progress-fill" style="width: {percentage}%"></div>
  </div>
</div>

<style>
  .reading-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--color-surface-600);
    white-space: nowrap;
  }

  .progress-bar {
    width: 100px;
    height: 4px;
    background: var(--color-surface-300);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-primary-500);
    transition: width 0.3s ease;
  }

  @media (max-width: 640px) {
    .progress-bar {
      width: 60px;
    }

    .progress-text {
      font-size: 0.75rem;
    }
  }
</style>
