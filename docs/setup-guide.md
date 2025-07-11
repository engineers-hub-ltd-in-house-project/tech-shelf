# Tech Shelf セットアップガイド

このガイドでは、Tech Shelfプロジェクトの開発環境を構築する手順を詳しく説明します。

## 目次

1. [前提条件](#前提条件)
2. [プロジェクトのクローン](#プロジェクトのクローン)
3. [環境変数の設定](#環境変数の設定)
4. [依存関係のインストール](#依存関係のインストール)
5. [データベースのセットアップ](#データベースのセットアップ)
6. [開発サーバーの起動](#開発サーバーの起動)
7. [認証システムの使い方](#認証システムの使い方)
8. [トラブルシューティング](#トラブルシューティング)

## 前提条件

開発を始める前に、以下のソフトウェアがインストールされていることを確認してください：

- **Node.js**: バージョン22以上（推奨: 22.x LTS）

  ```bash
  # バージョン確認
  node --version
  ```

- **npm**: バージョン10以上（Node.jsに同梱）

  ```bash
  # バージョン確認
  npm --version
  ```

- **Git**: バージョン管理用
  ```bash
  # バージョン確認
  git --version
  ```

## プロジェクトのクローン

```bash
# HTTPSを使用する場合
git clone https://github.com/your-org/tech-shelf.git

# SSHを使用する場合（推奨）
git clone git@github.com:your-org/tech-shelf.git

# プロジェクトディレクトリに移動
cd tech-shelf
```

## 環境変数の設定

### 1. 環境変数ファイルの作成

```bash
# .env.exampleファイルをコピーして.envファイルを作成
cp .env.example .env
```

### 2. 環境変数の編集

`.env`ファイルを開き、以下の環境変数を設定します：

```env
# データベース設定（開発環境）
DATABASE_URL="file:./dev.db"

# Supabase設定（本番環境用、開発環境では任意）
PUBLIC_SUPABASE_URL="your-supabase-url"
PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# 認証設定
AUTH_SECRET="your-auth-secret-key"

# Stripe設定（決済機能を使用する場合）
STRIPE_SECRET_KEY="your-stripe-secret-key"
PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# MeiliSearch設定（検索機能を使用する場合）
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your-meilisearch-key"
```

### 3. 開発環境用の設定

開発環境では、以下の最小限の設定で動作します：

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="development-secret-key-change-in-production"
```

## 依存関係のインストール

```bash
# npmを使用する場合
npm install

# pnpmを使用する場合（高速）
pnpm install

# yarnを使用する場合
yarn install
```

### 依存関係のインストールで問題が発生した場合

```bash
# キャッシュをクリアして再インストール
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## データベースのセットアップ

### 1. Prismaクライアントの生成

```bash
npx prisma generate
```

### 2. データベースのマイグレーション

```bash
# 開発環境用のマイグレーション実行
npx prisma migrate dev

# マイグレーション名を聞かれたら、適切な名前を入力
# 例: init, add_user_table など
```

### 3. 初期データの投入（シード）

```bash
# シードスクリプトの実行
npx prisma db seed
```

### 4. データベースの確認

Prisma Studioを使用してデータベースの内容を確認できます：

```bash
npx prisma studio
```

ブラウザで `http://localhost:5555` が自動的に開き、データベースの内容を確認できます。

## 開発サーバーの起動

### 基本的な起動方法

```bash
# 開発サーバーを起動
npm run dev

# または、ブラウザを自動的に開く
npm run dev -- --open
```

### ポートを指定して起動

デフォルトでは5173番ポートで起動しますが、変更することも可能です：

```bash
# 3000番ポートで起動
npm run dev -- --port 3000
```

### 起動の確認

サーバーが正常に起動すると、以下のようなメッセージが表示されます：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 認証システムの使い方

開発環境では、モック認証システムを使用しています。

### 新規ユーザー登録

1. ブラウザで `http://localhost:5173/register` にアクセス
2. 以下の情報を入力：
   - メールアドレス（例: user@example.com）
   - パスワード（8文字以上）
   - 表示名（任意）
3. 「登録」ボタンをクリック

### ログイン

1. ブラウザで `http://localhost:5173/login` にアクセス
2. 登録したメールアドレスとパスワードを入力
3. 「ログイン」ボタンをクリック

### ログアウト

ヘッダーの右上にあるユーザーメニューから「ログアウト」を選択

### プロフィール確認

`http://localhost:5173/profile` でログイン中のユーザー情報を確認できます

## トラブルシューティング

### よくある問題と解決方法

#### 1. npm installでエラーが発生する

```bash
# node_modulesとpackage-lock.jsonを削除してから再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. データベース接続エラー

```bash
# データベースファイルを削除して再作成
rm prisma/dev.db
npx prisma migrate dev
```

#### 3. ポートが既に使用されている

```bash
# 別のポートで起動
npm run dev -- --port 3001
```

#### 4. Prisma関連のエラー

```bash
# Prismaクライアントを再生成
npx prisma generate
```

#### 5. 環境変数が読み込まれない

- `.env`ファイルが正しい場所にあるか確認
- ファイル名が正確に`.env`であることを確認（`.env.local`などではない）
- サーバーを再起動

### デバッグモード

詳細なログを表示するには：

```bash
# デバッグモードで起動
DEBUG=* npm run dev
```

## 次のステップ

セットアップが完了したら、以下のドキュメントも参照してください：

- [開発指示書](./development-specification.md) - 開発ガイドライン
- [要求定義書](./requirements-definition.md) - システム要件
- [README](../README.md) - プロジェクト概要

## サポート

問題が解決しない場合は、以下の方法でサポートを受けられます：

1. GitHubのIssuesで問題を報告
2. プロジェクトのSlackチャンネルで質問
3. ドキュメントのFAQセクションを確認
