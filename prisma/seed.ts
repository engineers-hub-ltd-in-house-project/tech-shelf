import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bookProjectPost.deleteMany();
  await prisma.bookProjectChapter.deleteMany();
  await prisma.bookCreationProject.deleteMany();
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
      role: 'author',
    },
  });

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Rust', slug: 'rust' } }),
    prisma.tag.create({ data: { name: 'プログラミング', slug: 'programming' } }),
    prisma.tag.create({ data: { name: '初心者向け', slug: 'beginner' } }),
    prisma.tag.create({ data: { name: '設計', slug: 'design' } }),
    prisma.tag.create({ data: { name: 'DDD', slug: 'ddd' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'Docker', slug: 'docker' } }),
    prisma.tag.create({ data: { name: 'Kubernetes', slug: 'kubernetes' } }),
    prisma.tag.create({ data: { name: 'AWS', slug: 'aws' } }),
    prisma.tag.create({ data: { name: 'データベース', slug: 'database' } }),
    prisma.tag.create({ data: { name: 'アーキテクチャ', slug: 'architecture' } }),
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
      description:
        'Rustの基礎から実践的なアプリケーション開発まで学べる総合ガイド。所有権システム、並行プログラミング、Webアプリケーション開発まで幅広くカバー。',
      coverImage:
        'https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Rust%E5%AE%9F%E8%B7%B5%E3%82%AC%E3%82%A4%E3%83%89',
      price: 2980,
      currency: 'JPY',
      language: 'ja',
      category: 'programming',
      difficulty: 'intermediate',
      isPublished: true,
      publishedAt: new Date('2024-01-01'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
      },
    },
  });

  const tsBook = await prisma.book.create({
    data: {
      title: 'TypeScript完全ガイド',
      author: 'テストユーザー',
      description:
        'TypeScriptの基本から応用まで、型システムを活用した堅牢なアプリケーション開発を学ぶ。React、Next.jsとの統合も詳しく解説。',
      coverImage:
        'https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=TypeScript%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89',
      price: 3480,
      currency: 'JPY',
      language: 'ja',
      category: 'web',
      difficulty: 'intermediate',
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[5].id }, { tagId: tags[1].id }, { tagId: tags[6].id }],
      },
    },
  });

  const dockerBook = await prisma.book.create({
    data: {
      title: '実践Docker & Kubernetes',
      author: 'テストユーザー',
      description:
        'コンテナ技術の基礎から本番環境での運用まで。DockerとKubernetesを使った現代的なアプリケーション開発・デプロイメント手法を解説。',
      coverImage:
        'https://via.placeholder.com/400x600/45B7D1/FFFFFF?text=Docker%20%26%20Kubernetes',
      price: 3980,
      currency: 'JPY',
      language: 'ja',
      category: 'devops',
      difficulty: 'advanced',
      isPublished: true,
      publishedAt: new Date('2024-02-01'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[8].id }, { tagId: tags[9].id }],
      },
    },
  });

  const beginnerBook = await prisma.book.create({
    data: {
      title: 'プログラミング入門',
      author: 'テストユーザー',
      description:
        'プログラミング初心者のための入門書。変数、条件分岐、ループなどの基本概念から、簡単なWebアプリケーション作成まで。',
      coverImage:
        'https://via.placeholder.com/400x600/F7DC6F/333333?text=%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E5%85%A5%E9%96%80',
      price: 0,
      currency: 'JPY',
      language: 'ja',
      category: 'programming',
      difficulty: 'beginner',
      isPublished: true,
      publishedAt: new Date('2023-12-01'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[1].id }, { tagId: tags[2].id }],
      },
    },
  });

  const dddBook = await prisma.book.create({
    data: {
      title: 'ドメイン駆動設計実践入門',
      author: 'テストユーザー',
      description:
        'DDDの基本概念から実装パターンまで。集約、エンティティ、値オブジェクトなどの実装方法を具体的なコード例とともに解説。',
      coverImage:
        'https://via.placeholder.com/400x600/9B59B6/FFFFFF?text=DDD%E5%AE%9F%E8%B7%B5%E5%85%A5%E9%96%80',
      price: 4280,
      currency: 'JPY',
      language: 'ja',
      category: 'programming',
      difficulty: 'advanced',
      isPublished: true,
      publishedAt: new Date('2024-02-15'),
      authorId: user.id,
      tags: {
        create: [{ tagId: tags[4].id }, { tagId: tags[3].id }, { tagId: tags[12].id }],
      },
    },
  });

  // Create chapters for each book
  // Rust Book Chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: rustBook.id,
        title: '第1章：Rustの基礎',
        content:
          '# 第1章：Rustの基礎\n\nRustプログラミングの基本的な概念を学びます。変数、データ型、関数の定義方法など、Rustプログラミングの第一歩を踏み出しましょう。',
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
          '# 第2章：所有権システム\n\nRustの最も重要な概念である所有権について詳しく解説します。借用、ライフタイム、ムーブセマンティクスなど、メモリ安全性を保証する仕組みを理解しましょう。',
        order: 2,
        wordCount: 8000,
        estimatedReadingTime: 25,
        partNumber: 1,
        slug: 'chapter-2-ownership',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: rustBook.id,
        title: '第3章：構造体とenum',
        content:
          '# 第3章：構造体とenum\n\nRustのカスタムデータ型について学びます。構造体、enum、パターンマッチングを使った効率的なデータ処理の方法を解説します。',
        order: 3,
        wordCount: 6500,
        estimatedReadingTime: 20,
        partNumber: 1,
        slug: 'chapter-3-structs-enums',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: rustBook.id,
        title: '第4章：エラーハンドリング',
        content:
          '# 第4章：エラーハンドリング\n\nResult型とOption型を使った安全なエラー処理の方法を学びます。panic!の使い方と、より良いエラー処理の実装パターンを紹介します。',
        order: 1,
        wordCount: 5500,
        estimatedReadingTime: 18,
        partNumber: 2,
        slug: 'chapter-4-error-handling',
      },
    }),
  ]);

  // TypeScript Book Chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: tsBook.id,
        title: '第1章：TypeScriptの基本',
        content:
          '# 第1章：TypeScriptの基本\n\nTypeScriptの基本的な型システムについて学びます。基本型、型推論、型アノテーションの使い方を解説します。',
        order: 1,
        wordCount: 4500,
        estimatedReadingTime: 15,
        partNumber: 1,
        slug: 'ts-chapter-1-basics',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: tsBook.id,
        title: '第2章：高度な型機能',
        content:
          '# 第2章：高度な型機能\n\nジェネリクス、条件型、マップ型など、TypeScriptの高度な型機能を活用する方法を学びます。',
        order: 2,
        wordCount: 7000,
        estimatedReadingTime: 22,
        partNumber: 1,
        slug: 'ts-chapter-2-advanced-types',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: tsBook.id,
        title: '第3章：Reactとの統合',
        content:
          '# 第3章：Reactとの統合\n\nTypeScriptとReactを組み合わせた開発方法を学びます。コンポーネントの型付け、Hooksの型定義などを解説します。',
        order: 3,
        wordCount: 6000,
        estimatedReadingTime: 20,
        partNumber: 1,
        slug: 'ts-chapter-3-react',
      },
    }),
  ]);

  // Docker Book Chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: dockerBook.id,
        title: '第1章：コンテナ技術の基礎',
        content:
          '# 第1章：コンテナ技術の基礎\n\nDockerの基本概念とコンテナ技術について学びます。仮想化との違い、コンテナのメリットを理解しましょう。',
        order: 1,
        wordCount: 5000,
        estimatedReadingTime: 16,
        partNumber: 1,
        slug: 'docker-chapter-1-basics',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: dockerBook.id,
        title: '第2章：Dockerfile実践',
        content:
          '# 第2章：Dockerfile実践\n\n効率的なDockerfileの書き方を学びます。マルチステージビルド、キャッシュの活用、セキュリティベストプラクティスを解説します。',
        order: 2,
        wordCount: 6500,
        estimatedReadingTime: 20,
        partNumber: 1,
        slug: 'docker-chapter-2-dockerfile',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: dockerBook.id,
        title: '第3章：Kubernetes入門',
        content:
          '# 第3章：Kubernetes入門\n\nKubernetesの基本概念とアーキテクチャを学びます。Pod、Service、Deploymentなどの基本リソースを理解しましょう。',
        order: 1,
        wordCount: 7500,
        estimatedReadingTime: 24,
        partNumber: 2,
        slug: 'docker-chapter-3-k8s-intro',
      },
    }),
  ]);

  // Beginner Book Chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: beginnerBook.id,
        title: '第1章：プログラミングとは',
        content:
          '# 第1章：プログラミングとは\n\nプログラミングの基本的な概念を学びます。コンピュータがどのように動作するか、プログラムとは何かを理解しましょう。',
        order: 1,
        wordCount: 3000,
        estimatedReadingTime: 10,
        partNumber: 1,
        slug: 'beginner-chapter-1-intro',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: beginnerBook.id,
        title: '第2章：変数とデータ型',
        content:
          '# 第2章：変数とデータ型\n\n変数の概念とさまざまなデータ型について学びます。数値、文字列、真偽値などの基本的なデータ型を理解しましょう。',
        order: 2,
        wordCount: 4000,
        estimatedReadingTime: 13,
        partNumber: 1,
        slug: 'beginner-chapter-2-variables',
      },
    }),
  ]);

  // DDD Book Chapters
  await Promise.all([
    prisma.chapter.create({
      data: {
        bookId: dddBook.id,
        title: '第1章：DDDの基本概念',
        content:
          '# 第1章：DDDの基本概念\n\nドメイン駆動設計の基本的な考え方を学びます。ユビキタス言語、境界づけられたコンテキストなどの重要概念を理解しましょう。',
        order: 1,
        wordCount: 6000,
        estimatedReadingTime: 19,
        partNumber: 1,
        slug: 'ddd-chapter-1-concepts',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: dddBook.id,
        title: '第2章：エンティティと値オブジェクト',
        content:
          '# 第2章：エンティティと値オブジェクト\n\nDDDの基本的な構成要素であるエンティティと値オブジェクトの違いと実装方法を学びます。',
        order: 2,
        wordCount: 7500,
        estimatedReadingTime: 24,
        partNumber: 1,
        slug: 'ddd-chapter-2-entities-vo',
      },
    }),
    prisma.chapter.create({
      data: {
        bookId: dddBook.id,
        title: '第3章：集約とリポジトリ',
        content:
          '# 第3章：集約とリポジトリ\n\n集約の設計方法とリポジトリパターンの実装を学びます。トランザクション境界の設計についても解説します。',
        order: 3,
        wordCount: 8000,
        estimatedReadingTime: 25,
        partNumber: 1,
        slug: 'ddd-chapter-3-aggregates',
      },
    }),
  ]);

  // Create book creation projects
  const bookProject1 = await prisma.bookCreationProject.create({
    data: {
      userId: user.id,
      title: 'Rust Web開発実践ガイド',
      description: 'RustでWebアプリケーションを作るための実践的なガイドブック',
      status: 'draft',
      posts: {
        create: [
          {
            blogPostId: blogPosts[0].id,
            order: 0,
            includeInBook: true,
          },
          {
            blogPostId: blogPosts[1].id,
            order: 1,
            includeInBook: true,
          },
        ],
      },
      chapters: {
        create: [
          {
            title: '第1章 Rustの基礎',
            order: 0,
            content: 'Rustの基本的な概念について説明します',
          },
          {
            title: '第2章 Webフレームワーク',
            order: 1,
            content: 'Actix-webを使ったWeb開発の基礎',
          },
        ],
      },
    },
  });

  const bookProject2 = await prisma.bookCreationProject.create({
    data: {
      userId: user.id,
      title: 'ドメイン駆動設計実践',
      description: 'DDDの概念をRustで実装する方法を解説',
      status: 'in_progress',
      posts: {
        create: [
          {
            blogPostId: blogPosts[2].id,
            order: 0,
            includeInBook: true,
          },
        ],
      },
    },
  });

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
