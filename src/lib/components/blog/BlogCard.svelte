<script lang="ts">
  import type { BlogPost, Tag } from '@prisma/client';

  export let post: BlogPost & { tags: { tag: Tag }[] };
  export let href: string = `/blog/${post.slug}`;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>

<article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
  {#if post.coverImage}
    <figure>
      <img src={post.coverImage} alt={post.title} class="w-full h-48 object-cover" />
    </figure>
  {/if}

  <div class="card-body">
    <h2 class="card-title">
      <a {href} class="hover:text-primary transition-colors">
        {post.title}
      </a>
    </h2>

    {#if post.excerpt}
      <p class="text-base-content/70">{post.excerpt}</p>
    {/if}

    <div class="flex flex-wrap gap-2 mt-2">
      {#each post.tags as { tag }}
        <span class="badge badge-primary badge-sm">{tag.name}</span>
      {/each}
    </div>

    <div class="card-actions justify-between items-center mt-4">
      <span class="text-sm text-base-content/60">
        {formatDate(post.publishedAt || post.createdAt)}
      </span>
      <a {href} class="btn btn-primary btn-sm">続きを読む</a>
    </div>
  </div>
</article>
