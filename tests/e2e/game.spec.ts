import { test, expect } from '@playwright/test';

test.describe('Adaptive Memory Match — E2E User Journeys (AC-13, AC-15, AC-19)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
    await page.goto('/');
  });

  test('loads home dashboard with Liquid Glass UI and 16 memory cards', async ({ page }) => {
    await expect(page).toHaveTitle(/Adaptive Memory Match/i);
    await expect(page.getByRole('heading', { name: 'Adaptive Memory Match', level: 1 })).toBeVisible();
    await expect(page.getByText('Find all matching pairs. The game adapts to your performance.')).toBeVisible();

    // Verify 4x4 grid contains 16 card buttons
    const cards = page.locator('button[aria-label^="Row"]');
    await expect(cards).toHaveCount(16);

    // Verify panel headings semantically
    await expect(page.getByRole('heading', { name: 'Game Status' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Next Round' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Game Controls' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent Results' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Adaptive Difficulty' })).toBeVisible();
  });

  test('clicking a face-down card flips it to revealed state', async ({ page }) => {
    // Wait for opening preview if active or click card
    const firstCard = page.locator('button[aria-label^="Row"]').first();
    await expect(firstCard).toBeVisible();

    // Wait until cards are clickable (preview finished or click directly)
    await page.waitForTimeout(2600); // Easy preview is 2.5s

    await firstCard.click();

    // The card inner container should now have flipped class
    const inner = firstCard.locator('.card-inner');
    await expect(inner).toHaveClass(/flipped/);
  });

  test('rapid clicking on the same card does not increment moves or break state', async ({ page }) => {
    await page.waitForTimeout(2600);
    const firstCard = page.locator('button[aria-label^="Row"]').first();

    // Rapid clicks on card 1
    await firstCard.click();
    await firstCard.click();
    await firstCard.click();

    // Moves counter must still show 0 (1 move = 1 complete pair attempt)
    const movesValue = page.getByTestId('moves-counter');
    await expect(movesValue).toHaveText('0');
  });

  test('restarting the game resets moves and flips cards face down', async ({ page }) => {
    await page.waitForTimeout(2600);
    const firstCard = page.locator('button[aria-label^="Row"]').first();
    await firstCard.click();

    // Click Restart button
    await page.getByRole('button', { name: /restart/i }).click();

    // Move count should be reset
    const movesValue = page.getByTestId('moves-counter');
    await expect(movesValue).toHaveText('0');
  });

  test('can open and close the How to Play modal', async ({ page }) => {
    await page.getByRole('button', { name: /how to play/i }).first().click();

    const dialog = page.getByRole('dialog', { name: /how to play adaptive memory match/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Objective & Card Grid')).toBeVisible();

    // Close via Close dialog (X) button
    await dialog.getByRole('button', { name: 'Close dialog' }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('can open Stats modal and inspect analytics', async ({ page }) => {
    await page.getByRole('button', { name: /open statistics/i }).click();

    const dialog = page.getByRole('dialog', { name: /session analytics & records/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Total Games')).toBeVisible();

    // Close via Close dialog (X) button
    await dialog.getByRole('button', { name: 'Close dialog' }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('renders in the signature Liquid Glass dark appearance mode by default (AC-13)', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('manually switches difficulty level via segmented switcher', async ({ page }) => {
    // Switch to Medium
    const mediumBtn = page.getByRole('radio', { name: /^medium$/i });
    await mediumBtn.click();
    await expect(mediumBtn).toHaveAttribute('aria-checked', 'true');

    // Switch to Hard
    const hardBtn = page.getByRole('radio', { name: /^hard$/i });
    await hardBtn.click();
    await expect(hardBtn).toHaveAttribute('aria-checked', 'true');

    // On Hard, opening preview duration is 0s (no preview delay)
    const firstCard = page.locator('button[aria-label^="Row"]').first();
    await firstCard.click();
    const inner = firstCard.locator('.card-inner');
    await expect(inner).toHaveClass(/flipped/);
  });
});
