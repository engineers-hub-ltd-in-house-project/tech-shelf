<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let fontSize: number = 16;
  export let theme: 'light' | 'dark' = 'light';

  const dispatch = createEventDispatcher();

  const fontSizeOptions = [14, 16, 18, 20, 22];

  function increaseFontSize() {
    const currentIndex = fontSizeOptions.indexOf(fontSize);
    if (currentIndex < fontSizeOptions.length - 1) {
      const newSize = fontSizeOptions[currentIndex + 1];
      dispatch('fontSizeChange', newSize);
    }
  }

  function decreaseFontSize() {
    const currentIndex = fontSizeOptions.indexOf(fontSize);
    if (currentIndex > 0) {
      const newSize = fontSizeOptions[currentIndex - 1];
      dispatch('fontSizeChange', newSize);
    }
  }

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch('themeChange', newTheme);
  }
</script>

<div class="reader-controls">
  <div class="control-group">
    <button
      on:click={decreaseFontSize}
      class="btn btn-sm variant-ghost"
      disabled={fontSize === fontSizeOptions[0]}
      aria-label="文字サイズを小さく"
    >
      A-
    </button>
    <span class="font-size-display">{fontSize}px</span>
    <button
      on:click={increaseFontSize}
      class="btn btn-sm variant-ghost"
      disabled={fontSize === fontSizeOptions[fontSizeOptions.length - 1]}
      aria-label="文字サイズを大きく"
    >
      A+
    </button>
  </div>

  <button on:click={toggleTheme} class="btn btn-sm variant-ghost" aria-label="テーマを切り替え">
    {#if theme === 'light'}
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    {:else}
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    {/if}
  </button>
</div>

<style>
  .reader-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .font-size-display {
    font-size: 0.875rem;
    color: var(--color-surface-600);
    min-width: 3rem;
    text-align: center;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .reader-controls {
      gap: 0.5rem;
    }

    .control-group {
      gap: 0.25rem;
    }
  }
</style>
