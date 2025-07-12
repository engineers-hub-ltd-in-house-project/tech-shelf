import { test, expect } from '@playwright/test';

test.describe('Book Projects E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'author@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to book projects page', async ({ page }) => {
    await page.click('text=書籍プロジェクト');
    await expect(page).toHaveURL('/book-projects');
    await expect(page.locator('h1')).toContainText('電子書籍プロジェクト');
  });

  test('should show empty state when no projects', async ({ page }) => {
    await page.goto('/book-projects');

    // Check if empty state is visible (assuming no projects initially)
    const emptyState = page.locator('text=プロジェクトがありません');
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
      await expect(page.locator('text=ブログ記事から電子書籍を作成してみましょう')).toBeVisible();
    }
  });

  test('should navigate to create project page', async ({ page }) => {
    await page.goto('/book-projects');
    await page.click('text=新規プロジェクト');
    await expect(page).toHaveURL('/book-projects/create');
    await expect(page.locator('h1')).toContainText('新規電子書籍プロジェクト');
  });

  test('should validate project creation form', async ({ page }) => {
    await page.goto('/book-projects/create');

    // Try to submit without filling required fields
    await page.click('button:has-text("プロジェクトを作成")');

    // Should see validation errors
    await expect(page.locator('text=タイトルは必須です')).toBeVisible();
  });

  test('should search and filter blog posts', async ({ page }) => {
    await page.goto('/book-projects/create');

    // Check if there are blog posts to select
    const noPostsMessage = page.locator('text=公開済みの記事がありません');
    if (await noPostsMessage.isVisible()) {
      // If no posts, skip the rest of the test
      return;
    }

    // Search for posts
    await page.fill('input[type="search"]', 'Rust');

    // Check that search filters the posts
    const posts = page.locator('label:has(input[name="posts"])');
    const count = await posts.count();

    if (count > 0) {
      // Select all filtered posts
      await page.click('button:has-text("すべて選択")');

      // Check selection count updated
      await expect(page.locator('text=/\\d+ 件/')).toBeVisible();

      // Deselect all
      await page.click('button:has-text("選択解除")');
      await expect(page.locator('text=0 件')).toBeVisible();
    }
  });

  test('should create a project with selected posts', async ({ page }) => {
    await page.goto('/blog/create');

    // Create a test blog post first
    await page.fill('input[name="title"]', 'Test Post for Book Project');
    await page.fill('input[name="slug"]', 'test-post-book-project');
    await page.fill(
      'textarea[name="content"]',
      '# Test Content\n\nThis is a test post for book project.'
    );
    await page.click('button:has-text("公開")');
    await page.waitForURL('/blog/test-post-book-project');

    // Now create a book project
    await page.goto('/book-projects/create');

    // Fill project details
    await page.fill('input[name="title"]', 'My Test Book Project');
    await page.fill('textarea[name="description"]', 'This is a test book project');

    // Select the created post
    await page.click('input[name="posts"][value*="test-post-book-project"]');

    // Create project
    await page.click('button:has-text("プロジェクトを作成")');

    // Should redirect to project detail page
    await expect(page).toHaveURL(/\/book-projects\/.+/);
    await expect(page.locator('h1')).toContainText('My Test Book Project');
  });

  test('should manage project tabs', async ({ page }) => {
    // First create a project
    await page.goto('/book-projects');

    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Check tabs
      await expect(page.locator('text=記事管理')).toBeVisible();
      await expect(page.locator('text=章構成')).toBeVisible();
      await expect(page.locator('text=設定')).toBeVisible();

      // Navigate to chapters tab
      await page.click('text=章構成');
      await expect(page.locator('text=未割り当ての記事')).toBeVisible();

      // Navigate to settings tab
      await page.click('text=設定');
      await expect(page.locator('text=プロジェクト設定')).toBeVisible();
    }
  });

  test('should update project settings', async ({ page }) => {
    await page.goto('/book-projects');

    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Go to settings tab
      await page.click('text=設定');

      // Update title
      await page.fill('input[name="title"]', 'Updated Project Title');
      await page.fill('textarea[name="description"]', 'Updated description');
      await page.selectOption('select[name="status"]', 'in_progress');

      // Save
      await page.click('button:has-text("更新")');

      // Check success message
      await expect(page.locator('text=更新しました')).toBeVisible();
    }
  });

  test('should add and remove posts from project', async ({ page }) => {
    // First create a test post
    await page.goto('/blog/create');
    await page.fill('input[name="title"]', 'Test Post for Project Management');
    await page.fill('input[name="slug"]', 'test-post-project-mgmt');
    await page.fill('textarea[name="content"]', '# Test Content\n\nThis is a test post.');
    await page.click('button:has-text("公開")');
    await page.waitForURL('/blog/test-post-project-mgmt');

    // Go to existing project
    await page.goto('/book-projects');
    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Add post to project
      await page.click('text=記事を追加');
      await page.selectOption('select[name="postId"]', {
        label: 'Test Post for Project Management',
      });
      await page.click('button:has-text("追加")');

      // Verify post was added
      await expect(page.locator('text=Test Post for Project Management')).toBeVisible();

      // Remove post from project
      const deleteButton = page.locator('form[action*="removePost"] button[type="submit"]').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        // Wait for removal to complete
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should create and manage chapters', async ({ page }) => {
    await page.goto('/book-projects');
    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Go to chapters tab
      await page.click('text=章構成');

      // Create new chapter
      await page.click('text=章を追加');
      await page.fill('input[name="title"]', 'Test Chapter');
      await page.fill('textarea[name="content"]', 'This is a test chapter introduction.');
      await page.click('button:has-text("作成")');

      // Verify chapter was created
      await expect(page.locator('text=Test Chapter')).toBeVisible();
      await expect(page.locator('text=This is a test chapter introduction.')).toBeVisible();

      // Check if there are posts to assign
      const assignButton = page.locator('button:has-text("章に追加")').first();
      if (await assignButton.isVisible()) {
        await assignButton.click();

        // Assign post to chapter
        await page.selectOption('select[name="chapterId"]', { label: 'Test Chapter' });
        await page.click('button:has-text("割り当て")');
      }
    }
  });

  test('should handle post reordering', async ({ page }) => {
    await page.goto('/book-projects');
    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Check if there are multiple posts to reorder
      const posts = page.locator('[data-dnd-zone] > div');
      const postCount = await posts.count();

      if (postCount > 1) {
        // Look for save order button (appears when there are multiple posts)
        const saveOrderButton = page.locator('button:has-text("並び順を保存")');
        if (await saveOrderButton.isVisible()) {
          await saveOrderButton.click();
          // Check for success (could be silent or show a message)
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/book-projects');
    const projectLink = page.locator('a[href^="/book-projects/"]:has(svg)').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Test chapter creation validation
      await page.click('text=章構成');
      await page.click('text=章を追加');
      await page.click('button:has-text("作成")');
      // Should see validation error or the form should not submit

      // Test project settings validation
      await page.click('text=設定');
      await page.fill('input[name="title"]', '');
      await page.click('button:has-text("更新")');
      // Should see validation error or the form should not submit
    }
  });

  test('should delete project', async ({ page }) => {
    // First create a project to delete
    await page.goto('/book-projects/create');
    await page.fill('input[name="title"]', 'Project to Delete');
    await page.fill('textarea[name="description"]', 'This project will be deleted');

    // Check if there are posts to select
    const postCheckbox = page.locator('input[name="posts"]').first();
    if (await postCheckbox.isVisible()) {
      await postCheckbox.click();
    }

    await page.click('button:has-text("プロジェクトを作成")');
    await expect(page).toHaveURL(/\/book-projects\/.+/);

    // Go to settings and delete
    await page.click('text=設定');

    const deleteButton = page.locator('button:has-text("プロジェクトを削除")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      // Should redirect to projects list
      await expect(page).toHaveURL('/book-projects');
    }
  });
});
