<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data: PageData;

  onMount(() => {
    // 最初の章にリダイレクト
    if (data.firstChapterId) {
      goto(`/reader/${data.book.id}/${data.firstChapterId}`);
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <div class="text-center">
    <h1 class="text-3xl font-bold mb-4">{data.book.title}</h1>
    {#if data.firstChapterId}
      <p class="text-surface-600 dark:text-surface-400">リーダーページに移動しています...</p>
    {:else}
      <p class="text-surface-600 dark:text-surface-400">この書籍にはまだ章がありません。</p>
    {/if}
  </div>
</div>
