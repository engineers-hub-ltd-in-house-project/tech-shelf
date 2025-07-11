# SvelteKit電子書籍プラットフォーム開発指示書

## プロジェクト概要

SvelteKitを使用して、ブログ機能と電子書籍閲覧・配信機能を持つWebプラットフォームを開発する。マルチアカウント対応、優れたローカル開発体験を重視。

## 技術スタック

- **フロントエンド**: SvelteKit v2, Svelte 5, TypeScript 5.0+
- **スタイリング**: Tailwind CSS v4 + Skeleton UI v3
- **データベース**: Supabase (本番) + SQLite (ローカル開発)
- **ORM**: Prisma (SQLite/PostgreSQL両対応)
- **認証**: Supabase Auth (マルチプロバイダー対応)
- **検索**: MeiliSearch (ローカル・本番共通)
- **決済**: Stripe (TypeScript SDK)
- **ファイルストレージ**: Supabase Storage (本番) + ローカルファイル (開発)
- **デプロイ**: Vercel または Netlify
- **電子書籍**: epub.js, PDF.js

## 現在の実装状況 (2025年7月11日)

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

### 未実装

- ❌ 電子書籍リーダー機能（/reader/[bookId]/[chapter]）
- ❌ 認証機能（Supabase Auth）
- ❌ 購入・決済機能（Stripe）
- ❌ 管理画面
- ❌ 検索機能（MeiliSearch）
- ❌ ユーザープロフィール・ライブラリ
- ❌ 読書進捗トラッキング

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
│   │   │   │   └── +layout.svelte
│   │   │   ├── books/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── [id]/
│   │   │   │   └── +layout.svelte
│   │   │   ├── reader/
│   │   │   │   └── [bookId]/
│   │   │   │       ├── +page.svelte
│   │   │   │       └── [chapter]/
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
│   │   │   └── reader/
│   │   │       ├── WebReader.svelte
│   │   │       ├── TableOfContents.svelte
│   │   │       ├── BookmarkPanel.svelte
│   │   │       └── ReadingProgress.svelte
│   │   ├── stores/             # Svelte stores
│   │   │   ├── auth.ts
│   │   │   ├── books.ts
│   │   │   ├── reading.ts
│   │   │   └── ui.ts
│   │   ├── server/             # サーバー側ロジック
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   ├── books.ts
│   │   │   └── payments.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   ├── types/
│   │   │   ├── book.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
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

### Phase 1: 基盤構築 (2週間)

- SvelteKitプロジェクト作成
- TypeScript + Tailwind CSS設定
- Prisma スキーマ設計
- ローカル開発環境構築（SQLite）
- 基本認証システム（Supabase Auth）

### Phase 2: ブログ機能 (2週間)

- Markdownブログシステム
- mdsvex設定（拡張Markdown）
- 記事一覧・詳細ページ
- カテゴリ・タグ機能
- RSS/Atom配信

### Phase 3: 電子書籍基本機能 (3週間)

- 書籍データモデル実装
- ファイルアップロード機能
- 書籍一覧・詳細ページ
- 章立て管理システム
- MeiliSearch統合

### Phase 4: 電子書籍閲覧機能 (3週間)

- Web Reader実装（epub.js）
- 読書進捗トラッキング
- しおり・ハイライト機能
- レスポンシブ設計
- PWA対応

### Phase 5: マルチアカウント機能 (2週間)

- 複数認証プロバイダー対応
- ユーザープロフィール管理
- 購入履歴・ライブラリ
- マルチデバイス同期

### Phase 6: 管理・決済機能 (2週間)

- 管理ダッシュボード
- Stripe決済統合
- 売上分析
- コンテンツ管理

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
}

// src/lib/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relations
  purchasedBooks  Purchase[]
  readingSessions ReadingSession[]
  bookmarks       Bookmark[]
  authoredBooks   Book[]           @relation("BookAuthor")

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
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  authorId    String
  authorUser  User        @relation("BookAuthor", fields: [authorId], references: [id])
  chapters    Chapter[]
  purchases   Purchase[]
  sessions    ReadingSession[]
  bookmarks   Bookmark[]

  @@map("books")
}
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

// src/lib/stores/reading.ts
import { writable } from 'svelte/store';
import type { ReadingSession } from '$lib/types/user';

const createReadingStore = () => {
  const { subscribe, set, update } = writable<{
    currentSession: ReadingSession | null;
    sessions: ReadingSession[];
  }>({
    currentSession: null,
    sessions: [],
  });

  return {
    subscribe,
    updateProgress: async (bookId: string, chapterId: string, position: number) => {
      // 読書進捗更新
    },
    syncAcrossDevices: async () => {
      // デバイス間同期
    },
  };
};

export const reading = createReadingStore();
```

### 4. Web Reader コンポーネント

```svelte
<!-- src/lib/components/reader/WebReader.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { reading } from '$lib/stores/reading';
  import type { Book, Chapter } from '$lib/types/book';

  export let book: Book;
  export let currentChapter: Chapter;

  let readerContainer: HTMLDivElement;
  let fontSize = 16;
  let theme: 'light' | 'dark' = 'light';
  let readingProgress = 0;

  onMount(() => {
    // epub.js initialization
    initializeReader();
  });

  const initializeReader = () => {
    // Reader setup
  };

  const updateReadingPosition = (position: number) => {
    reading.updateProgress(book.id, currentChapter.id, position);
  };
</script>

<div class="reader-wrapper" class:dark={theme === 'dark'}>
  <div class="reader-controls">
    <button on:click={() => fontSize--}>A-</button>
    <span>{fontSize}px</span>
    <button on:click={() => fontSize++}>A+</button>
    <button on:click={() => (theme = theme === 'light' ? 'dark' : 'light')}> 🌓 </button>
  </div>

  <div bind:this={readerContainer} class="reader-content" style="font-size: {fontSize}px">
    {@html currentChapter.content}
  </div>

  <div class="progress-bar">
    <div class="progress" style="width: {readingProgress}%"></div>
  </div>
</div>

<style>
  .reader-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .reader-content {
    flex: 1;
    padding: 2rem;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
  }

  .dark .reader-content {
    background: #1a1a1a;
    color: #e0e0e0;
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

2. **データ保護**
   - 個人情報の暗号化
   - HTTPSの強制
   - CSRFトークン

3. **決済セキュリティ**
   - Stripe PCI準拠
   - Webhookの検証
   - 決済情報の非保存

4. **コンテンツ保護**
   - 電子書籍のDRM考慮
   - アクセス制御
   - ダウンロード制限
