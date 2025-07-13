<script lang="ts">
  import type { BookWithChapters } from '$lib/server/books';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  export let book: BookWithChapters;

  const placeholderImage = '/images/books/no-cover.svg';

  const categoryLabels: Record<string, string> = {
    programming: 'プログラミング',
    web: 'Web開発',
    mobile: 'モバイル開発',
    ai: 'AI・機械学習',
    security: 'セキュリティ',
    database: 'データベース',
    devops: 'DevOps',
    other: 'その他',
  };

  const difficultyLabels: Record<string, string> = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  };

  // 章をパートごとにグループ化
  $: chaptersByPart = book.chapters.reduce(
    (acc, chapter) => {
      if (!acc[chapter.partNumber]) {
        acc[chapter.partNumber] = [];
      }
      acc[chapter.partNumber]!.push(chapter);
      return acc;
    },
    {} as Record<number, typeof book.chapters>
  );

  $: totalWordCount = book.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  $: estimatedReadingTime = Math.ceil(totalWordCount / 400); // 分（400文字/分）
</script>

<div class="space-y-8">
  <!-- Book Header -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Cover Image -->
    <div class="md:col-span-1">
      <div class="card overflow-hidden">
        <img
          src={book.coverImage || placeholderImage}
          alt="{book.title} cover"
          class="w-full h-auto"
        />
      </div>
    </div>

    <!-- Book Info -->
    <div class="md:col-span-2 space-y-6">
      <div>
        <h1 class="h1 mb-2">{book.title}</h1>
        <p class="text-xl opacity-75">{book.author}</p>
      </div>

      <div class="prose dark:prose-invert max-w-none">
        <p>{book.description}</p>
      </div>

      <!-- Metadata -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="opacity-75">カテゴリ:</span>
          <span class="ml-2">{categoryLabels[book.category] || book.category}</span>
        </div>
        <div>
          <span class="opacity-75">難易度:</span>
          <span class="ml-2">{difficultyLabels[book.difficulty] || book.difficulty}</span>
        </div>
        <div>
          <span class="opacity-75">言語:</span>
          <span class="ml-2">{book.language === 'ja' ? '日本語' : book.language}</span>
        </div>
        <div>
          <span class="opacity-75">公開日:</span>
          <span class="ml-2">{book.publishedAt ? formatDate(book.publishedAt) : '-'}</span>
        </div>
        <div>
          <span class="opacity-75">総文字数:</span>
          <span class="ml-2">{totalWordCount.toLocaleString()}文字</span>
        </div>
        <div>
          <span class="opacity-75">読了目安:</span>
          <span class="ml-2">約{estimatedReadingTime}分</span>
        </div>
      </div>

      <!-- Tags -->
      {#if book.tags.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each book.tags as tag}
            <a href="/books?tag={encodeURIComponent(tag)}" class="badge variant-soft">
              {tag}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Price & Action -->
      <div class="card variant-soft p-4 flex items-center justify-between">
        <div>
          <div class="text-2xl font-bold">
            {#if book.price === 0}
              無料
            {:else}
              {formatCurrency(book.price, book.currency)}
            {/if}
          </div>
          <div class="text-sm opacity-75">
            全{book.chapterCount}章
          </div>
        </div>

        <div class="flex gap-2">
          {#if book.chapters.length > 0}
            <a href="/reader/{book.id}" class="btn variant-filled-primary">
              {#if book.price === 0}
                無料で読む
              {:else}
                読み始める
              {/if}
            </a>
          {:else}
            <button class="btn variant-filled-primary" disabled> 準備中 </button>
          {/if}
          <button class="btn variant-soft"> サンプルを読む </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="card p-6">
    <h2 class="h2 mb-4">目次</h2>

    <div class="space-y-6">
      {#each Object.entries(chaptersByPart) as [partNum, chapters]}
        <div>
          {#if Object.keys(chaptersByPart).length > 1}
            <h3 class="h4 mb-3">第{partNum}部</h3>
          {/if}

          <ol class="space-y-2">
            {#each chapters as chapter}
              <li class="flex items-start gap-3">
                <span class="text-sm opacity-50 mt-1">
                  {chapter.order}.
                </span>
                <div class="flex-1">
                  <a href="/reader/{book.id}/{chapter.id}" class="hover:underline">
                    {chapter.title}
                  </a>
                  <div class="text-sm opacity-75">
                    {chapter.wordCount.toLocaleString()}文字 • 約{Math.ceil(
                      chapter.estimatedReadingTime
                    )}分
                  </div>
                </div>
              </li>
            {/each}
          </ol>
        </div>
      {/each}
    </div>
  </div>

  <!-- Author Info -->
  <div class="card p-6">
    <h2 class="h3 mb-4">著者について</h2>
    <div class="flex items-center gap-4">
      {#if book.authorUser.avatar}
        <img
          src={book.authorUser.avatar}
          alt={book.authorUser.name}
          class="w-16 h-16 rounded-full"
        />
      {:else}
        <div
          class="w-16 h-16 rounded-full bg-surface-400-500-token flex items-center justify-center"
        >
          <span class="text-2xl">{book.authorUser.name.charAt(0)}</span>
        </div>
      {/if}
      <div>
        <h3 class="h4">{book.authorUser.name}</h3>
        <p class="text-sm opacity-75">著者</p>
      </div>
    </div>
  </div>
</div>
