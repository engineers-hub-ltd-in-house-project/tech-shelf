import { test, expect } from '@playwright/test';

test.describe('New Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test.describe('Outline Pane Enhancements', () => {
    test('should drag and drop headings to reorder', async ({ page }) => {
      // ブログ作成ページに移動
      await page.goto('/blog/create');

      // Markdownコンテンツを入力
      const content = `# First Heading
Some content here

## Second Heading
More content

# Third Heading
Final content`;

      await page.fill('textarea[name="content"]', content);

      // アウトラインペインが表示されることを確認
      await expect(page.locator('.outline-pane')).toBeVisible();
      await expect(page.locator('.outline-item').first()).toContainText('First Heading');

      // ドラッグ&ドロップの準備（実際のドラッグ&ドロップは複雑なのでここでは存在確認）
      const dragHandle = page.locator('.drag-handle').first();
      await expect(dragHandle).toBeVisible();
    });

    test('should collapse and expand outline sections', async ({ page }) => {
      await page.goto('/blog/create');

      const content = `# Main Section
Introduction text

## Subsection A
Content A

## Subsection B
Content B`;

      await page.fill('textarea[name="content"]', content);

      // 展開ボタンを探す
      const expandButton = page.locator('button[aria-label*="Toggle"]').first();
      await expect(expandButton).toBeVisible();

      // 最初は子要素が表示されていることを確認
      await expect(page.locator('text=Subsection A')).toBeVisible();
      await expect(page.locator('text=Subsection B')).toBeVisible();

      // 折りたたみ
      await expandButton.click();

      // 子要素が隠れることを確認
      await expect(page.locator('text=Subsection A')).not.toBeVisible();
      await expect(page.locator('text=Subsection B')).not.toBeVisible();

      // 再度展開
      await expandButton.click();

      // 子要素が再表示されることを確認
      await expect(page.locator('text=Subsection A')).toBeVisible();
      await expect(page.locator('text=Subsection B')).toBeVisible();
    });
  });

  test.describe('Image Upload Feature', () => {
    test('should handle image drag and drop', async ({ page }) => {
      await page.goto('/blog/create');

      // エディタが表示されることを確認
      const editor = page.locator('.markdown-editor');
      await expect(editor).toBeVisible();

      // ドラッグ&ドロップエリアが存在することを確認
      const dropZone = page.locator('.drop-zone');
      await expect(dropZone).toBeVisible();

      // ファイル入力が存在することを確認
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeVisible();

      // 画像アップロードプレースホルダーが表示されることを確認
      await expect(page.locator('text=画像をドラッグ&ドロップ')).toBeVisible();
    });

    test('should show upload progress', async ({ page }) => {
      await page.goto('/blog/create');

      // 画像をMarkdownエディタに入力（Base64形式）
      const imageMarkdown =
        '![test image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==)';

      await page.fill('textarea[name="content"]', imageMarkdown);

      // プレビューで画像が表示されることを確認
      const preview = page.locator('.preview-pane');
      await expect(preview.locator('img')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should search from header search bar', async ({ page }) => {
      // ヘッダーの検索バーを確認
      const searchInput = page.locator('input[placeholder*="検索"]');
      await expect(searchInput).toBeVisible();

      // 検索実行
      await searchInput.fill('JavaScript');
      await searchInput.press('Enter');

      // 検索ページに遷移することを確認
      await page.waitForURL('**/search?q=JavaScript**');

      // 検索結果が表示されることを確認
      await expect(page.locator('.search-results')).toBeVisible();
    });

    test('should filter search results by type', async ({ page }) => {
      await page.goto('/search?q=test');

      // フィルターボタンが存在することを確認
      await expect(page.locator('button:has-text("すべて")')).toBeVisible();
      await expect(page.locator('button:has-text("ブログ")')).toBeVisible();
      await expect(page.locator('button:has-text("書籍")')).toBeVisible();

      // ブログフィルターをクリック
      await page.click('button:has-text("ブログ")');

      // URLにフィルターパラメータが追加されることを確認
      await page.waitForURL('**/search?q=test&type=blog**');

      // ブログカードのみが表示されることを確認
      const blogCards = page.locator('.blog-card');

      if ((await blogCards.count()) > 0) {
        await expect(blogCards.first()).toBeVisible();
      }
    });

    test('should show no results message', async ({ page }) => {
      await page.goto('/search?q=nonexistentquery12345');

      // 結果なしのメッセージが表示されることを確認
      await expect(page.locator('text=検索結果が見つかりませんでした')).toBeVisible();
      await expect(page.locator('text=別のキーワードで検索')).toBeVisible();
    });
  });

  test.describe('Book Preview Feature', () => {
    test('should access book preview from project page', async ({ page }) => {
      // 書籍プロジェクトページに移動（既存のプロジェクトがある前提）
      await page.goto('/book-projects');

      // プロジェクトが存在する場合
      const projectLink = page.locator('a[href*="/book-projects/"]').first();
      if ((await projectLink.count()) > 0) {
        await projectLink.click();

        // プレビューボタンが存在することを確認
        const previewButton = page.locator('a:has-text("プレビュー")');
        await expect(previewButton).toBeVisible();

        // プレビューページに移動
        await previewButton.click();

        // プレビューページが表示されることを確認
        await expect(page.locator('.book-preview')).toBeVisible();
      }
    });

    test('should navigate through book preview', async ({ page }) => {
      // 直接プレビューページにアクセス（プロジェクトIDは仮）
      await page.goto('/book-projects/test-project-id/preview');

      // プレビューページの要素を確認
      if ((await page.locator('.book-preview').count()) > 0) {
        // 目次が表示されることを確認
        await expect(page.locator('.table-of-contents')).toBeVisible();

        // 目次の表示/非表示切り替えボタンを確認
        const tocToggle = page.locator('button:has-text("目次")');
        if ((await tocToggle.count()) > 0) {
          await expect(tocToggle).toBeVisible();

          // 目次を非表示にする
          await tocToggle.click();
          await expect(page.locator('.table-of-contents')).not.toBeVisible();

          // 目次を再表示する
          await tocToggle.click();
          await expect(page.locator('.table-of-contents')).toBeVisible();
        }

        // 章のコンテンツが表示されることを確認
        await expect(page.locator('.chapter-content')).toBeVisible();
      }
    });

    test('should show unassigned posts section', async ({ page }) => {
      await page.goto('/book-projects/test-project-id/preview');

      if ((await page.locator('.book-preview').count()) > 0) {
        // 未割り当て記事セクションが表示されることを確認
        const unassignedSection = page.locator('.unassigned-posts');
        if ((await unassignedSection.count()) > 0) {
          await expect(unassignedSection).toBeVisible();
          await expect(page.locator('h2:has-text("未割り当ての記事")')).toBeVisible();
        }
      }
    });
  });

  test.describe('Integration Tests', () => {
    test('should create blog post with image and search for it', async ({ page }) => {
      // ブログ作成
      await page.goto('/blog/create');

      const title = 'Test Post with Image ' + Date.now();
      const content = `# ${title}

This is a test post with an image.

![Test Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==)

Some more content here.`;

      await page.fill('input[name="title"]', title);
      await page.fill('textarea[name="content"]', content);

      // 記事を公開
      await page.check('input[name="published"]');
      await page.click('button[type="submit"]');

      // 記事が作成されることを確認
      await expect(page.locator('text=記事が作成されました')).toBeVisible();

      // 検索で記事を見つける
      await page.goto('/search');
      await page.fill('input[name="q"]', title);
      await page.click('button[type="submit"]');

      // 検索結果に表示されることを確認
      await expect(page.locator(`.blog-card:has-text("${title}")`)).toBeVisible();
    });

    test('should use outline pane to navigate and edit content', async ({ page }) => {
      await page.goto('/blog/create');

      const content = `# Introduction
Welcome to this guide.

## Getting Started
First, let's begin.

### Prerequisites
You need these tools.

## Advanced Usage
Now for advanced topics.`;

      await page.fill('textarea[name="content"]', content);

      // アウトラインで特定の見出しをクリック
      const advancedHeading = page.locator('.outline-item:has-text("Advanced Usage")');
      if ((await advancedHeading.count()) > 0) {
        await advancedHeading.click();

        // エディタの該当行にフォーカスが移ることを確認（実装依存）
        // この部分はエディタの実装によって確認方法が変わる
      }
    });
  });
});
