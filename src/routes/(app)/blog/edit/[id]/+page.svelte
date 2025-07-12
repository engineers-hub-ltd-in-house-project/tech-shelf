<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';
  import PreviewPane from '$lib/components/editor/PreviewPane.svelte';
  import OutlinePane from '$lib/components/editor/OutlinePane.svelte';
  import type { ActionData, PageData } from './$types';

  export let form: ActionData;
  export let data: PageData;

  let title = data.post.title;
  let slug = data.post.slug;
  let excerpt = data.post.excerpt || '';
  let tags = data.post.tags;
  let published = data.post.isPublished;
  let content = data.post.content;
  let showPreview = true;
  let showOutline = true;
  let darkMode = false;
  let saving = false;

  $: editor.updateContent(content);

  function generateSlug() {
    if (!title) return;
    slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  function togglePreview() {
    showPreview = !showPreview;
  }

  function toggleOutline() {
    showOutline = !showOutline;
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
  }

  function handleSubmit() {
    saving = true;
  }
</script>

<svelte:head>
  <title>記事を編集 - Tech Shelf</title>
</svelte:head>

<div class="editor-container" class:dark-mode={darkMode}>
  <form method="POST" on:submit={handleSubmit}>
    {#if form?.error}
      <div class="error-message">
        {form.error}
      </div>
    {/if}

    <div class="editor-header">
      <div class="header-top">
        <input
          type="text"
          name="title"
          bind:value={title}
          on:blur={generateSlug}
          placeholder="記事のタイトル"
          class="title-input"
          required
        />
      </div>

      <div class="header-meta">
        <div class="meta-inputs">
          <input
            type="text"
            name="slug"
            bind:value={slug}
            placeholder="URLスラッグ"
            class="slug-input"
            required
          />
          <input
            type="text"
            name="excerpt"
            bind:value={excerpt}
            placeholder="記事の概要（任意）"
            class="excerpt-input"
          />
          <input
            type="text"
            name="tags"
            bind:value={tags}
            placeholder="タグ（カンマ区切り）"
            class="tags-input"
          />
        </div>
        <div class="publish-control">
          <label class="publish-checkbox">
            <input type="checkbox" name="published" bind:checked={published} />
            <span>公開する</span>
          </label>
        </div>
      </div>

      <div class="header-actions">
        <div class="header-left">
          <button type="submit" class="btn-primary" disabled={saving}>
            {saving ? '更新中...' : '記事を更新'}
          </button>
          <a href="/blog/{data.post.slug}" class="btn-secondary"> キャンセル </a>
        </div>
        <div class="header-right">
          <button
            type="button"
            class="icon-button"
            on:click={toggleOutline}
            title="アウトライン表示"
            aria-label="アウトライン表示"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
          <button
            type="button"
            class="icon-button"
            on:click={togglePreview}
            title="プレビュー表示"
            aria-label="プレビュー表示"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button
            type="button"
            class="icon-button"
            on:click={toggleDarkMode}
            title="ダークモード切り替え"
            aria-label="ダークモード切り替え"
          >
            {#if darkMode}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <div class="editor-main">
      {#if showOutline}
        <div class="outline-pane">
          <OutlinePane />
        </div>
      {/if}

      <div class="editor-pane">
        <input type="hidden" name="content" bind:value={content} />
        <MarkdownEditor bind:value={content} {darkMode} />
      </div>

      {#if showPreview}
        <div class="preview-pane">
          <PreviewPane content={$editor.content} {darkMode} />
        </div>
      {/if}
    </div>
  </form>
</div>

<style>
  .editor-container {
    min-height: 100vh;
    background-color: var(--color-bg-secondary);
    transition: background-color 0.3s ease;
  }

  .editor-container.dark-mode {
    --color-bg-primary: #1a1a1a;
    --color-bg-secondary: #0d0d0d;
    --color-text-primary: #e0e0e0;
    --color-text-secondary: #a0a0a0;
    --color-border: #333;
    background-color: #0d0d0d;
  }

  .error-message {
    background-color: #fee;
    color: #c00;
    padding: 1rem;
    margin: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #fcc;
  }

  .editor-header {
    background-color: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border);
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-top {
    margin-bottom: 1rem;
  }

  .title-input {
    width: 100%;
    font-size: 2rem;
    font-weight: 700;
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    outline: none;
  }

  .title-input::placeholder {
    color: var(--color-text-secondary);
  }

  .header-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
  }

  .meta-inputs {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .slug-input,
  .excerpt-input,
  .tags-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  .publish-control {
    display: flex;
    align-items: center;
  }

  .publish-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .publish-checkbox input[type='checkbox'] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left,
  .header-right {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background-color: var(--color-bg-secondary);
  }

  .icon-button {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    background-color: transparent;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .icon-button:hover {
    background-color: var(--color-bg-secondary);
  }

  .editor-main {
    display: flex;
    height: calc(100vh - 200px);
  }

  .outline-pane {
    width: 250px;
    background-color: var(--color-bg-primary);
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
  }

  .editor-pane {
    flex: 1;
    min-width: 0;
    background-color: var(--color-bg-primary);
  }

  .preview-pane {
    flex: 1;
    min-width: 0;
    background-color: var(--color-bg-primary);
    border-left: 1px solid var(--color-border);
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .header-meta {
      flex-direction: column;
    }

    .meta-inputs {
      flex-direction: column;
      width: 100%;
    }

    .editor-main {
      flex-direction: column;
    }

    .outline-pane,
    .preview-pane {
      width: 100%;
      height: 300px;
      border-right: none;
      border-left: none;
      border-bottom: 1px solid var(--color-border);
    }
  }
</style>
