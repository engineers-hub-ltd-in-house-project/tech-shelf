<script lang="ts">
  import type { PageData } from './$types';
  import { marked } from 'marked';

  export let data: PageData;

  let activeChapterIndex = 0;
  let showTableOfContents = true;

  function renderMarkdown(content: string): string {
    return marked(content) as string;
  }

  function scrollToChapter(index: number) {
    activeChapterIndex = index;
    const element = document.getElementById(`chapter-${index}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<svelte:head>
  <title>{data.project.title} - プレビュー | Tech Shelf</title>
</svelte:head>

<div class="preview-container">
  <header class="preview-header">
    <div class="header-content">
      <div>
        <h1>{data.project.title}</h1>
        {#if data.project.description}
          <p class="project-description">{data.project.description}</p>
        {/if}
      </div>
      <div class="header-actions">
        <button
          class="toggle-toc"
          on:click={() => (showTableOfContents = !showTableOfContents)}
          title={showTableOfContents ? '目次を非表示' : '目次を表示'}
          aria-label={showTableOfContents ? '目次を非表示' : '目次を表示'}
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
        <a href="/book-projects/{data.project.id}" class="back-button"> プロジェクトに戻る </a>
      </div>
    </div>
  </header>

  <div class="preview-layout">
    {#if showTableOfContents}
      <aside class="table-of-contents">
        <h2>目次</h2>
        <nav>
          {#if data.chapters.length > 0}
            <ol class="chapter-list">
              {#each data.chapters as chapter, index}
                <li>
                  <button
                    class="chapter-link"
                    class:active={activeChapterIndex === index}
                    on:click={() => scrollToChapter(index)}
                  >
                    <span class="chapter-number">第{index + 1}章</span>
                    <span class="chapter-title">{chapter.title}</span>
                  </button>
                  {#if chapter.posts.length > 0}
                    <ul class="section-list">
                      {#each chapter.posts as post}
                        <li class="section-item">
                          <span class="section-title">{post.title}</span>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ol>
          {:else if data.unassignedPosts.length > 0}
            <ul class="post-list">
              {#each data.unassignedPosts as post, index}
                <li>
                  <button
                    class="post-link"
                    class:active={activeChapterIndex === index}
                    on:click={() => scrollToChapter(index)}
                  >
                    {post.title}
                  </button>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="empty-message">記事が追加されていません</p>
          {/if}
        </nav>
      </aside>
    {/if}

    <main class="preview-content">
      <div class="book-preview">
        {#if data.chapters.length > 0}
          {#each data.chapters as chapter, chapterIndex}
            <section id="chapter-{chapterIndex}" class="chapter">
              <h2 class="chapter-heading">
                第{chapterIndex + 1}章: {chapter.title}
              </h2>
              {#if chapter.content}
                <div class="chapter-intro prose">
                  {@html renderMarkdown(chapter.content)}
                </div>
              {/if}
              {#each chapter.posts as post}
                <article class="post-content">
                  <h3 class="post-title">{post.title}</h3>
                  {#if post.excerpt}
                    <p class="post-excerpt">{post.excerpt}</p>
                  {/if}
                  <div class="prose">
                    {@html renderMarkdown(post.content)}
                  </div>
                </article>
              {/each}
            </section>
          {/each}
        {:else if data.unassignedPosts.length > 0}
          <div class="unassigned-posts">
            <p class="info-message">章構成がまだ設定されていません。記事は追加順に表示されます。</p>
            {#each data.unassignedPosts as post, index}
              <article id="chapter-{index}" class="post-content">
                <h2 class="post-title">{post.title}</h2>
                {#if post.excerpt}
                  <p class="post-excerpt">{post.excerpt}</p>
                {/if}
                <div class="prose">
                  {@html renderMarkdown(post.content)}
                </div>
              </article>
            {/each}
          </div>
        {:else}
          <div class="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p>まだ記事が追加されていません</p>
            <a href="/book-projects/{data.project.id}" class="add-posts-button"> 記事を追加する </a>
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
  .preview-container {
    min-height: 100vh;
    background-color: rgb(249 250 251);
  }

  .preview-header {
    background-color: white;
    border-bottom: 1px solid rgb(229 231 235);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .preview-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(17 24 39);
    margin: 0;
  }

  .project-description {
    font-size: 0.875rem;
    color: rgb(107 114 128);
    margin-top: 0.25rem;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .toggle-toc {
    padding: 0.5rem;
    background: none;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    color: rgb(107 114 128);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .toggle-toc:hover {
    background-color: rgb(243 244 246);
    color: rgb(55 65 81);
  }

  .back-button {
    padding: 0.5rem 1rem;
    background-color: rgb(37 99 235);
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.15s ease;
  }

  .back-button:hover {
    background-color: rgb(29 78 216);
  }

  .preview-layout {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    min-height: calc(100vh - 80px);
  }

  .table-of-contents {
    width: 300px;
    background-color: white;
    border-right: 1px solid rgb(229 231 235);
    padding: 2rem;
    overflow-y: auto;
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
  }

  .table-of-contents h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: rgb(17 24 39);
    margin-bottom: 1rem;
  }

  .chapter-list,
  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .chapter-link,
  .post-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
    color: rgb(55 65 81);
  }

  .chapter-link:hover,
  .post-link:hover {
    background-color: rgb(243 244 246);
    color: rgb(17 24 39);
  }

  .chapter-link.active,
  .post-link.active {
    background-color: rgb(219 234 254);
    color: rgb(37 99 235);
    font-weight: 500;
  }

  .chapter-number {
    display: block;
    font-size: 0.75rem;
    color: rgb(107 114 128);
    margin-bottom: 0.25rem;
  }

  .chapter-title {
    display: block;
    font-size: 0.875rem;
  }

  .section-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 1rem;
  }

  .section-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.813rem;
    color: rgb(107 114 128);
  }

  .preview-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .book-preview {
    max-width: 800px;
    margin: 0 auto;
  }

  .chapter {
    margin-bottom: 4rem;
  }

  .chapter-heading {
    font-size: 2rem;
    font-weight: 700;
    color: rgb(17 24 39);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgb(229 231 235);
  }

  .chapter-intro {
    margin-bottom: 2rem;
  }

  .post-content {
    background-color: white;
    border-radius: 0.5rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  .post-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: rgb(17 24 39);
    margin-bottom: 1rem;
  }

  .post-excerpt {
    font-size: 1rem;
    color: rgb(107 114 128);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .info-message {
    background-color: rgb(219 234 254);
    color: rgb(37 99 235);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: rgb(107 114 128);
  }

  .empty-state svg {
    margin: 0 auto 1.5rem;
    color: rgb(209 213 219);
  }

  .empty-state p {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
  }

  .add-posts-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: rgb(37 99 235);
    color: white;
    border-radius: 0.375rem;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.15s ease;
  }

  .add-posts-button:hover {
    background-color: rgb(29 78 216);
  }

  .prose {
    max-width: none;
    color: rgb(31 41 55);
    line-height: 1.75;
  }

  .prose :global(h1),
  .prose :global(h2),
  .prose :global(h3),
  .prose :global(h4) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .prose :global(h1) {
    font-size: 1.875rem;
  }

  .prose :global(h2) {
    font-size: 1.5rem;
  }

  .prose :global(h3) {
    font-size: 1.25rem;
  }

  .prose :global(p) {
    margin-bottom: 1.25rem;
  }

  .prose :global(pre) {
    background-color: rgb(31 41 55);
    color: rgb(243 244 246);
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
  }

  .prose :global(code) {
    background-color: rgb(243 244 246);
    color: rgb(31 41 55);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  .prose :global(pre code) {
    background-color: transparent;
    color: inherit;
    padding: 0;
  }

  .prose :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
    border-radius: 0.375rem;
  }

  .prose :global(blockquote) {
    border-left: 4px solid rgb(229 231 235);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: rgb(107 114 128);
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 1024px) {
    .table-of-contents {
      display: none;
    }

    .preview-layout {
      display: block;
    }
  }
</style>
