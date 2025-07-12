<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';
  import BlogCard from './BlogCard.svelte';

  export let posts: (BlogPost & { tags: { tag: Tag }[] })[] = [];
  export let loading = false;
</script>

<div class="container mx-auto px-4">
  {#if loading}
    <div class="flex justify-center items-center min-h-[400px]">
      <span class="text-gray-500">読み込み中...</span>
    </div>
  {:else if posts.length === 0}
    <div class="text-center py-12">
      <p class="text-lg text-gray-600 dark:text-gray-400">まだ記事がありません。</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each posts as post}
        <BlogCard {post} />
      {/each}
    </div>
  {/if}
</div>
