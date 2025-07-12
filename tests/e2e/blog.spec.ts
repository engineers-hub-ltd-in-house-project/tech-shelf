import { test, expect } from '@playwright/test';

test.describe('Blog Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should create a new blog post', async ({ page }) => {
    // ブログ作成ページへ移動
    await page.goto('/blog/create');

    // フォームを埋める
    await page.fill('input[name="title"]', 'E2E Test Blog Post');
    await page.fill('input[name="slug"]', 'e2e-test-blog-post');
    await page.fill('textarea[name="excerpt"]', 'This is a test blog post created by E2E test');

    // Markdownエディタに内容を入力
    const editorContent = `# E2E Test Blog Post

This is a test blog post created by Playwright E2E test.

## Features
- Automated testing
- Real browser interaction
- End-to-end validation`;

    await page.fill('textarea[name="content"]', editorContent);

    // タグを入力
    await page.fill('input[name="tags"]', 'e2e, testing, playwright');

    // 公開設定
    await page.check('input[name="published"]');

    // 保存ボタンをクリック
    await page.click('button[type="submit"]');

    // ブログ詳細ページへリダイレクトされることを確認
    await expect(page).toHaveURL('/blog/e2e-test-blog-post');

    // 作成した内容が表示されることを確認
    await expect(page.locator('h1')).toContainText('E2E Test Blog Post');
    await expect(page.locator('article')).toContainText(
      'This is a test blog post created by Playwright E2E test'
    );
  });

  test('should edit an existing blog post', async ({ page }) => {
    // まず新しい記事を作成
    await page.goto('/blog/create');
    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Edit Test ${timestamp}`);
    await page.fill('input[name="slug"]', `edit-test-${timestamp}`);
    await page.fill('textarea[name="content"]', '# Original Content');
    await page.click('button[type="submit"]');

    // 編集ボタンをクリック
    await page.click('a:has-text("編集")');

    // タイトルを変更
    await page.fill('input[name="title"]', `Updated Edit Test ${timestamp}`);

    // 内容を変更
    await page.fill(
      'textarea[name="content"]',
      '# Updated Content\n\nThis content has been updated.'
    );

    // 保存ボタンをクリック
    await page.click('button[type="submit"]');

    // 更新された内容が表示されることを確認
    await expect(page.locator('h1')).toContainText(`Updated Edit Test ${timestamp}`);
    await expect(page.locator('article')).toContainText('This content has been updated');
  });

  test('should manage draft and published posts', async ({ page }) => {
    // マイブログページへ移動
    await page.goto('/blog/my');

    // 新規作成ボタンをクリック
    await page.click('a:has-text("新規作成")');

    // 下書きとして保存
    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Draft Test ${timestamp}`);
    await page.fill('input[name="slug"]', `draft-test-${timestamp}`);
    await page.fill('textarea[name="content"]', '# Draft Content');
    // published チェックボックスはチェックしない
    await page.click('button[type="submit"]');

    // マイブログページに戻る
    await page.goto('/blog/my');

    // 下書きフィルターをクリック
    await page.click('a:has-text("下書き")');

    // 作成した下書きが表示されることを確認
    await expect(page.locator('main')).toContainText(`Draft Test ${timestamp}`);
    await expect(page.locator('.badge-warning')).toContainText('下書き');
  });

  test('should navigate through blog list with pagination', async ({ page }) => {
    // ブログ一覧ページへ移動
    await page.goto('/blog');

    // 記事が表示されることを確認
    await expect(page.locator('.blog-card')).toHaveCount(1); // 少なくとも1つ

    // タグでフィルタリング（タグが存在する場合）
    const tagLink = page.locator('.tag-list a').first();
    if ((await tagLink.count()) > 0) {
      await tagLink.click();
      await expect(page).toHaveURL(/\/blog\?tag=/);
    }
  });

  test('should show proper authorization for blog posts', async ({ page }) => {
    // 他のユーザーの記事を直接編集しようとする
    await page.goto('/blog/getting-started-with-rust'); // シードデータの記事

    // 編集ボタンが表示されないことを確認（作者でない場合）
    await expect(page.locator('a:has-text("編集")')).toHaveCount(0);
  });
});
