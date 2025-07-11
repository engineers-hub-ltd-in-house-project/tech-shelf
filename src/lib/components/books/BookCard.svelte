<script lang="ts">
  import type { BookWithDetails } from '$lib/server/books';
  import { formatCurrency } from '$lib/utils/format';

  export let book: BookWithDetails;

  const placeholderImage = 'https://via.placeholder.com/300x450?text=No+Cover';
</script>

<article class="card card-hover overflow-hidden h-full">
  <a href="/books/{book.id}" class="block">
    <header class="aspect-[2/3] relative overflow-hidden bg-surface-200-700-token">
      <img
        src={book.coverImage || placeholderImage}
        alt="{book.title} cover"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      {#if book.price === 0}
        <span class="badge variant-filled-primary absolute top-2 right-2"> 無料 </span>
      {/if}
    </header>

    <div class="card-body p-4 space-y-2">
      <h3 class="h4 font-bold line-clamp-2">
        {book.title}
      </h3>

      <p class="text-sm opacity-75">
        {book.author}
      </p>

      <p class="text-sm line-clamp-3 opacity-90">
        {book.description}
      </p>

      <div class="flex items-center justify-between mt-auto pt-2">
        <span class="text-lg font-semibold">
          {#if book.price === 0}
            無料
          {:else}
            {formatCurrency(book.price, book.currency)}
          {/if}
        </span>

        <span class="text-sm opacity-75">
          {book.chapterCount}章
        </span>
      </div>

      {#if book.tags.length > 0}
        <div class="flex flex-wrap gap-1 mt-2">
          {#each book.tags.slice(0, 3) as tag}
            <span class="badge variant-soft-surface text-xs">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </a>
</article>
