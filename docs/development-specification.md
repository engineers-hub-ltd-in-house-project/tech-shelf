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
- **スタイリング**: Tailwind CSS v4 + Flowbite Svelte (Skeleton UI から移行)
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

## 現在の実装状況 (2025年7月13日更新)

### 完了済み

#### Phase 1: 基盤構築 ✅ 完了

- ✅ 基本的なプロジェクト構造の構築
- ✅ Tailwind CSS v4 + Flowbite Svelte の統合（Skeleton UI から移行）
- ✅ Prismaスキーマの設計（全モデル実装済み）
- ✅ 基本的なレイアウトとナビゲーション
- ✅ トップページの実装
- ✅ テスト用シードデータ
- ✅ PrismaClientのシングルトンインスタンス統一
- ✅ セットアップドキュメントの整備

#### Phase 2: 認証・会員機能 ✅ 基本実装完了

- ✅ 認証機能（開発環境用モック認証）
  - ✅ ログイン・登録ページの実装（/login, /register）
  - ✅ プロフィールページの実装（/profile）
  - ✅ ログアウト機能（/logout）
  - ✅ Cookie認証によるセッション管理
  - ✅ 認証状態のグローバル管理（auth store）

#### Phase 3: ブログ投稿機能 ✅ 完了

- ✅ ブログ機能の基本実装（一覧、詳細、タグ、RSS/Atom配信）
- ✅ Markdownエディタ実装
  - ✅ CodeMirror 6統合
  - ✅ リアルタイムプレビュー（2ペイン表示）
  - ✅ 階層構造表示（アウトラインペイン）
  - ✅ ドラッグ&ドロップによる見出し並び替え
  - ✅ 折りたたみ機能
- ✅ 記事投稿機能（/blog/create）
- ✅ 記事編集機能（/blog/edit/[id]）
  - ✅ 既存記事の編集・更新
  - ✅ 公開/下書き状態の切り替え
  - ✅ 編集権限チェック（作者本人のみ）
- ✅ マイブログページ（/blog/my）
  - ✅ 自分の記事一覧表示
  - ✅ 下書き・公開済みのフィルタリング
- ✅ 画像アップロード機能
  - ✅ ドラッグ&ドロップ対応
  - ✅ Base64形式でのDB保存（BlogImageモデル）
  - ✅ 画像配信エンドポイント（/blog/image/[id]）
- ✅ 基本的なタグ管理

#### Phase 4: 電子書籍作成機能 ✅ 部分完了

- ✅ 書籍一覧ページ（/books）の実装
- ✅ 書籍詳細ページ（/books/[id]）の実装
- ✅ 電子書籍リーダー機能（/reader/[bookId]/[chapterId]）
  - ✅ リーダーコンポーネント（WebReader, TableOfContents, ReadingProgress, ReaderControls）
  - ✅ フォントサイズ調整・テーマ切り替え機能
  - ✅ 章ナビゲーション・目次表示
  - ✅ 読書進捗表示（現在の章/全章数）
- ✅ 書籍プロジェクト機能の実装
  - ✅ プロジェクト管理ページ（/book-projects）
  - ✅ プロジェクト作成機能（/book-projects/create）
  - ✅ プロジェクト詳細・編集ページ（/book-projects/[id]）
  - ✅ ブログ記事の選択・追加・削除・並び替え機能
  - ✅ 章の作成・管理・記事割り当て機能
  - ✅ タブベースUI（記事管理/章構成/設定）
  - ✅ ドラッグ&ドロップによる記事並び替え（svelte-dnd-action）
- ✅ 書籍プレビュー機能（/book-projects/[id]/preview）
- ✅ 書籍の最終生成・PDF/ePub出力（2025年7月13日実装完了）

#### その他の実装済み機能

- ✅ 検索機能（/search）
  - ✅ ブログ記事と書籍の横断検索
  - ✅ タイトル、本文、概要、タグでの検索
  - ✅ 検索タイプフィルター

#### テスト実装

- ✅ 単体テスト（Vitest）
- ✅ 統合テスト
- ✅ E2Eテスト（Playwright）
- ✅ 主要機能のテストカバレッジ90%以上

### 実装中/課題

- 🔄 Supabase認証への移行準備
  - 現在はモック認証（開発環境用）を使用
  - 本番環境ではSupabase Authへの切り替えが必要
- 🔄 ユーザーデータとPrismaモデルの連携

### 未実装

#### Phase 4: 電子書籍作成機能（残り）

- ✅ 書籍の最終生成・PDF/ePub出力（2025年7月13日実装完了）
- ❌ AI章構成提案
- ❌ 統合エディタの完全実装（章の分割・結合機能）

#### Phase 5: AI書籍生成機能

- ❌ OpenAI/Claude API統合
- ❌ アウトライン自動生成
- ❌ コンテンツ生成機能
- ❌ 生成管理UI

#### Phase 6: 決済・販売機能

- ❌ Stripe統合
- ❌ 購入フロー実装
- ❌ カート機能
- ❌ 売上管理ダッシュボード
- ❌ 振込処理
- ❌ 領収書発行

#### Phase 7: 最適化・デプロイ

- ❌ パフォーマンス最適化
- ❌ Supabase本番環境移行
- ❌ セキュリティ強化
- ❌ 本番デプロイ

#### その他の未実装機能

- ❌ 本番用認証機能（Supabase Auth統合）
- ❌ タグ・カテゴリ管理機能の強化
- ❌ 予約投稿機能
- ❌ シリーズ管理機能
- ❌ コメント機能
- ❌ 管理画面
- ❌ 高度な検索機能（MeiliSearch統合）
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

### Phase 4: 電子書籍作成機能 (4週間) ✅ 基本実装完了

- ✅ 書籍プロジェクト作成ウィザード
- ✅ ブログ記事選択UI（検索・フィルタリング機能付き）
- ✅ プロジェクト管理機能（一覧・詳細・編集）
- ✅ 記事の追加・削除・並び替え機能
- ✅ 章構成管理
  - ✅ 章の作成・削除
  - ✅ 記事の章への割り当て・解除
  - ✅ タブベースUI（記事管理/章構成/設定）
- ❌ AI章構成提案（未実装）
- ❌ 統合エディタ実装（部分実装）
  - ❌ 章の分割・結合機能
- ❌ プレビュー機能（PDF/ePub）
- ❌ 書籍の最終生成・出版機能

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

  images        BlogImage[]    // 記事に関連する画像

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

model BlogImage {
  id          String   @id @default(cuid())
  blogPostId  String
  filename    String
  mimeType    String
  size        Int
  data        Bytes    // Base64エンコードされた画像データ
  alt         String?
  createdAt   DateTime @default(now())

  // Relations
  blogPost    BlogPost @relation(fields: [blogPostId], references: [id], onDelete: Cascade)

  @@map("blog_images")
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

## 実装済み新機能（2025年7月）

### 1. 階層構造エディタの強化 ✅

- **ドラッグ&ドロップ機能**
  - ✅ `svelte-dnd-action`を使用した見出しの並び替え
  - ✅ リアルタイムでコンテンツの順序を更新
  - ✅ アニメーション付きの視覚的フィードバック

- **折りたたみ機能**
  - ✅ 階層構造の展開/折りたたみ
  - ✅ 折りたたみ状態の保持
  - ✅ 子要素を持つ見出しにインジケーター表示

### 2. 画像アップロード機能 ✅

- **ドラッグ&ドロップ対応**
  - ✅ MarkdownEditorへの画像ドラッグ&ドロップ
  - ✅ 複数画像の同時アップロード対応
  - ✅ アップロード中のプレースホルダー表示

- **画像データ管理**
  - ✅ BlogImageモデルの追加（Base64形式で保存）
  - ✅ 専用エンドポイント（`/blog/image/[id]`）での画像配信
  - ✅ 自動的なMarkdown内のURLの置換

### 3. 検索機能 ✅

- **統合検索ページ（`/search`）**
  - ✅ ブログ記事と書籍の横断検索
  - ✅ タイトル、本文、概要、タグでの検索
  - ✅ 検索タイプフィルター（すべて/ブログ/書籍）

- **UI/UX改善**
  - ✅ ヘッダーに検索バー追加
  - ✅ 検索結果の分類表示
  - ✅ 検索結果がない場合の案内表示

### 4. 書籍プレビュー機能 ✅

- **プレビューページ（`/book-projects/[id]/preview`）**
  - ✅ 書籍化前の構成確認
  - ✅ 章構成と記事の順序表示
  - ✅ 読書体験に近いレイアウト

- **ナビゲーション機能**
  - ✅ 目次からの章移動
  - ✅ 目次の表示/非表示切り替え
  - ✅ スムーズスクロール

## テスト実装方針

### テストフレームワーク・ツール

- **単体テスト**: Vitest + @testing-library/svelte
- **統合テスト**: Vitest + MSW (Mock Service Worker)
- **E2Eテスト**: Playwright
- **コードカバレッジ**: c8 (Vitest内蔵)
- **テストデータ**: Prisma Client モック / Factory関数

### テストファイル構成

```
tests/
├── unit/                      # 単体テスト
│   ├── components/           # コンポーネントテスト
│   │   ├── blog/
│   │   │   ├── BlogCard.test.ts
│   │   │   └── BlogPost.test.ts
│   │   ├── editor/
│   │   │   ├── MarkdownEditor.test.ts
│   │   │   └── OutlinePane.test.ts
│   │   └── reader/
│   │       └── WebReader.test.ts
│   ├── server/               # サーバー側ロジックテスト
│   │   ├── auth.test.ts
│   │   ├── blog.test.ts
│   │   └── database.test.ts
│   └── utils/                # ユーティリティ関数テスト
│       ├── markdown.test.ts
│       └── validation.test.ts
├── integration/              # 統合テスト
│   ├── api/                  # APIエンドポイントテスト
│   │   ├── blog.test.ts
│   │   └── auth.test.ts
│   └── flows/                # ユーザーフローテスト
│       ├── blog-creation.test.ts
│       └── authentication.test.ts
├── e2e/                      # E2Eテスト
│   ├── auth.spec.ts
│   ├── blog.spec.ts
│   └── reader.spec.ts
├── fixtures/                 # テストデータ
│   ├── users.ts
│   ├── posts.ts
│   └── books.ts
└── helpers/                  # テストヘルパー
    ├── setup.ts
    ├── factories.ts
    └── mocks.ts
```

### テスト戦略

#### 1. 単体テスト

**重点テスト対象：**

- 認証・認可ロジック（src/lib/server/auth.ts）
- ブログ投稿・編集機能（src/routes/(app)/blog/）
- Markdownパーサー・アウトライン生成
- バリデーション関数
- Prismaクエリ

**テスト例：**

```typescript
// tests/unit/server/blog.test.ts
describe('Blog Server Functions', () => {
  it('should create a new blog post with tags', async () => {
    // テスト実装
  });

  it('should validate slug uniqueness', async () => {
    // テスト実装
  });

  it('should handle authorization correctly', async () => {
    // テスト実装
  });
});
```

#### 2. 統合テスト

**テスト対象：**

- APIエンドポイントの動作確認
- フォーム送信とデータ処理
- 認証フローの一連の動作
- 外部サービスとの連携（モック使用）

**テスト例：**

```typescript
// tests/integration/api/blog.test.ts
describe('Blog API Integration', () => {
  it('POST /blog/create should create post and redirect', async () => {
    // テスト実装
  });

  it('should handle validation errors properly', async () => {
    // テスト実装
  });
});
```

#### 3. E2Eテスト

**シナリオ：**

1. ユーザー登録 → ログイン → ブログ投稿
2. ブログ記事作成 → 編集 → 公開
3. 記事閲覧 → 電子書籍作成（将来）

**テスト例：**

```typescript
// tests/e2e/blog.spec.ts
test('complete blog creation flow', async ({ page }) => {
  // ログイン
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // ブログ作成
  await page.goto('/blog/create');
  // ... テスト続行
});
```

### テストデータ管理

```typescript
// tests/helpers/factories.ts
export const createUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'author',
  ...overrides,
});

export const createBlogPost = (overrides = {}) => ({
  id: 'test-post-id',
  title: 'Test Post',
  slug: 'test-post',
  content: '# Test Content',
  userId: 'test-user-id',
  isPublished: false,
  ...overrides,
});
```

### CI/CD統合

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

### 実装優先順位

1. **Phase 1**: 既存機能の単体テスト（認証、ブログ投稿・編集） ✅ 完了
2. **Phase 2**: 統合テスト（APIエンドポイント、フォーム処理） ✅ 部分完了
3. **Phase 3**: E2Eテスト（主要ユーザーフロー） ✅ 書籍プロジェクト完了
4. **Phase 4**: パフォーマンステスト・セキュリティテスト ❌ 未実装

### 完了済みテスト実装 (2025年7月12日)

- ✅ **書籍プロジェクト機能の包括的テスト**
  - 単体テスト: プロジェクト作成・更新・削除、記事管理、章管理
  - 統合テスト: APIエンドポイント、認証・認可、バリデーション
  - E2Eテスト: ユーザーフロー全体（プロジェクト作成→記事追加→章構成→設定更新）
  - エラーハンドリング: 不正入力・権限エラー・データ不整合のテスト
- ✅ **テストカバレッジ**: 書籍プロジェクト機能の主要ロジック90%以上

### テストコマンド

```json
// package.json に追加
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --dir tests/unit",
    "test:integration": "vitest run --dir tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch"
  }
}
```

## 🚨 技術スタック変更履歴と実装ガイドライン

### 2025年7月12日: TailwindCSS v4 互換性問題と解決

#### 発生した問題

- **症状**: `Cannot use @variant with unknown variant: md` エラー
- **原因**: Skeleton UI v3.1.4 が TailwindCSS v4 の新しい `@variant` 構文に非対応
- **影響**: 開発サーバー起動不可、CSS コンパイルエラー

#### 解決策: Skeleton UI → Flowbite Svelte への移行

- **選定理由**: TailwindCSS v4 公式対応済み、豊富なコンポーネント（58+）、類似の API
- **移行内容**:
  - `@import '@skeletonlabs/skeleton'` → Flowbite CSS
  - クラス名の変更（`class="card"` → `class="bg-white shadow rounded-lg p-6"`）
  - コンポーネントの段階的更新

#### 学んだ教訓と今後の対策

**第1原則: 技術選定時の互換性確認必須**

- 新技術の組み合わせ時は相互互換性を十分に調査
- ライブラリのロードマップと将来対応予定を事前確認
- 代替案を最低2つ準備してリスク評価を実施

**第2原則: 段階的技術導入**

- 複数の新技術を同時導入する際はリスク評価が必要
- PoC → 部分導入 → 全面展開の段階的アプローチ

**第3原則: ドキュメント更新の義務化**

- 技術変更時は以下を必ず更新：
  - この development-specification.md の技術スタック情報
  - CLAUDE.md の実装指示
  - README.md のセットアップ手順

#### 技術選定チェックリスト

**UI ライブラリ選定時:**

- [ ] TailwindCSS 現在バージョンとの互換性確認
- [ ] 将来バージョンへの対応予定調査
- [ ] Svelte/SvelteKit との互換性確認
- [ ] 必要コンポーネントの提供状況確認
- [ ] ドキュメント充実度とコミュニティサポート評価

**CSS フレームワーク選定時:**

- [ ] 既存 UI ライブラリとの相性確認
- [ ] ビルドシステム（Vite）との互換性確認
- [ ] 移行時の破綻コンポーネント影響調査

#### 緊急時対応プロセス

1. **即座の対応**（30分以内）: 問題の影響範囲特定、切り戻し可能性確認
2. **短期対応**（24時間以内）: 一時的回避策実装、代替案検討開始
3. **長期対応**（1週間以内）: 根本的解決策実装、再発防止策策定

#### 技術スタック互換性マトリックス

| UI ライブラリ   | TailwindCSS v3 | TailwindCSS v4 | Svelte 5 | 採用状況          |
| --------------- | -------------- | -------------- | -------- | ----------------- |
| Skeleton UI     | ✅             | ❌ (開発中)    | ✅       | 旧採用 → 移行済み |
| Flowbite Svelte | ✅             | ✅             | ✅       | **現在採用**      |
| shadcn-svelte   | ✅             | ✅             | ✅       | 代替候補          |
| Melt UI         | ✅             | ✅             | ✅       | ヘッドレス候補    |

この記録により、同様の技術的問題の再発防止と、将来の技術選定時の参考資料とする。

## 📦 書籍生成機能（PDF/ePub）の実装ガイド

### 2025年7月13日: 書籍生成機能の実装完了

#### 概要

書籍プロジェクトからPDF/ePub形式でのダウンロード可能な電子書籍を生成する機能を実装。

#### 実装内容

1. **必要パッケージ**
   - `puppeteer`: ^24.12.1 - PDF生成用ヘッドレスChrome
   - `epub-gen-memory`: ^1.1.2 - ePub形式生成ライブラリ

2. **生成フロー**
   - プロジェクト詳細ページから「書籍を生成」ボタンで開始
   - PDF/ePub形式を選択してモーダルで生成
   - 非同期処理でステータス更新
   - 完了後、ダウンロードリンク表示

3. **ファイル管理**
   - 生成ファイルは `static/generated/` に保存
   - URLパターン: `/generated/[projectId]-[timestamp].[pdf|epub]`
   - 本番環境では適切なオブジェクトストレージへの移行を推奨

#### ローカル開発環境での必要な依存関係

##### WSL2/Ubuntu環境

```bash
# Puppeteer（Chrome）の動作に必要なシステムライブラリ
sudo apt-get update && sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk-bridge2.0-0t64 \
  libcups2t64 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2t64

# 日本語フォント（PDF内の日本語表示に必須）
sudo apt-get install -y fonts-noto-cjk fonts-noto
```

##### macOS環境

```bash
# Homebrewでインストール
brew install --cask chromium

# 日本語フォントは通常システムに含まれている
```

##### Windows環境

- WSL2を使用する場合は上記Ubuntu環境の手順に従う
- ネイティブWindows環境ではPuppeteerが自動的にChromiumをダウンロード

#### 本番環境での考慮事項

##### 1. デプロイ先別の対応

**Vercel/Netlifyなどのサーバーレス環境**

- Puppeteerは動作不可（実行時間・メモリ制限）
- 代替案：
  - 外部API（Puppeteer as a Service、Browserless.io等）
  - AWS Lambda + chrome-aws-lambda
  - 専用のマイクロサービス

**Docker/VPS環境**

```dockerfile
# Dockerfile例
FROM node:22-slim

# Puppeteer依存関係インストール
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-noto-cjk \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer設定
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

**Google Cloud Run**

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/tech-shelf', '.']
```

##### 2. ファイルストレージ

開発環境では `static/generated/` を使用しているが、本番環境では以下を推奨：

- **Supabase Storage**: 既存のSupabase統合と親和性高
- **AWS S3 / Google Cloud Storage**: 大規模配信向け
- **CDN**: CloudFront、Cloudflare等でキャッシュ配信

##### 3. セキュリティ考慮事項

- 生成ファイルへのアクセス制御（認証済みユーザーのみ）
- 一時URLの発行（署名付きURL）
- レート制限（生成処理の負荷対策）

##### 4. スケーリング対策

- 生成処理のキューイング（Bull、BeeQueue等）
- バックグラウンドジョブとして実装
- 生成完了通知（メール、Webhook）

#### 実装時の注意点

1. **メモリ使用量**
   - Puppeteerは大量のメモリを使用
   - 複数同時生成時はメモリ不足に注意

2. **タイムアウト設定**
   - 大きなプロジェクトでは生成に時間がかかる
   - 適切なタイムアウト値の設定が必要

3. **エラーハンドリング**
   - Chrome起動失敗時の再試行
   - 部分的な生成失敗の検知

#### テスト実装済み

- 単体テスト: BookGenerationService の各メソッド
- 統合テスト: 生成エンドポイントの動作確認
- エラーケース: 権限チェック、同時実行制御

#### 今後の改善案

1. **プレビュー機能強化**
   - PDFプレビュー表示
   - ePubオンラインリーダー

2. **カスタマイズオプション**
   - フォントサイズ・余白調整
   - カバーページデザイン
   - 目次スタイル選択

3. **バッチ処理**
   - 複数プロジェクトの一括生成
   - スケジュール生成
