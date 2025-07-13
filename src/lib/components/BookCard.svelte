<script lang="ts">
  export let book: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string | null;
    price: number;
    chapterCount: number;
    tags?: Array<{ id: string; name: string; slug: string }>;
  };
</script>

<article class="book-card">
  <a href="/books/{book.id}" class="book-link">
    <div class="book-cover">
      {#if book.coverImage}
        <img src={book.coverImage} alt={book.title} />
      {:else}
        <div class="book-cover-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
      {/if}
    </div>

    <div class="book-info">
      <h3 class="book-title">{book.title}</h3>
      <p class="book-author">{book.author}</p>
      <p class="book-description">{book.description}</p>

      <div class="book-meta">
        <span class="book-chapters">{book.chapterCount}章</span>
        <span class="book-price">¥{book.price.toLocaleString()}</span>
      </div>

      {#if book.tags && book.tags.length > 0}
        <div class="book-tags">
          {#each book.tags as tag}
            <span class="tag">{tag.name}</span>
          {/each}
        </div>
      {/if}
    </div>
  </a>
</article>

<style>
  .book-card {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
  }

  .book-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .book-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .book-cover {
    width: 100%;
    height: 200px;
    background-color: rgb(243 244 246);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .book-cover-placeholder {
    color: rgb(156 163 175);
  }

  .book-info {
    padding: 1.5rem;
  }

  .book-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: rgb(17 24 39);
    margin-bottom: 0.5rem;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-author {
    font-size: 0.875rem;
    color: rgb(107 114 128);
    margin-bottom: 0.75rem;
  }

  .book-description {
    font-size: 0.875rem;
    color: rgb(75 85 99);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .book-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .book-chapters {
    color: rgb(107 114 128);
  }

  .book-price {
    font-weight: 600;
    color: rgb(37 99 235);
  }

  .book-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background-color: rgb(243 244 246);
    color: rgb(75 85 99);
    border-radius: 0.25rem;
  }
</style>
