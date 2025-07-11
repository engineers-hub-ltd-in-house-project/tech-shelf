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
  const rssItems = posts
    .map((post) => {
      const pubDate = (post.publishedAt || post.createdAt).toUTCString();
      const categories = post.tags.map(({ tag }) => tag.name).join(', ');
      const link = `${siteUrl}/blog/${post.slug}`;

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author.name}</author>
      ${categories ? `<category>${categories}</category>` : ''}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tech Shelf Blog</title>
    <description>プログラミングと技術に関する記事</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>SvelteKit</generator>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'max-age=3600',
    },
  });
};
