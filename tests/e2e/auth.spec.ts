import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete registration and login flow', async ({ page }) => {
    // 登録ページへ移動
    await page.goto('/register');

    // 登録フォームを埋める
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123');
    await page.fill('input[name="name"]', 'E2E Test User');

    // 登録ボタンをクリック
    await page.click('button[type="submit"]');

    // ホームページへリダイレクトされることを確認
    await expect(page).toHaveURL('/');

    // ナビゲーションにユーザー名が表示されることを確認
    await expect(page.locator('nav')).toContainText('E2E Test User');
  });

  test('should handle login with existing user', async ({ page }) => {
    // ログインページへ移動
    await page.goto('/login');

    // ログインフォームを埋める
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // ホームページへリダイレクトされることを確認
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // ログインページへ移動
    await page.goto('/login');

    // 無効な認証情報を入力
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('.alert-error')).toContainText(
      'メールアドレスまたはパスワードが正しくありません'
    );
  });

  test('should logout successfully', async ({ page }) => {
    // まずログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // プロフィールページへ移動
    await page.goto('/profile');

    // ログアウトボタンをクリック
    await page.click('a[href="/logout"]');

    // ホームページへリダイレクトされることを確認
    await expect(page).toHaveURL('/');

    // ログインリンクが表示されることを確認
    await expect(page.locator('nav')).toContainText('ログイン');
  });

  test('should protect authenticated routes', async ({ page }) => {
    // 未認証状態でプロフィールページへアクセス
    await page.goto('/profile');

    // ログインページへリダイレクトされることを確認
    await expect(page).toHaveURL('/login');
  });
});
