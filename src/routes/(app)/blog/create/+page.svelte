<script lang="ts">
  import { editor } from '$lib/stores/editor';
  import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';
  import PreviewPane from '$lib/components/editor/PreviewPane.svelte';
  import OutlinePane from '$lib/components/editor/OutlinePane.svelte';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let title = '';
  let slug = '';
  let excerpt = '';
  let tags = '';
  let published = false;
  let content = '';
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
  <title>新規記事作成 | Tech Shelf</title>
</svelte:head>

<div class="editor-page">
  <form method="POST" on:submit={handleSubmit}>
    <header class="editor-header">
      <div class="header-left">
        <a href="/blog" class="back-link">
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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          記事一覧に戻る
        </a>
      </div>
      <div class="header-center">
        <h1>新規記事作成</h1>
      </div>
      <div class="header-right">
        <button type="button" class="icon-button" on:click={toggleOutline} title="アウトライン表示">
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
        <button type="button" class="icon-button" on:click={togglePreview} title="プレビュー表示">
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
          title="ダークモード切替"
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
        <button type="submit" class="save-button" disabled={saving}>
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </header>

    {#if form?.error}
      <div class="error-message">
        {form.error}
      </div>
    {/if}

    <div class="editor-metadata">
      <div class="metadata-row">
        <div class="form-group">
          <label for="title">タイトル</label>
          <input
            type="text"
            id="title"
            name="title"
            bind:value={title}
            on:blur={generateSlug}
            placeholder="記事のタイトルを入力"
            required
          />
        </div>
        <div class="form-group">
          <label for="slug">スラッグ</label>
          <input
            type="text"
            id="slug"
            name="slug"
            bind:value={slug}
            placeholder="url-friendly-slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
        </div>
      </div>
      <div class="metadata-row">
        <div class="form-group">
          <label for="excerpt">概要（任意）</label>
          <textarea
            id="excerpt"
            name="excerpt"
            bind:value={excerpt}
            placeholder="記事の概要を入力（一覧ページに表示されます）"
            rows="2"
          ></textarea>
        </div>
      </div>
      <div class="metadata-row">
        <div class="form-group">
          <label for="tags">タグ（カンマ区切り）</label>
          <input
            type="text"
            id="tags"
            name="tags"
            bind:value={tags}
            placeholder="例: Svelte, TypeScript, Web開発"
          />
        </div>
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" name="published" bind:checked={published} />
            すぐに公開する
          </label>
        </div>
      </div>
    </div>

    <div class="editor-container" class:dark={darkMode}>
      {#if showOutline}
        <div class="outline-section">
          <OutlinePane {content} />
        </div>
      {/if}
      <div class="editor-section">
        <input type="hidden" name="content" bind:value={content} />
        <MarkdownEditor bind:value={content} {darkMode} />
      </div>
      {#if showPreview}
        <div class="preview-section">
          <PreviewPane {content} {darkMode} />
        </div>
      {/if}
    </div>
  </form>
</div>

<style>
  .editor-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: rgb(249 250 251);
  }

  .editor-header {
    background-color: white;
    border-bottom: 1px solid rgb(229 231 235);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-center h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgb(17 24 39);
    margin: 0;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgb(107 114 128);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: rgb(55 65 81);
  }

  .icon-button {
    padding: 0.5rem;
    background: none;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    color: rgb(107 114 128);
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button:hover {
    background-color: rgb(243 244 246);
    color: rgb(55 65 81);
  }

  .save-button {
    padding: 0.5rem 1.5rem;
    background-color: rgb(37 99 235);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .save-button:hover:not(:disabled) {
    background-color: rgb(29 78 216);
  }

  .save-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    background-color: rgb(254 226 226);
    color: rgb(185 28 28);
    padding: 0.75rem 1rem;
    border-left: 4px solid rgb(239 68 68);
    margin: 1rem 2rem 0;
  }

  .editor-metadata {
    background-color: white;
    border-bottom: 1px solid rgb(229 231 235);
    padding: 1.5rem 2rem;
    flex-shrink: 0;
  }

  .metadata-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .metadata-row:last-child {
    margin-bottom: 0;
  }

  .form-group {
    flex: 1;
  }

  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(55 65 81);
    margin-bottom: 0.5rem;
  }

  .form-group input[type='text'],
  .form-group textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.15s ease;
  }

  .form-group input[type='text']:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: rgb(59 130 246);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    padding-top: 1.875rem;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0;
    cursor: pointer;
  }

  .editor-container {
    flex: 1;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    padding: 1rem;
    overflow: hidden;
  }

  .outline-section {
    width: 250px;
    min-width: 200px;
    max-width: 300px;
  }

  .editor-section {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .preview-section {
    width: 50%;
    min-width: 300px;
    max-width: 600px;
  }

  .dark {
    background-color: rgb(17 24 39);
  }

  @media (max-width: 1024px) {
    .editor-container {
      grid-template-columns: 1fr;
    }

    .outline-section,
    .preview-section {
      display: none;
    }
  }
</style>
