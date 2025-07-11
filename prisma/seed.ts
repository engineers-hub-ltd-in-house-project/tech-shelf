import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.blogTag.deleteMany();
  await prisma.bookTag.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.book.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'テストユーザー',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Rust', slug: 'rust' } }),
    prisma.tag.create({ data: { name: 'プログラミング', slug: 'programming' } }),
    prisma.tag.create({ data: { name: '初心者向け', slug: 'beginner' } }),
    prisma.tag.create({ data: { name: '設計', slug: 'design' } }),
    prisma.tag.create({ data: { name: 'DDD', slug: 'ddd' } }),
  ]);

  // Create blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        userId: user.id,
        title: 'Rustプログラミング入門：なぜ今Rustなのか',
        slug: 'rust-introduction',
        content:
          '# Rustプログラミング入門\n\nRustは、安全性、速度、並行性を重視したシステムプログラミング言語です。',
        excerpt: 'Rustの基本概念と、なぜ今Rustを学ぶべきかについて解説します。',
        coverImage: '/images/rust-intro.jpg',
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
        viewCount: 150,
        tags: {
          create: [{ tagId: tags[0].id }, { tagId: tags[1].id }, { tagId: tags[2].id }],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        userId: user.id,
        title: 'RustでWebアプリケーションを作る',
        slug: 'rust-web-application',
        content:
          '# RustでWebアプリケーション開発\n\nActix-webを使用したWebアプリケーション開発の手順を解説します。',
        excerpt: 'Actix-webフレームワークを使用したRust製Webアプリケーションの構築方法',
        coverImage: '/images/rust-web.jpg',
        isPublished: true,
        publishedAt: new Date('2024-02-01'),
        viewCount: 230,
        tags: {
          create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        userId: user.id,
        title: 'ドメイン駆動設計（DDD）とRust',
        slug: 'ddd-with-rust',
        content: '# DDDとRust\n\nRustでドメイン駆動設計を実践する方法について詳しく解説します。',
        excerpt: 'Rustの型システムを活用したドメイン駆動設計の実装パターン',
        coverImage: '/images/ddd-rust.jpg',
        isPublished: true,
        publishedAt: new Date('2024-02-15'),
        viewCount: 180,
        tags: {
          create: [{ tagId: tags[0].id }, { tagId: tags[3].id }, { tagId: tags[4].id }],
        },
      },
    }),
  ]);

  // Create books
  const rustBook = await prisma.book.create({
    data: {
      title: 'Rust実践ガイド',
      author: 'テストユーザー',
      description: 'Rustの基礎から実践的なアプリケーション開発まで学べる総合ガイド',
      coverImage: '/images/rust-guide-cover.jpg',
      price: 2980,
      currency: 'JPY',
      language: 'ja',
      isPublished: true,
      publishedAt: new Date('2024-01-01'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
      },
    },
  });

  // Create chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: rustBook.id,
        title: '第1章：Rustの基礎',
        content: '# 第1章：Rustの基礎\n\nRustプログラミングの基本的な概念を学びます。',
        order: 1,
        wordCount: 5000,
        estimatedReadingTime: 15,
        partNumber: 1,
        slug: 'chapter-1-basics',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: rustBook.id,
        title: '第2章：所有権システム',
        content:
          '# 第2章：所有権システム\n\nRustの最も重要な概念である所有権について詳しく解説します。',
        order: 2,
        wordCount: 8000,
        estimatedReadingTime: 25,
        partNumber: 1,
        slug: 'chapter-2-ownership',
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
