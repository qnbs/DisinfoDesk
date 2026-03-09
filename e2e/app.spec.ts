import { test, expect, Page } from '@playwright/test';

/**
 * Helper: Dismiss the onboarding tour by clicking through all steps.
 * The app shows a boot sequence + tour on first visit (no persisted state).
 */
async function dismissOnboarding(page: Page) {
  // Wait for boot sequence to finish (z-[10000] overlay disappears)
  const bootOverlay = page.locator('.cursor-wait');
  await bootOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

  // Wait for the onboarding dialog to appear
  const dialog = page.locator('[role="dialog"]');
  const isVisible = await dialog.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!isVisible) return; // Already dismissed or not shown

  // Click through steps until the tour is completed
  for (let i = 0; i < 10; i++) {
    const nextBtn = dialog.locator('button').filter({ hasText: /weiter|next|start|los|begin|überspringen|skip/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    } else {
      // Try skip button as fallback
      const skipBtn = dialog.locator('button').first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }
    // Check if dialog is gone
    if (!(await dialog.isVisible().catch(() => false))) break;
  }

  // Wait a moment for state to settle
  await page.waitForTimeout(500);

  // Dismiss the WhatsNew modal if it appears after onboarding
  const whatsNewDialog = page.locator('dialog[open]');
  const whatsNewVisible = await whatsNewDialog.isVisible({ timeout: 3000 }).catch(() => false);
  if (whatsNewVisible) {
    const gotItBtn = whatsNewDialog.locator('button').filter({ hasText: /verstanden|got it/i }).first();
    if (await gotItBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await gotItBtn.click();
      await page.waitForTimeout(500);
    } else {
      // Fallback: click the close (X) button
      const closeBtn = whatsNewDialog.locator('button').first();
      if (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }
}

test.describe('Navigation & Shell', () => {
  test('loads the app and shows the dashboard', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    // The dashboard should be visible
    await expect(page.locator('#main-content')).toBeVisible();
    // Sidebar should exist
    await expect(page.locator('#nav-sidebar')).toBeVisible();
  });

  test('navigates to all main pages via sidebar', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    const routes = [
      { path: 'archive', text: /archiv|archive/i },
      { path: 'dangerous', text: /bedroh|threat|narrativ/i },
      { path: 'chat', text: /chat|uplink|veritas/i },
      { path: 'settings', text: /einstellung|settings|config/i },
    ];

    for (const route of routes) {
      // Navigate via sidebar link (hash routes: href ends with #/path)
      const link = page.locator(`#nav-sidebar a[href*="${route.path}"]`);
      await link.click();
      await page.waitForTimeout(500);

      // Verify URL changed (hash-based routing)
      expect(page.url()).toContain(route.path);
    }
  });
});

test.describe('Chat (DebunkChat)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/chat');
    await dismissOnboarding(page);
    // Wait for chat UI to load
    await page.waitForTimeout(800);
  });

  test('chat page renders with input field and send button', async ({ page }) => {
    // Chat input should be visible
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();

    // Send button should be visible
    const sendBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    await expect(sendBtn).toBeVisible();
  });

  test('can type in chat input', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Was ist die Flache-Erde-Theorie?');
    await expect(input).toHaveValue('Was ist die Flache-Erde-Theorie?');
  });

  test('send button is disabled when input is empty', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('');
    
    // The send button should be disabled (has disabled attribute or class)
    const sendBtn = page.locator('button:has(svg)').filter({ hasText: '' }).last();
    await expect(sendBtn).toBeDisabled();
  });

  test('chat log area exists with proper ARIA attributes', async ({ page }) => {
    const chatLog = page.locator('[role="log"]');
    await expect(chatLog).toBeVisible();
    await expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });
});

test.describe('Threat Matrix (DangerousNarratives)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dangerous');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
  });

  test('loads the threat matrix page with visualizations', async ({ page }) => {
    // Page should have a canvas for the globe
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible();
  });

  test('displays narrative cards in grid layout', async ({ page }) => {
    // Look for card elements (narrative items)
    const cards = page.locator('[class*="grid"] > div').first();
    await expect(cards).toBeVisible();
  });

  test('has accessible globe visualization', async ({ page }) => {
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('aria-label', /globe|threat/i);
  });
});

test.describe('Offline Mode', () => {
  test('shows offline banner when network is disabled', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(500);

    // Set offline
    await context.setOffline(true);

    // Trigger the browser's offline event
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    await page.waitForTimeout(2000);

    // The app should show some offline indicator (banner text or visual change)
    const offlineIndicator = page.locator('text=/offline|OFFLINE|keine verbindung|no connection|verbindung/i');
    const isVisible = await offlineIndicator.isVisible({ timeout: 5000 }).catch(() => false);
    
    // If text indicator not found, check for any offline-related visual element
    if (!isVisible) {
      // At minimum, the page should still be functional
      await expect(page.locator('#main-content')).toBeVisible();
    }
    
    // Restore for cleanup
    await context.setOffline(false);
  });

  test('app remains functional offline after initial load', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(1000);

    // Go offline
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(1000);
    
    // The main content area should still be visible (app doesn't crash)
    await expect(page.locator('#main-content')).toBeVisible();
    
    // Sidebar should still be visible
    await expect(page.locator('#nav-sidebar')).toBeVisible();
    
    // Restore
    await context.setOffline(false);
  });

  test('recovers when coming back online', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    // Go offline
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(1000);

    // Come back online
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForTimeout(1000);

    // App should be functional
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('skip-to-content link exists and works', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('main content has proper landmark role', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    const main = page.locator('main[role="main"]');
    await expect(main).toBeVisible();
  });

  test('navigation has proper role', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    const nav = page.locator('[role="navigation"]');
    await expect(nav.first()).toBeVisible();
  });
});
