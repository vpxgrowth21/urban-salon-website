import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('core pages have no automated WCAG A/AA violations', async ({ page }) => {
  const violations = [];
  await page.clock.setFixedTime(new Date('2026-11-08T03:30:00Z'));
  for (const route of [
    '/',
    '/services',
    '/services/hair-spa',
    '/about',
    '/offers',
    '/contact',
    '/privacy',
    '/terms',
    '/booking-policy',
    '/booking/sample-1001-demo-only',
    '/book?service=signature-haircut',
    '/bridal',
    '/gallery',
    '/demo/admin',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    violations.push(
      ...results.violations.map((v) => ({
        route,
        id: v.id,
        impact: v.impact,
        targets: v.nodes.map((n) => n.target),
      })),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/book?service=signature-haircut');
  await page.getByRole('button', { name: 'Choose date & time', exact: true }).click();
  await page.getByLabel('Or choose another date').fill('2026-11-11');
  for (const step of [2, 3]) {
    if (step === 3) {
      await page.getByRole('button', { name: '4:00 PM — requestable', exact: true }).click();
      await page.getByRole('button', { name: 'Your details', exact: true }).click();
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    violations.push(
      ...results.violations.map((v) => ({
        route: `/book step ${step} mobile`,
        id: v.id,
        impact: v.impact,
        targets: v.nodes.map((n) => n.target),
      })),
    );
  }
  expect(violations).toEqual([]);
});
