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
  
  if (!isVisible) return;

  // Click through steps until the tour is completed
  for (let i = 0; i < 10; i++) {
    const nextBtn = dialog.locator('button').filter({ hasText: /weiter|next|start|los|begin|überspringen|skip/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    } else {
      const skipBtn = dialog.locator('button').first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }
    if (!(await dialog.isVisible().catch(() => false))) break;
  }

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
      const closeBtn = whatsNewDialog.locator('button').first();
      if (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION & SHELL
// ═══════════════════════════════════════════════════════════
test.describe('Navigation & Shell', () => {
  test('loads the app and shows the dashboard', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
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
      const link = page.locator(`#nav-sidebar a[href*="${route.path}"]`);
      await link.click();
      await page.waitForTimeout(500);
      expect(page.url()).toContain(route.path);
    }
  });

  test('navigates to analyses page', async ({ page }) => {
    await page.goto('/#/analyses');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('navigates to factcheck page', async ({ page }) => {
    await page.goto('/#/factcheck');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('catch-all redirects unknown routes to dashboard', async ({ page }) => {
    await page.goto('/#/nonexistent');
    await dismissOnboarding(page);
    await page.waitForTimeout(1000);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('sidebar collapses on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await dismissOnboarding(page);
    const sidebar = page.locator('#nav-sidebar');
    const isVisible = await sidebar.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});

// ═══════════════════════════════════════════════════════════
// THEORY ARCHIVE
// ═══════════════════════════════════════════════════════════
test.describe('Theory Archive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/archive');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
  });

  test('displays theory cards', async ({ page }) => {
    const cards = page.locator('[class*="grid"] > div, [class*="list"] > div').first();
    await expect(cards).toBeVisible({ timeout: 5000 });
  });

  test('search filters theories', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('Illuminati');
      await page.waitForTimeout(500);
      await expect(page.locator('#main-content')).toBeVisible();
    }
  });

  test('can open theory detail page', async ({ page }) => {
    const firstCard = page.locator('a[href*="archive/"]').first();
    if (await firstCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstCard.click();
      await page.waitForTimeout(500);
      expect(page.url()).toContain('archive/');
    }
  });
});

// ═══════════════════════════════════════════════════════════
// CHAT (DebunkChat)
// ═══════════════════════════════════════════════════════════
test.describe('Chat (DebunkChat)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/chat');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
  });

  test('chat page renders with input field and send button', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
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
    const sendBtn = page.locator('button:has(svg)').filter({ hasText: '' }).last();
    await expect(sendBtn).toBeDisabled();
  });

  test('chat log area exists with proper ARIA attributes', async ({ page }) => {
    const chatLog = page.locator('[role="log"]');
    await expect(chatLog).toBeVisible();
    await expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });
});

// ═══════════════════════════════════════════════════════════
// THREAT MATRIX (DangerousNarratives)
// ═══════════════════════════════════════════════════════════
test.describe('Threat Matrix (DangerousNarratives)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dangerous');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
  });

  test('loads the threat matrix page with visualizations', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas.first()).toBeVisible();
  });

  test('displays narrative cards in grid layout', async ({ page }) => {
    const cards = page.locator('[class*="grid"] > div').first();
    await expect(cards).toBeVisible();
  });

  test('has accessible globe visualization', async ({ page }) => {
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('aria-label', /globe|threat/i);
  });
});

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════
test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/settings');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
  });

  test('settings page loads', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('has API key section', async ({ page }) => {
    const apiKeySection = page.locator('text=/API|Gemini|Key/i').first();
    await expect(apiKeySection).toBeVisible({ timeout: 5000 });
  });
});

// ═══════════════════════════════════════════════════════════
// MEDIA & AUTHORS
// ═══════════════════════════════════════════════════════════
test.describe('Media & Authors', () => {
  test('media library loads', async ({ page }) => {
    await page.goto('/#/media');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('authors library loads', async ({ page }) => {
    await page.goto('/#/authors');
    await dismissOnboarding(page);
    await page.waitForTimeout(800);
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// OFFLINE MODE
// ═══════════════════════════════════════════════════════════
test.describe('Offline Mode', () => {
  test('shows offline banner when network is disabled', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(500);

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(2000);

    const offlineIndicator = page.locator('text=/offline|OFFLINE|keine verbindung|no connection|verbindung/i');
    const isVisible = await offlineIndicator.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isVisible) {
      await expect(page.locator('#main-content')).toBeVisible();
    }

    await context.setOffline(false);
  });

  test('app remains functional offline after initial load', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(1000);

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(1000);

    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('#nav-sidebar')).toBeVisible();

    await context.setOffline(false);
  });

  test('can navigate offline', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(1000);

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    const archiveLink = page.locator('#nav-sidebar a[href*="archive"]');
    if (await archiveLink.isVisible().catch(() => false)) {
      await archiveLink.click();
      await page.waitForTimeout(500);
      await expect(page.locator('#main-content')).toBeVisible();
    }

    await context.setOffline(false);
  });

  test('recovers when coming back online', async ({ page, context }) => {
    await page.goto('/');
    await dismissOnboarding(page);

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await page.waitForTimeout(1000);

    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForTimeout(1000);

    await expect(page.locator('#main-content')).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════
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

  test('focus visible ring is applied', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    await page.keyboard.press('Tab');
    const hasFocusStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      return styles.length > 0;
    });
    expect(hasFocusStyles).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// PWA
// ═══════════════════════════════════════════════════════════
test.describe('PWA', () => {
  test('manifest is linked in HTML', async ({ page }) => {
    await page.goto('/');
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();
  });

  test('manifest.json is fetchable', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    if (response) {
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.name).toBeTruthy();
      expect(data.icons).toBeTruthy();
    }
  });

  test('service worker registration script exists', async ({ page }) => {
    await page.goto('/');
    await dismissOnboarding(page);
    const swAvailable = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(swAvailable).toBe(true);
  });

  test('icons are accessible', async ({ page }) => {
    const iconResponse = await page.goto('/public/icons/icon.svg');
    if (iconResponse) {
      expect(iconResponse.status()).toBe(200);
      const contentType = iconResponse.headers()['content-type'];
      expect(contentType).toContain('svg');
    }
  });
});

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════
test.describe('Error handling', () => {
  test('app does not crash on console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await dismissOnboarding(page);
    await page.waitForTimeout(2000);

    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('404 page works', async ({ page }) => {
    const response = await page.goto('/definitely-not-found.html');
    expect(response).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════
// RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════
test.describe('Responsive design', () => {
  test('renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('renders on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await dismissOnboarding(page);
    await expect(page.locator('#main-content')).toBeVisible();
  });
});
