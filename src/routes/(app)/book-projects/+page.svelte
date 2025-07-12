<script lang="ts">
  import type { PageData } from './$types';
  // import { Card, Button } from '@skeletonlabs/skeleton';
  import {
    BookOpenIcon,
    DocumentAddIcon,
    PencilIcon,
    CheckCircleIcon,
  } from '$lib/components/icons';

  export let data: PageData;

  function getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      draft: '下書き',
      in_progress: '作成中',
      review: 'レビュー中',
      published: '出版済み',
    };
    return statusMap[status] || status;
  }

  function getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      draft: 'variant-ghost-surface',
      in_progress: 'variant-ghost-primary',
      review: 'variant-ghost-warning',
      published: 'variant-ghost-success',
    };
    return colorMap[status] || 'variant-ghost';
  }
</script>

<svelte:head>
  <title>電子書籍プロジェクト一覧 - Tech Shelf</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold">電子書籍プロジェクト</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">ブログ記事から電子書籍を作成・管理します</p>
    </div>
    <a href="/book-projects/create" class="px-4 py-2 text-sm font-medium rounded-lg filled-primary">
      <DocumentAddIcon className="w-5 h-5 mr-2" />
      新規プロジェクト
    </a>
  </div>

  {#if data.projects.length === 0}
    <div class="card p-12 text-center">
      <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h2 class="text-xl font-semibold mb-2">プロジェクトがありません</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        ブログ記事から電子書籍を作成してみましょう
      </p>
      <a
        href="/book-projects/create"
        class="px-4 py-2 text-sm font-medium rounded-lg filled-primary"
      >
        <DocumentAddIcon className="w-5 h-5 mr-2" />
        最初のプロジェクトを作成
      </a>
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.projects as project}
        <div class="card relative overflow-hidden hover:shadow-lg transition-shadow">
          <header class="p-6 pb-4">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-semibold line-clamp-2">
                {project.title}
              </h3>
              <span class="badge {getStatusColor(project.status)} text-xs whitespace-nowrap">
                {getStatusLabel(project.status)}
              </span>
            </div>
            {#if project.description}
              <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {project.description}
              </p>
            {/if}
          </header>

          <section class="px-6 pb-4">
            <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <DocumentAddIcon className="w-4 h-4" />
                <span>{project.postCount} 記事</span>
              </div>
              <div class="flex items-center gap-1">
                <BookOpenIcon className="w-4 h-4" />
                <span>{project.chapterCount} 章</span>
              </div>
            </div>
          </section>

          <footer class="bg-gray-100 dark:bg-gray-800 px-6 py-4">
            <div class="flex justify-between items-center">
              <time class="text-sm text-gray-600 dark:text-gray-400">
                更新: {new Date(project.updatedAt).toLocaleDateString('ja-JP')}
              </time>
              <div class="flex gap-2">
                {#if project.isPublished}
                  <a href="/books/{project.book?.id}" class="btn btn-sm variant-ghost-success">
                    <CheckCircleIcon className="w-4 h-4" />
                  </a>
                {/if}
                <a href="/book-projects/{project.id}" class="btn btn-sm variant-ghost-primary">
                  <PencilIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      {/each}
    </div>
  {/if}
</div>
