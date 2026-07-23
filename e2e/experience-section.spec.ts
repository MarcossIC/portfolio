import { test, expect, type Page } from '@playwright/test';

/** Wait for Angular to hydrate and the career section to appear */
async function waitForCareerSection(page: Page) {
  // Wait for Angular to hydrate the lazy-loaded home component
  const section = page.locator('#career');
  await expect(section).toBeAttached({ timeout: 15000 });
  return section;
}

/** Scroll to career and wait for first card to be visible */
async function scrollToCareerAndWait(page: Page) {
  const section = await waitForCareerSection(page);

  // Scroll the first timeline-element into center of viewport
  // to reliably trigger IntersectionObserver even on small viewports
  const firstCard = page.locator('timeline-element').first();
  await firstCard.scrollIntoViewIfNeeded();
  // Extra scroll to ensure the element is well within the viewport
  await page.evaluate(() => window.scrollBy(0, 150));
  await expect(firstCard).toHaveClass(/is-visible/, { timeout: 8000 });
  return { section, firstCard };
}

test.describe('Experience section — visibility and responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('experience cards become visible when scrolled into view', async ({
    page,
  }) => {
    const { firstCard } = await scrollToCareerAndWait(page);

    // The inner .timeline-card should be rendered and have non-zero size
    const card = firstCard.locator('.timeline-card').first();
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(50);
  });

  test('all experience cards appear after scrolling through the section', async ({
    page,
  }) => {
    await waitForCareerSection(page);

    const cards = page.locator('timeline-element');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
      await expect(cards.nth(i)).toHaveClass(/is-visible/, { timeout: 8000 });
    }
  });

  test('cards display title, company, and description', async ({ page }) => {
    const { firstCard } = await scrollToCareerAndWait(page);

    const title = firstCard.locator('.timeline-card__title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const company = firstCard.locator('.timeline-card__company-name');
    await expect(company).toBeVisible();
    await expect(company).not.toBeEmpty();

    const description = firstCard.locator('.timeline-card__description');
    await expect(description).toBeAttached();
  });

  test('card hover effect applies without affecting siblings', async ({
    page,
    isMobile,
  }) => {
    // Hover doesn't apply on mobile/touch devices
    test.skip(!!isMobile, 'Hover not applicable on mobile');

    await scrollToCareerAndWait(page);

    const cards = page.locator('timeline-element');
    const count = await cards.count();
    if (count < 2) {
      test.skip();
      return;
    }

    // Ensure second card is also visible
    await cards.nth(1).scrollIntoViewIfNeeded();
    await expect(cards.nth(1)).toHaveClass(/is-visible/, { timeout: 8000 });

    // Hover the first card
    const hoverTarget = cards.first().locator('.timeline-card');
    await hoverTarget.hover();

    // The hovered card should have .is-hovered
    await expect(hoverTarget).toHaveClass(/is-hovered/);

    // The sibling card should NOT have .is-hovered
    const siblingCard = cards.nth(1).locator('.timeline-card');
    await expect(siblingCard).not.toHaveClass(/is-hovered/);
    await expect(siblingCard).toBeVisible();
  });

  test('node circles are visible and properly sized', async ({ page }) => {
    const { firstCard } = await scrollToCareerAndWait(page);

    const circle = firstCard.locator('.timeline-node__circle');
    await expect(circle).toBeVisible();

    const box = await circle.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(5);
    expect(box!.width).toBeGreaterThan(15);
  });

  test('tech tags render when present', async ({ page }) => {
    await scrollToCareerAndWait(page);

    const cardsWithTags = page.locator(
      'timeline-element .timeline-card__technologies'
    );
    const tagGroupCount = await cardsWithTags.count();

    if (tagGroupCount > 0) {
      // Scroll to the card with tags
      const firstTagGroup = cardsWithTags.first();
      const hostElement = firstTagGroup.locator(
        'xpath=ancestor::timeline-element'
      );
      await hostElement.scrollIntoViewIfNeeded();
      await expect(hostElement).toHaveClass(/is-visible/, { timeout: 8000 });

      const tags = firstTagGroup.locator('.timeline-card__tech-tag');
      const numTags = await tags.count();
      expect(numTags).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(numTags, 3); i++) {
        await expect(tags.nth(i)).toBeVisible();
        await expect(tags.nth(i)).not.toBeEmpty();
      }
    }
  });
});

test.describe('Experience section — responsive layout', () => {
  test('desktop: cards alternate left and right', async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, 'Desktop layout test');

    await page.goto('/', { waitUntil: 'networkidle' });
    const { section } = await scrollToCareerAndWait(page);

    const items = section.locator('timeline-element .timeline-item');
    const count = await items.count();

    if (count >= 2) {
      const firstIsLeft = await items
        .first()
        .evaluate((el) => el.classList.contains('timeline-item--left'));
      const secondIsLeft = await items
        .nth(1)
        .evaluate((el) => el.classList.contains('timeline-item--left'));

      expect(firstIsLeft).not.toBe(secondIsLeft);
    }
  });

  test('mobile: cards are visible and properly sized', async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const { firstCard } = await scrollToCareerAndWait(page);

    const content = firstCard.locator('.timeline-content');
    await expect(content).toBeVisible();

    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(150);
  });

  test('tablet: cards are visible and properly laid out', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const { firstCard } = await scrollToCareerAndWait(page);

    const card = firstCard.locator('.timeline-card');
    await expect(card).toBeVisible();
  });
});
