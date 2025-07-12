# Tech Shelf - 電子書籍プラットフォーム

## 概要

Tech Shelfは、技術書籍の閲覧と配信に特化したWebプラットフォームです。ブログ機能と電子書籍機能を統合し、技術者向けの学習環境を提供します。

## 主な機能

- 技術ブログ機能（Markdown対応）
- 書籍プロジェクト管理（ブログ記事から書籍作成）
- ブックマーク・進捗管理
- モック認証システム（開発用）
- タグ管理・分類機能

## 技術スタック

- **フレームワーク**: SvelteKit v2 + Svelte 5
- **言語**: TypeScript 5.0+
- **スタイリング**: TailwindCSS v4 + Flowbite Svelte
- **データベース**: SQLite with Prisma ORM
- **認証**: Mock authentication using cookies (開発用)
- **Markdown**: marked + shiki (コードハイライト)
- **テスト**: Vitest (unit) + Playwright (E2E)
- **コード品質**: ESLint + Prettier + lefthook

## 開発環境のセットアップ

### 前提条件

- Node.js 22以上
- npm

### クイックスタート

```bash
# 依存関係のインストール
npm install

# データベースのセットアップと開発サーバー起動
npm run dev:setup

# または個別実行
npm run db:setup  # マイグレーション + シード
npm run dev       # 開発サーバー起動
```

## プロジェクト構成

```
tech-shelf/
├── src/
│   ├── routes/          # ページとAPIエンドポイント
│   ├── lib/            # 共有コンポーネントとユーティリティ
│   │   ├── components/ # UIコンポーネント
│   │   ├── stores/     # Svelteストア
│   │   ├── server/     # サーバー側ロジック
│   │   └── types/      # TypeScript型定義
│   ├── app.html        # HTMLテンプレート
│   └── app.d.ts        # グローバル型定義
├── static/             # 静的ファイル
├── prisma/             # データベーススキーマ
├── docs/               # ドキュメント
│   └── articles/       # 記事原稿
└── tests/              # テストファイル
```

## 認証システム（開発環境）

開発環境ではモック認証システムを使用しています：

- クッキーベースの認証
- テストユーザーでの自動ログイン
- `requireAuth()` ヘルパー関数による認証チェック

## 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動 (port 5173)
npm run dev:setup       # DB設定 + 開発サーバー起動

# データベース
npm run db:setup        # マイグレーション + シード
npm run db:migrate      # マイグレーション実行
npm run db:seed         # シードデータ投入
npm run db:reset        # データベースリセット
npx prisma studio       # Prisma Studio GUI

# テスト
npm run test            # 全テスト実行
npm run test:unit       # ユニットテストのみ
npm run test:e2e        # E2Eテストのみ
npm run test:watch      # テストウォッチモード

# コード品質
npm run check           # svelte-check (型チェック)
npm run lint            # ESLint + Prettier チェック
npm run format          # コードフォーマット

# ビルド
npm run build           # プロダクションビルド
npm run preview         # ビルド結果プレビュー
```

## 主要機能

### ブログ機能

- Markdownでの記事作成・編集
- タグによる分類
- 公開/下書き管理
- スラッグベースのURL

### 書籍プロジェクト

- ブログ記事から書籍を作成
- 章立て管理
- 記事の順序制御
- プロジェクト進捗管理

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容を議論してください。
