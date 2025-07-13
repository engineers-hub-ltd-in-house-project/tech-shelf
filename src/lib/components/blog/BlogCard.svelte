<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';

  export let post: BlogPost & {
    tags: { tag: Tag }[];
    author?: { name: string; avatar?: string | null };
  };
  export let href: string = `/blog/${post.slug}`;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>

<article class="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
  {#if post.coverImage}
    <header>
      <img src={post.coverImage} alt={post.title} class="w-full h-48 object-cover" />
    </header>
  {/if}

  <div class="p-4 space-y-4">
    <h2 class="text-lg font-bold">
      <a {href} class="hover:text-gray-600 transition-colors">
        {post.title}
      </a>
    </h2>

    {#if post.excerpt}
      <p class="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
    {/if}

    <div class="flex flex-wrap gap-2">
      {#each post.tags as { tag }}
        <span
          class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-200"
          >{tag.name}</span
        >
      {/each}
    </div>

    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500 dark:text-gray-500">
        {#if post.author}
          <span>{post.author.name}</span>
          <span class="mx-1">•</span>
        {/if}
        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
      </div>
      <a
        {href}
        class="px-3 py-1.5 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
        >続きを読む</a
      >
    </div>
  </div>
</article>
