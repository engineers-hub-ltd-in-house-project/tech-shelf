# Tech Shelf 技術スタック変更履歴

## 概要

このドキュメントは Tech Shelf プロジェクトにおける技術スタックの変更履歴と、それに伴う問題・解決策を記録します。

## 2025年7月12日: TailwindCSS v4 + Skeleton UI 互換性問題

### 発生した問題

```
[plugin:@tailwindcss/vite:generate:serve] Cannot use `@variant` with unknown variant: md
/home/yusuke/engineers-hub.ltd/in-house-project/tech-shelf/node_modules/@skeletonlabs/skeleton/dist/index.css
```

### 問題の背景

1. **当初の技術選定**: AI との協議により TailwindCSS v4 + Skeleton UI の組み合わせを選択
2. **互換性問題の発覚**: Skeleton UI が TailwindCSS v4 の新しい `@variant` 構文に対応していない
3. **根本原因**: 技術選定時に長期的な互換性確認が不十分だった

### 技術的詳細

- **Skeleton UI v3.1.4** では `@variant` ディレクティブを63箇所で使用
- **TailwindCSS v4** では `@variant` 構文が変更され、未知のバリアント（`md` など）でエラーが発生
- **Skeleton UI の対応状況**: v4 対応は RFC 段階で、正式リリース未定

### 解決策の検討

#### 検討した選択肢

1. **TailwindCSS v3 へのダウングレード**
   - ✅ 短期的解決
   - ❌ 最新技術への対応遅れ

2. **Skeleton UI の代替ライブラリ検討**
   - **Flowbite Svelte**: ✅ TailwindCSS v4 完全対応済み
   - **shadcn-svelte**: ✅ 2025年に v4 対応版リリース済み
   - **Melt UI / Bits UI**: 🔄 ヘッドレスライブラリとして利用可能

3. **app.css からの Skeleton UI 除去**
   - ❌ 既存コンポーネントが大幅に破綻

### 採用した解決策

**Skeleton UI → Flowbite Svelte への移行**

#### 選定理由

- TailwindCSS v4 公式対応済み
- Skeleton UI と類似のコンポーネント体系
- 豊富なドキュメントとコミュニティサポート
- 58以上のUIコンポーネント提供

#### 移行計画

1. Flowbite Svelte のインストール
2. `app.css` の更新
3. 既存コンポーネントのクラス名変更
4. 各ページの順次更新
5. テスト実行と動作確認

### 学んだ教訓

1. **互換性の事前確認不足**: 最新技術の組み合わせ時は相互互換性を十分に調査すべき
2. **ロードマップの確認必要**: ライブラリの将来対応予定を事前に確認すべき
3. **段階的な技術導入**: 複数の新技術を同時導入する際はリスク評価が必要

### 今後の対応方針

1. **技術選定プロセスの標準化**: 実装指示書に互換性確認手順を明記
2. **定期的な依存関係チェック**: 四半期ごとの技術スタック見直し
3. **代替案の常備**: 主要ライブラリの代替候補を常に把握

---

## 過去の変更履歴

### 2025年7月11日: プロジェクト初期設定

- **Frontend**: SvelteKit v2 + TypeScript
- **Styling**: TailwindCSS v4 + Skeleton UI v3.1.4
- **Database**: SQLite + Prisma ORM
- **Testing**: Vitest + Playwright
- **Authentication**: Mock認証（開発用）

### 2025年7月12日: UI ライブラリ変更

- **変更前**: Skeleton UI v3.1.4
- **変更後**: Flowbite Svelte（TailwindCSS v4 対応版）
- **理由**: TailwindCSS v4 互換性問題の解決

---

## 技術スタック互換性マトリックス

| UI ライブラリ   | TailwindCSS v3 | TailwindCSS v4 | Svelte 5 | 状況         |
| --------------- | -------------- | -------------- | -------- | ------------ |
| Skeleton UI     | ✅             | ❌ (開発中)    | ✅       | 段階的移行中 |
| Flowbite Svelte | ✅             | ✅             | ✅       | **採用**     |
| shadcn-svelte   | ✅             | ✅             | ✅       | 代替候補     |
| Melt UI         | ✅             | ✅             | ✅       | ヘッドレス   |
| Bits UI         | ✅             | ✅             | ✅       | ヘッドレス   |
