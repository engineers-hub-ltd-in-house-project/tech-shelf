<script lang="ts">
  import type { BookWithDetails } from '$lib/server/books';
  import { formatCurrency } from '$lib/utils/format';

  export let book: BookWithDetails;

  const placeholderImage = '/images/books/no-cover.svg';
</script>

<article
  class="bg-white shadow rounded-lg hover:shadow-lg transition-shadow overflow-hidden h-full dark:bg-gray-800"
>
  <a href="/books/{book.id}" class="block">
    <header class="aspect-[2/3] relative overflow-hidden bg-gray-200 dark:bg-gray-700">
      <img
        src={book.coverImage || placeholderImage}
        alt="{book.title} cover"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      {#if book.price === 0}
        <span
          class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded absolute top-2 right-2"
        >
          無料
        </span>
      {/if}
    </header>

    <div class="p-4 space-y-2">
      <h3 class="text-lg font-bold line-clamp-2">
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
            <span
              class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </a>
</article>
