# Tech Shelf 開発指示書

## プロジェクト概要

Tech Shelfは、技術ブログの執筆から電子書籍の出版までをシームレスに行えるプラットフォームです。SvelteKitを使用して、ブログ機能と電子書籍の作成・閲覧・販売機能を持つWebアプリケーションを開発します。

### 主要機能

- ブログ記事の投稿・管理（会員限定）
- ブログ記事を集約した電子書籍作成
- AIによる電子書籍の自動生成
- Markdownエディタと階層構造管理
- 電子書籍の販売・購入

## 技術スタック

- **フロントエンド**: SvelteKit v2, Svelte 5, TypeScript 5.0+
- **スタイリング**: Tailwind CSS v4 + Skeleton UI v3
- **エディタ**: CodeMirror 6 / Monaco Editor
- **Markdown処理**: marked / remark / MDsveX
- **数式**: KaTeX / MathJax
- **ダイアグラム**: Mermaid
- **データベース**: Supabase (本番) + SQLite (ローカル開発)
- **ORM**: Prisma (SQLite/PostgreSQL両対応)
- **認証**: Supabase Auth (マルチプロバイダー対応)
- **AI**: OpenAI API / Claude API
- **検索**: MeiliSearch (ローカル・本番共通)
- **決済**: Stripe (TypeScript SDK)
- **ファイルストレージ**: Supabase Storage (本番) + ローカルファイル (開発)
- **デプロイ**: Vercel または Netlify
- **電子書籍**: epub.js, PDF.js

## 現在の実装状況 (2025年7月12日更新)

### 完了済み

- ✅ 基本的なプロジェクト構造の構築
- ✅ Tailwind CSS v4 + Skeleton UI v3の統合
- ✅ Prismaスキーマの設計（User, Book, Chapter, Purchase, ReadingSession, Bookmark, BlogPost, Tag）
- ✅ ブログ機能の基本実装（一覧、詳細、タグ、RSS/Atom配信）
- ✅ トップページの実装
- ✅ 基本的なレイアウトとナビゲーション
- ✅ 書籍一覧ページ（/books）の実装
- ✅ 書籍詳細ページ（/books/[id]）の実装
- ✅ 書籍データモデルとサーバーサイドロジック
- ✅ テスト用シードデータ（5冊の書籍）
- ✅ 電子書籍リーダー機能（/reader/[bookId]/[chapterId]）
  - ✅ リーダーコンポーネント（WebReader, TableOfContents, ReadingProgress, ReaderControls）
  - ✅ フォントサイズ調整・テーマ切り替え機能
  - ✅ 章ナビゲーション・目次表示
  - ✅ 読書進捗表示（現在の章/全章数）
- ✅ 認証機能（開発環境用モック認証）
  - ✅ ログイン・登録ページの実装（/login, /register）
  - ✅ プロフィールページの実装（/profile）
  - ✅ ログアウト機能（/logout）
  - ✅ Cookie認証によるセッション管理
  - ✅ 認証状態のグローバル管理（auth store）
- ✅ セットアップドキュメントの整備
  - ✅ 詳細なセットアップガイド（docs/setup-guide.md）
  - ✅ README.mdの更新（Node.js 22以上対応）
- ✅ ブログ投稿機能（Phase 3）
  - ✅ Markdownエディタコンポーネント（CodeMirror 6統合）
  - ✅ アウトラインペイン（階層構造表示）
  - ✅ リアルタイムプレビュー（2ペイン表示）
  - ✅ 記事投稿ページ（/blog/create）
  - ✅ 記事保存APIエンドポイント
  - ✅ ナビゲーションに「新規作成」ボタン追加
  - ✅ 作者本人は下書き記事も閲覧可能
- ✅ PrismaClientのシングルトンインスタンス統一
  - ✅ データベース接続エラーの解決
  - ✅ パフォーマンスの向上
- ✅ ブログ編集機能
  - ✅ 編集ページの作成（/blog/edit/[id]）
  - ✅ 既存記事の編集フォーム
  - ✅ 公開/下書き状態の切り替え
  - ✅ 編集権限チェック（作者本人のみ）
  - ✅ ブログ詳細ページに編集ボタン追加
- ✅ マイブログページ（/blog/my）
  - ✅ 自分の記事一覧表示
  - ✅ 下書き・公開済みのフィルタリング
  - ✅ 編集ボタンの表示
  - ✅ ナビゲーションにリンク追加

### 実装中/課題

- 🔄 Supabase認証への移行準備
  - 現在はモック認証（開発環境用）を使用
  - 本番環境ではSupabase Authへの切り替えが必要
- 🔄 ユーザーデータとPrismaモデルの連携
  - シードデータのtest@example.comユーザーとの統合

### 未実装

- ❌ 本番用認証機能（Supabase Auth統合）
- ❌ 画像アップロード機能
- ❌ タグ・カテゴリ管理機能の強化
- ❌ 予約投稿機能
- ❌ シリーズ管理機能
- ❌ 電子書籍作成機能（ブログ記事からの書籍化）
- ❌ AI書籍生成機能（アウトライン・コンテンツ自動生成）
- ❌ 購入・決済機能（Stripe）
- ❌ 管理画面
- ❌ 検索機能（MeiliSearch）
- ❌ ユーザーライブラリ（購入済み書籍の管理）
- ❌ 読書進捗の永続化（データベース保存）
- ❌ しおり・ハイライト機能
- ❌ epub.js / PDF.js 統合

## データストア設計

### ローカル開発環境

```bash
# SQLite + Prisma で高速開発
npm run dev:setup  # SQLiteファイル作成
npm run db:migrate # スキーマ適用
npm run db:seed    # テストデータ投入
npm run dev        # 開発サーバー起動
```

### 本番環境

```bash
# Supabase PostgreSQL
npm run deploy:staging  # ステージング環境
npm run deploy:prod     # 本番環境
```

### 環境別設定

```typescript
// src/lib/config/database.ts
export const dbConfig = {
  development: {
    provider: 'sqlite',
    url: 'file:./dev.db',
  },
  staging: {
    provider: 'postgresql',
    url: process.env.SUPABASE_DATABASE_URL,
  },
  production: {
    provider: 'postgresql',
    url: process.env.SUPABASE_DATABASE_URL,
  },
};
```

## ディレクトリ構成

```
project-root/
├── src/
│   ├── routes/
│   │   ├── (app)/              # メインアプリ
│   │   │   ├── blog/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── [slug]/
│   │   │   │   ├── create/
│   │   │   │   │   ├── +page.svelte
│   │   │   │   │   └── +page.server.ts
│   │   │   │   └── edit/
│   │   │   │       └── [id]/
│   │   │   ├── books/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── [id]/
│   │   │   │   ├── create/
│   │   │   │   │   ├── +page.svelte
│   │   │   │   │   └── +page.server.ts
│   │   │   │   └── edit/
│   │   │   │       └── [id]/
│   │   │   ├── reader/
│   │   │   │   └── [bookId]/
│   │   │   │       ├── +page.svelte
│   │   │   │       ├── +page.server.ts
│   │   │   │       └── [chapterId]/
│   │   │   │           ├── +page.svelte
│   │   │   │           └── +page.server.ts
│   │   │   └── profile/
│   │   ├── (auth)/             # 認証関連
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── callback/
│   │   ├── (admin)/            # 管理画面
│   │   │   ├── dashboard/
│   │   │   ├── books/
│   │   │   ├── users/
│   │   │   └── analytics/
│   │   ├── api/                # API エンドポイント
│   │   │   ├── books/
│   │   │   ├── auth/
│   │   │   ├── payments/
│   │   │   └── search/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/             # 基本UIコンポーネント
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   └── Card.svelte
│   │   │   ├── layout/
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── Footer.svelte
│   │   │   │   └── Sidebar.svelte
│   │   │   ├── blog/
│   │   │   │   ├── BlogList.svelte
│   │   │   │   ├── BlogPost.svelte
│   │   │   │   └── BlogCard.svelte
│   │   │   ├── books/
│   │   │   │   ├── BookList.svelte
│   │   │   │   ├── BookDetail.svelte
│   │   │   │   └── BookCard.svelte
│   │   │   ├── reader/
│   │   │   │   ├── WebReader.svelte
│   │   │   │   ├── TableOfContents.svelte
│   │   │   │   ├── ReadingProgress.svelte
│   │   │   │   ├── ReaderControls.svelte
│   │   │   │   └── BookmarkPanel.svelte
│   │   │   └── editor/
│   │   │       ├── MarkdownEditor.svelte
│   │   │       ├── OutlinePane.svelte
│   │   │       ├── PreviewPane.svelte
│   │   │       └── EditorToolbar.svelte
│   │   ├── stores/             # Svelte stores
│   │   │   ├── auth.ts
│   │   │   ├── books.ts
│   │   │   ├── reading.ts
│   │   │   ├── editor.ts
│   │   │   └── ui.ts
│   │   ├── server/             # サーバー側ロジック
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   ├── books.ts
│   │   │   ├── chapters.ts
│   │   │   ├── reading.ts
│   │   │   ├── blog.ts
│   │   │   ├── ai.ts
│   │   │   └── payments.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   ├── validation.ts
│   │   │   ├── constants.ts
│   │   │   ├── markdown.ts
│   │   │   └── outline.ts
│   │   ├── types/
│   │   │   ├── book.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   ├── reading.ts
│   │   │   ├── blog.ts
│   │   │   ├── editor.ts
│   │   │   └── api.ts
│   │   └── config/
│   │       ├── database.ts
│   │       ├── auth.ts
│   │       └── environment.ts
│   └── app.html
├── content/                    # 静的コンテンツ
│   ├── blog/
│   ├── books/
│   │   └── rust-guide/
│   └── assets/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── static/
├── tests/
├── docs/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

## 開発フェーズ

### Phase 1: 基盤構築 (2週間) ✅ 完了

- SvelteKitプロジェクト作成
- TypeScript + Tailwind CSS設定
- Prisma スキーマ設計
- ローカル開発環境構築（SQLite）
- 基本認証システム（Supabase Auth）

### Phase 2: 認証・会員機能 (2週間) ✅ 基本実装完了

- ✅ ログイン・サインアップページ（モック認証で実装済み）
- ✅ プロフィール管理ページ
- ✅ セッション管理（Cookie認証）
- 🔄 Supabase Auth統合（本番環境向け）
- ❌ 権限管理システムの完全実装

### Phase 3: ブログ投稿機能 (3週間) ✅ 基本実装完了

- ✅ Markdownエディタ実装
  - ✅ CodeMirror 6統合
  - ✅ リアルタイムプレビュー
  - ✅ 階層構造表示（アウトラインペイン）
- ✅ 記事投稿機能
- ❌ 記事編集機能
- ❌ 画像アップロード（ドラッグ&ドロップ）
- ❌ 下書き・予約投稿
- ❌ シリーズ管理
- ✅ 基本的なタグ管理

### Phase 4: 電子書籍作成機能 (4週間)

- 書籍作成ウィザード
- ブログ記事選択UI
- AI章構成提案
- 統合エディタ実装
  - 階層構造管理
  - 章の並び替え・分割・結合
- プレビュー機能（PDF/ePub）

### Phase 5: AI書籍生成機能 (3週間)

- OpenAI/Claude API統合
- アウトライン自動生成
- コンテンツ生成機能
- 生成管理UI
- 編集・レビュー機能

### Phase 6: 決済・販売機能 (3週間)

- Stripe統合
- 購入フロー実装
- カート機能
- 売上管理ダッシュボード
- 振込処理
- 領収書発行

### Phase 7: 最適化・デプロイ (1週間)

- パフォーマンス最適化
- Supabase本番環境移行
- セキュリティ強化
- 本番デプロイ

## 重要な実装ポイント

### 1. TypeScript型定義

```typescript
// src/lib/types/book.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  price: number;
  currency: 'JPY' | 'USD' | 'EUR';
  language: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
  metadata: BookMetadata;
  tags: string[];
  category: BookCategory;
  difficulty: DifficultyLevel;
  isPublished: boolean;
  authorId: string;
  sourceType: 'manual' | 'blog_posts' | 'ai_generated';
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  estimatedReadingTime: number;
  partNumber: number;
  slug: string;
  sourcePostId?: string; // ブログ記事から作成された場合
}

// src/lib/types/blog.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string; // Markdown
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  estimatedReadingTime: number;
  authorId: string;
  author: User;
  tags: string[];
  seriesId?: string;
  seriesOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogSeries {
  id: string;
  title: string;
  description?: string;
  slug: string;
  authorId: string;
  posts: BlogPost[];
}

// src/lib/types/editor.ts
export interface EditorState {
  content: string;
  outline: Outline[];
  isDirty: boolean;
  autoSaveEnabled: boolean;
  lastSaved?: Date;
}

export interface Outline {
  id: string;
  level: number; // 1-6 (H1-H6)
  text: string;
  line: number;
  children?: Outline[];
}

// src/lib/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'reader' | 'author' | 'admin';
  providers: AuthProvider[];
  purchasedBooks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  provider: 'google' | 'github' | 'email';
  providerId: string;
  email: string;
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  position: number;
  percentage: number;
  lastReadAt: Date;
  device: string;
}
```

### 2. Prisma スキーマ

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = env("DATABASE_PROVIDER") // "sqlite" | "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String            @id @default(cuid())
  email           String            @unique
  name            String
  avatar          String?
  role            String            @default("reader") // "reader" | "author" | "admin"
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relations
  purchasedBooks  Purchase[]
  readingSessions ReadingSession[]
  bookmarks       Bookmark[]
  authoredBooks   Book[]           @relation("BookAuthor")
  blogPosts       BlogPost[]
  blogSeries      BlogSeries[]

  @@map("users")
}

model Book {
  id          String    @id @default(cuid())
  title       String
  author      String
  description String
  coverImage  String?
  price       Float
  currency    String    @default("JPY")
  language    String    @default("ja")
  category    String    @default("other")
  difficulty  String    @default("intermediate")
  isPublished Boolean   @default(false)
  publishedAt DateTime?

  // Book creation source
  sourceType  String    @default("manual") // "manual" | "blog_posts" | "ai_generated"

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  authorId    String
  authorUser  User              @relation("BookAuthor", fields: [authorId], references: [id])
  chapters    Chapter[]
  purchases   Purchase[]
  sessions    ReadingSession[]
  bookmarks   Bookmark[]
  tags        BookTag[]
  bookProject BookCreationProject?

  @@map("books")
}

model Chapter {
  id            String    @id @default(cuid())
  bookId        String
  title         String
  slug          String
  content       String    // Markdown/HTML content
  order         Int
  wordCount     Int       @default(0)
  estimatedReadingTime Int @default(0)
  partNumber    Int       @default(1)

  // Source tracking
  sourcePostId  String?   // If created from blog post

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  book          Book      @relation(fields: [bookId], references: [id])
  sourcePost    BlogPost? @relation("ChapterSource", fields: [sourcePostId], references: [id])

  @@unique([bookId, slug])
  @@map("chapters")
}

model BlogPost {
  id            String         @id @default(cuid())
  slug          String         @unique
  title         String
  content       String         // Markdown content
  excerpt       String?
  coverImage    String?
  published     Boolean        @default(false)
  publishedAt   DateTime?
  views         Int            @default(0)
  likes         Int            @default(0)
  estimatedReadingTime Int     @default(0)

  // Series
  seriesId      String?
  series        BlogSeries?    @relation(fields: [seriesId], references: [id])
  seriesOrder   Int?

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  // Relations
  authorId      String
  author        User           @relation(fields: [authorId], references: [id])
  tags          BlogPostTag[]
  bookChapters  Chapter[]      @relation("ChapterSource")
  bookProjects  BookProjectPost[]

  @@map("blog_posts")
}

model BlogSeries {
  id          String      @id @default(cuid())
  title       String
  description String?
  slug        String      @unique

  // Relations
  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
  posts       BlogPost[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("blog_series")
}

model BookCreationProject {
  id          String    @id @default(cuid())
  name        String
  status      String    @default("draft") // "draft" | "generating" | "editing" | "completed"

  // AI generation settings
  aiModel     String?   // "gpt-4" | "claude-3"
  prompt      String?
  outline     Json?     // AI generated outline

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  bookId      String    @unique
  book        Book      @relation(fields: [bookId], references: [id])
  selectedPosts BookProjectPost[]

  @@map("book_creation_projects")
}

model BookProjectPost {
  id          String    @id @default(cuid())
  order       Int       // Order in the book

  // Relations
  projectId   String
  project     BookCreationProject @relation(fields: [projectId], references: [id])
  postId      String
  post        BlogPost  @relation(fields: [postId], references: [id])

  @@unique([projectId, postId])
  @@map("book_project_posts")
}

// ... その他のモデル（Purchase, ReadingSession, Bookmark, Tag関連）は既存のまま
```

### 3. Svelte Stores

```typescript
// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  return {
    subscribe,
    login: async (provider: 'google' | 'github' | 'email', credentials?: any) => {
      // Supabase Auth実装
    },
    logout: async () => {
      // ログアウト処理
    },
    refresh: async () => {
      // セッション更新
    },
  };
};

export const auth = createAuthStore();

// src/lib/stores/editor.ts
import { writable } from 'svelte/store';
import type { EditorState, Outline } from '$lib/types/editor';

const createEditorStore = () => {
  const { subscribe, set, update } = writable<EditorState>({
    content: '',
    outline: [],
    isDirty: false,
    autoSaveEnabled: true,
  });

  return {
    subscribe,
    updateContent: (content: string) => {
      update((state) => ({ ...state, content, isDirty: true }));
    },
    updateOutline: (outline: Outline[]) => {
      update((state) => ({ ...state, outline }));
    },
    save: async () => {
      // 保存処理
    },
  };
};

export const editor = createEditorStore();
```

### 4. Markdownエディタコンポーネント

```svelte
<!-- src/lib/components/editor/MarkdownEditor.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { editor } from '$lib/stores/editor';
  import type { EditorView } from '@codemirror/view';
  import { markdown } from '@codemirror/lang-markdown';

  export let value: string = '';
  export let placeholder: string = 'Start writing...';

  let editorElement: HTMLDivElement;
  let view: EditorView;

  onMount(() => {
    // CodeMirror 6 初期化
    initializeEditor();

    return () => {
      view?.destroy();
    };
  });

  const initializeEditor = async () => {
    const { EditorView, basicSetup } = await import('@codemirror/basic-setup');
    const { EditorState } = await import('@codemirror/state');

    view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          markdown(),
          // カスタム拡張
        ],
      }),
      parent: editorElement,
    });
  };
</script>

<div class="editor-container">
  <div bind:this={editorElement} class="editor"></div>
</div>

<style>
  .editor-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .editor {
    flex: 1;
    overflow: auto;
  }
</style>
```

## ローカル開発体験の向上

### 開発用スクリプト

```json
// package.json
{
  "scripts": {
    "dev": "vite dev",
    "dev:setup": "npm run db:setup && npm run dev",
    "db:setup": "prisma migrate dev && prisma db seed",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset --force",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write ."
  }
}
```

### 環境変数テンプレート

```bash
# .env.example
# Database
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MeiliSearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_key

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Application
PUBLIC_APP_URL=http://localhost:5173
NODE_ENV=development
```

## セキュリティ考慮事項

1. **認証・認可**
   - Supabase Row Level Security (RLS)
   - APIエンドポイントの保護
   - セッション管理
   - 役割ベースアクセス制御（RBAC）

2. **データ保護**
   - 個人情報の暗号化
   - HTTPSの強制
   - CSRFトークン
   - XSS対策（コンテンツサニタイズ）

3. **決済セキュリティ**
   - Stripe PCI準拠
   - Webhookの検証
   - 決済情報の非保存

4. **コンテンツ保護**
   - 電子書籍のアクセス制御
   - ダウンロード制限
   - AI生成コンテンツの著作権管理
