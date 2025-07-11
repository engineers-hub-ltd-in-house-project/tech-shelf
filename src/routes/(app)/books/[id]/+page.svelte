<script lang="ts">
  import type { PageData } from './$types';
  import BookDetail from '$lib/components/books/BookDetail.svelte';
  import BookCard from '$lib/components/books/BookCard.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.book.title} - Tech Shelf</title>
  <meta name="description" content={data.book.description} />
  <meta property="og:title" content={data.book.title} />
  <meta property="og:description" content={data.book.description} />
  {#if data.book.coverImage}
    <meta property="og:image" content={data.book.coverImage} />
  {/if}
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <nav class="breadcrumb mb-6">
    <ul>
      <li><a href="/">ホーム</a></li>
      <li><a href="/books">電子書籍</a></li>
      <li>{data.book.title}</li>
    </ul>
  </nav>

  <BookDetail book={data.book} />

  <!-- Related Books -->
  {#if data.relatedBooks.length > 0}
    <section class="mt-12">
      <h2 class="h2 mb-6">関連書籍</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {#each data.relatedBooks as book}
          <BookCard {book} />
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .breadcrumb ul {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .breadcrumb li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .breadcrumb li:not(:last-child)::after {
    content: '›';
    opacity: 0.5;
  }

  .breadcrumb a {
    opacity: 0.75;
    transition: opacity 0.2s;
  }

  .breadcrumb a:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .breadcrumb li:last-child {
    opacity: 0.75;
  }
</style>
