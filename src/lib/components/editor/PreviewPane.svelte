<script lang="ts">
  import { marked } from 'marked';
  import { onMount } from 'svelte';

  export let content: string = '';
  export let darkMode: boolean = false;

  let processedHtml: string = '';

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  function processMarkdown(markdown: string): string {
    try {
      // Use marked with default renderer
      let html = marked(markdown) as string;

      // Post-process to add target="_blank" to links
      html = html.replace(
        /<a\s+href="([^"]+)"([^>]*)>/g,
        '<a href="$1"$2 target="_blank" rel="noopener noreferrer">'
      );

      return html;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p>マークダウンの解析中にエラーが発生しました。</p>';
    }
  }

  $: processedHtml = processMarkdown(content);

  onMount(() => {
    loadPrismStyles();
  });

  function loadPrismStyles() {
    if (typeof globalThis !== 'undefined' && globalThis.document) {
      const link = globalThis.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
      if (darkMode) {
        link.href =
          'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
      }
      globalThis.document.head.appendChild(link);
    }
  }
</script>

<div class="preview-pane" class:dark-mode={darkMode}>
  <div class="preview-content">
    {#if content}
      {@html processedHtml}
    {:else}
      <p class="empty-state">プレビューがここに表示されます</p>
    {/if}
  </div>
</div>

<style>
  .preview-pane {
    height: 100%;
    background-color: white;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    overflow-y: auto;
  }

  .preview-content {
    padding: 2rem;
    max-width: 65ch;
    margin: 0 auto;
  }

  .empty-state {
    color: rgb(156 163 175);
    text-align: center;
    padding: 4rem 0;
  }

  .dark-mode {
    background-color: rgb(17 24 39);
    border-color: rgb(55 65 81);
  }

  .dark-mode .empty-state {
    color: rgb(107 114 128);
  }

  :global(.preview-content h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: rgb(17 24 39);
  }

  :global(.preview-content h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: rgb(31 41 55);
  }

  :global(.preview-content h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: rgb(31 41 55);
  }

  :global(.preview-content h4),
  :global(.preview-content h5),
  :global(.preview-content h6) {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: rgb(55 65 81);
  }

  :global(.preview-content p) {
    margin-bottom: 1rem;
    line-height: 1.75;
    color: rgb(55 65 81);
  }

  :global(.preview-content a) {
    color: rgb(37 99 235);
    text-decoration: underline;
  }

  :global(.preview-content a:hover) {
    color: rgb(29 78 216);
  }

  :global(.preview-content pre) {
    background-color: rgb(243 244 246);
    border-radius: 0.375rem;
    padding: 1rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  :global(.preview-content code) {
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.875rem;
  }

  :global(.preview-content :not(pre) > code) {
    background-color: rgb(243 244 246);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    color: rgb(220 38 38);
  }

  :global(.preview-content ul),
  :global(.preview-content ol) {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  :global(.preview-content li) {
    margin-bottom: 0.25rem;
    line-height: 1.75;
    color: rgb(55 65 81);
  }

  :global(.preview-content blockquote) {
    border-left: 4px solid rgb(229 231 235);
    padding-left: 1rem;
    margin: 1rem 0;
    color: rgb(107 114 128);
    font-style: italic;
  }

  :global(.preview-content hr) {
    border: none;
    border-top: 1px solid rgb(229 231 235);
    margin: 2rem 0;
  }

  :global(.preview-content table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
  }

  :global(.preview-content th),
  :global(.preview-content td) {
    border: 1px solid rgb(229 231 235);
    padding: 0.5rem;
    text-align: left;
  }

  :global(.preview-content th) {
    background-color: rgb(243 244 246);
    font-weight: 600;
  }

  :global(.dark-mode .preview-content h1),
  :global(.dark-mode .preview-content h2),
  :global(.dark-mode .preview-content h3),
  :global(.dark-mode .preview-content h4),
  :global(.dark-mode .preview-content h5),
  :global(.dark-mode .preview-content h6) {
    color: rgb(243 244 246);
  }

  :global(.dark-mode .preview-content p),
  :global(.dark-mode .preview-content li) {
    color: rgb(209 213 219);
  }

  :global(.dark-mode .preview-content pre) {
    background-color: rgb(31 41 55);
    border: 1px solid rgb(55 65 81);
  }

  :global(.dark-mode .preview-content :not(pre) > code) {
    background-color: rgb(55 65 81);
    color: rgb(248 113 113);
  }

  :global(.dark-mode .preview-content blockquote) {
    border-left-color: rgb(75 85 99);
    color: rgb(156 163 175);
  }

  :global(.dark-mode .preview-content hr) {
    border-top-color: rgb(55 65 81);
  }

  :global(.dark-mode .preview-content th),
  :global(.dark-mode .preview-content td) {
    border-color: rgb(55 65 81);
  }

  :global(.dark-mode .preview-content th) {
    background-color: rgb(31 41 55);
  }
</style>
