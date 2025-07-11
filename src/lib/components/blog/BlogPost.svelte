<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';

  export let post: BlogPost & { tags: { tag: Tag }[] };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>

<article class="max-w-4xl mx-auto">
  <header class="mb-8">
    {#if post.coverImage}
      <img
        src={post.coverImage}
        alt={post.title}
        class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-6"
      />
    {/if}

    <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-4">
      {post.title}
    </h1>

    <div class="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mb-6">
      <time datetime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
        {formatDate(post.publishedAt || post.createdAt)}
      </time>

      {#if post.viewCount > 0}
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
          {post.viewCount}
        </span>
      {/if}
    </div>

    {#if post.tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-6">
        {#each post.tags as { tag }}
          <span class="badge badge-primary">{tag.name}</span>
        {/each}
      </div>
    {/if}
  </header>

  <div class="prose prose-lg max-w-none">
    <!-- content will be rendered by mdsvex -->
    {@html post.content}
  </div>
</article>

<style>
  :global(.prose) {
    color: oklch(var(--bc));
  }

  :global(.prose h1) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  :global(.prose h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  :global(.prose h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  :global(.prose p) {
    margin-bottom: 1rem;
    line-height: 1.625;
  }

  :global(.prose code) {
    background-color: oklch(var(--b2));
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  :global(.prose pre) {
    background-color: oklch(var(--b2));
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  :global(.prose blockquote) {
    border-left: 4px solid oklch(var(--p));
    padding-left: 1rem;
    font-style: italic;
  }

  :global(.prose ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  :global(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  :global(.prose li) {
    margin-bottom: 0.5rem;
  }

  :global(.prose a) {
    color: oklch(var(--p));
    text-decoration: underline;
  }

  :global(.prose a:hover) {
    text-decoration: none;
  }

  :global(.code-wrapper[data-theme='dark']) {
    display: none;
  }

  :global(.dark .code-wrapper[data-theme='light']) {
    display: none;
  }

  :global(.dark .code-wrapper[data-theme='dark']) {
    display: block;
  }
</style>
