# Tech Shelf - 電子書籍プラットフォーム

## 概要

Tech Shelfは、技術書籍の閲覧と配信に特化したWebプラットフォームです。ブログ機能と電子書籍機能を統合し、技術者向けの学習環境を提供します。

## 主な機能

- 電子書籍の閲覧（EPUB/PDF対応）
- 技術ブログ機能
- ブックマーク・ハイライト機能
- 読書進捗管理
- マルチアカウント対応（Google/GitHub認証）
- Stripe決済統合
- 高速検索（MeiliSearch）

## 技術スタック

- **フレームワーク**: SvelteKit v2 + Svelte 5
- **言語**: TypeScript 5.0+
- **スタイリング**: Tailwind CSS + DaisyUI
- **データベース**:
  - 開発: SQLite
  - 本番: Supabase (PostgreSQL)
- **ORM**: Prisma
- **認証**: Supabase Auth
- **電子書籍**: epub.js, PDF.js
- **検索**: MeiliSearch
- **決済**: Stripe

## 開発環境のセットアップ

### 前提条件

- Node.js 22以上
- npm または pnpm

詳細なセットアップ手順については [セットアップガイド](docs/setup-guide.md) を参照してください。

### クイックスタート

```bash
# 依存関係のインストール
npm install

# 環境変数のセットアップ
cp .env.example .env

# データベースの初期化
npx prisma migrate dev

# 開発サーバーの起動
npm run dev
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

開発環境ではモック認証システムを使用しています。詳細は [セットアップガイド](docs/setup-guide.md#認証システムの使い方) を参照してください。

## 開発コマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run check

# 型チェック（ウォッチモード）
npm run check:watch
```

## 記事資料

`docs/articles/` ディレクトリに、Rustプログラミング言語に関する電子書籍の構成案があります：

- 第1部: Rust基本編
- 第2部: Rust応用編
- 第3部: Rust実践編（DDD）

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容を議論してください。
