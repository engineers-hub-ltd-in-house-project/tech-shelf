<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';
  import BlogCard from './BlogCard.svelte';

  export let posts: (BlogPost & { tags: { tag: Tag }[] })[] = [];
  export let loading = false;
</script>

<div class="container mx-auto px-4">
  {#if loading}
    <div class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if posts.length === 0}
    <div class="text-center py-12">
      <p class="text-lg text-base-content/60">まだ記事がありません。</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each posts as post}
        <BlogCard {post} />
      {/each}
    </div>
  {/if}
</div>
