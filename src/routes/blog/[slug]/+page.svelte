<script lang="ts">
  import BlogPost from '$lib/components/blog/BlogPost.svelte';
  import BlogCard from '$lib/components/blog/BlogCard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { post, relatedPosts } = data;
</script>

<svelte:head>
  <title>{post.title} - Tech Shelf</title>
  <meta name="description" content={post.excerpt || post.title} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt || post.title} />
  <meta property="og:type" content="article" />
  {#if post.coverImage}
    <meta property="og:image" content={post.coverImage} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.excerpt || post.title} />
  {#if post.coverImage}
    <meta name="twitter:image" content={post.coverImage} />
  {/if}
</svelte:head>

<main class="container mx-auto px-4 py-8">
  <!-- パンくずナビ -->
  <nav class="breadcrumbs text-sm mb-6">
    <ul>
      <li><a href="/" class="text-primary hover:underline">ホーム</a></li>
      <li><a href="/blog" class="text-primary hover:underline">ブログ</a></li>
      <li>{post.title}</li>
    </ul>
  </nav>

  <!-- 記事本文 -->
  <section class="mb-12">
    <BlogPost {post} />
  </section>

  <!-- 著者情報 -->
  <section class="mb-12">
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <div class="flex items-center gap-4">
          {#if post.author.avatar}
            <img src={post.author.avatar} alt={post.author.name} class="w-16 h-16 rounded-full" />
          {:else}
            <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span class="text-primary-content font-bold text-xl">
                {post.author.name.charAt(0)}
              </span>
            </div>
          {/if}
          <div>
            <h3 class="font-semibold text-lg">{post.author.name}</h3>
            <p class="text-base-content/70">この記事を書いた人</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 関連記事 -->
  {#if relatedPosts.length > 0}
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6">関連記事</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each relatedPosts as relatedPost}
          <BlogCard post={relatedPost} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- 記事一覧に戻る -->
  <section class="text-center">
    <a href="/blog" class="btn btn-outline btn-primary"> ← ブログ一覧に戻る </a>
  </section>
</main>
