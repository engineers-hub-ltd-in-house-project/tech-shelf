import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 20,
  });

  const siteUrl = 'https://tech-shelf.example.com'; // 実際のサイトURLに変更
  const atomEntries = posts
    .map((post) => {
      const published = (post.publishedAt || post.createdAt).toISOString();
      const updated = post.updatedAt.toISOString();
      const link = `${siteUrl}/blog/${post.slug}`;
      const categories = post.tags
        .map(({ tag }) => `<category term="${tag.name}" />`)
        .join('\n    ');

      return `
  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link href="${link}" />
    <id>${link}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <author>
      <name>${post.author.name}</name>
    </author>
    <summary type="html"><![CDATA[${post.excerpt || post.title}]]></summary>
    ${categories}
  </entry>`;
    })
    .join('');

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Tech Shelf Blog</title>
  <subtitle>プログラミングと技術に関する記事</subtitle>
  <link href="${siteUrl}/blog/atom.xml" rel="self" />
  <link href="${siteUrl}/blog" />
  <id>${siteUrl}/blog</id>
  <updated>${new Date().toISOString()}</updated>
  <generator uri="https://kit.svelte.dev/" version="1.0">SvelteKit</generator>
  ${atomEntries}
</feed>`;

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/atom+xml',
      'Cache-Control': 'max-age=3600',
    },
  });
};
