<script lang="ts">
  import type { PageData } from './$types';
  import BlogCard from '$lib/components/blog/BlogCard.svelte';
  import BookCard from '$lib/components/BookCard.svelte';

  export let data: PageData;

  let searchQuery = data.query || '';
  let searchType = data.type || 'all';
  let isSearching = false;
</script>

<svelte:head>
  <title>検索 | Tech Shelf</title>
</svelte:head>

<div class="search-page">
  <div class="search-header">
    <h1>検索</h1>
    <form method="GET" class="search-form">
      <div class="search-input-wrapper">
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
          class="search-icon"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          name="q"
          bind:value={searchQuery}
          placeholder="ブログ記事や書籍を検索..."
          class="search-input"
          on:input={() => (isSearching = false)}
        />
      </div>

      <div class="search-filters">
        <label class="filter-option">
          <input type="radio" name="type" value="all" bind:group={searchType} />
          すべて
        </label>
        <label class="filter-option">
          <input type="radio" name="type" value="blog" bind:group={searchType} />
          ブログ記事
        </label>
        <label class="filter-option">
          <input type="radio" name="type" value="book" bind:group={searchType} />
          書籍
        </label>
      </div>

      <button type="submit" class="search-button" on:click={() => (isSearching = true)}>
        検索
      </button>
    </form>
  </div>

  {#if data.query}
    <div class="search-results">
      <div class="results-summary">
        「<strong>{data.query}</strong>」の検索結果：
        {data.blogPosts.length + data.books.length}件
      </div>

      {#if data.blogPosts.length > 0 && (searchType === 'all' || searchType === 'blog')}
        <section class="results-section">
          <h2>ブログ記事 ({data.blogPosts.length}件)</h2>
          <div class="blog-grid">
            {#each data.blogPosts as post}
              <BlogCard {post} />
            {/each}
          </div>
        </section>
      {/if}

      {#if data.books.length > 0 && (searchType === 'all' || searchType === 'book')}
        <section class="results-section">
          <h2>書籍 ({data.books.length}件)</h2>
          <div class="book-grid">
            {#each data.books as book}
              <BookCard {book} />
            {/each}
          </div>
        </section>
      {/if}

      {#if data.blogPosts.length === 0 && data.books.length === 0}
        <div class="no-results">
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
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <path d="M8 8l6 6"></path>
            <path d="M14 8l-6 6"></path>
          </svg>
          <p>検索結果が見つかりませんでした</p>
          <p class="no-results-hint">別のキーワードで検索してみてください</p>
        </div>
      {/if}
    </div>
  {:else if !isSearching}
    <div class="search-placeholder">
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
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <p>キーワードを入力して検索してください</p>
    </div>
  {/if}
</div>

<style>
  .search-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .search-header {
    margin-bottom: 3rem;
  }

  .search-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: rgb(17 24 39);
    margin-bottom: 2rem;
  }

  .search-form {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  .search-input-wrapper {
    position: relative;
    margin-bottom: 1rem;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(156 163 175);
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 1rem;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.375rem;
    transition: all 0.15s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: rgb(59 130 246);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-filters {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgb(55 65 81);
    cursor: pointer;
  }

  .filter-option input[type='radio'] {
    cursor: pointer;
  }

  .search-button {
    padding: 0.75rem 2rem;
    background-color: rgb(37 99 235);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .search-button:hover {
    background-color: rgb(29 78 216);
  }

  .search-results {
    margin-top: 2rem;
  }

  .results-summary {
    font-size: 0.875rem;
    color: rgb(107 114 128);
    margin-bottom: 2rem;
  }

  .results-summary strong {
    color: rgb(17 24 39);
  }

  .results-section {
    margin-bottom: 3rem;
  }

  .results-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: rgb(17 24 39);
    margin-bottom: 1.5rem;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .no-results,
  .search-placeholder {
    text-align: center;
    padding: 4rem 2rem;
    color: rgb(107 114 128);
  }

  .no-results svg,
  .search-placeholder svg {
    margin: 0 auto 1.5rem;
    color: rgb(209 213 219);
  }

  .no-results p,
  .search-placeholder p {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .no-results-hint {
    font-size: 0.875rem;
    color: rgb(156 163 175);
  }

  @media (max-width: 768px) {
    .search-page {
      padding: 1rem;
    }

    .search-filters {
      flex-wrap: wrap;
    }

    .blog-grid,
    .book-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
