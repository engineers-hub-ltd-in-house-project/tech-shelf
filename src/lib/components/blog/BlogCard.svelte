<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';

  export let post: BlogPost & { tags: { tag: Tag }[] };
  export let href: string = `/blog/${post.slug}`;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>

<article
  class="card bg-surface-100 dark:bg-surface-800 shadow-xl hover:shadow-2xl transition-shadow"
>
  {#if post.coverImage}
    <header>
      <img src={post.coverImage} alt={post.title} class="w-full h-48 object-cover" />
    </header>
  {/if}

  <div class="p-4 space-y-4">
    <h2 class="h4 font-bold">
      <a {href} class="hover:text-primary-500 transition-colors">
        {post.title}
      </a>
    </h2>

    {#if post.excerpt}
      <p class="text-surface-600 dark:text-surface-400">{post.excerpt}</p>
    {/if}

    <div class="flex flex-wrap gap-2">
      {#each post.tags as { tag }}
        <span class="badge variant-soft-primary">{tag.name}</span>
      {/each}
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-surface-500 dark:text-surface-500">
        {formatDate(post.publishedAt || post.createdAt)}
      </span>
      <a {href} class="btn btn-sm variant-filled-primary">続きを読む</a>
    </div>
  </div>
</article>
