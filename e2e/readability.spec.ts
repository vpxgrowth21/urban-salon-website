import { test, expect } from '@playwright/test';
const routes = [
  '/',
  '/services',
  '/services/hair-spa',
  '/bridal',
  '/gallery',
  '/offers',
  '/about',
  '/contact',
  '/book?service=signature-haircut',
  '/booking/sample-1001-demo-only',
  '/privacy',
  '/demo/admin',
];
for (const width of [320, 360, 375, 390, 412, 430, 768, 1024, 1440, 1920]) {
  test(`readability and reflow at ${width}px`, async ({ page }) => {
    for (const route of routes) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        route,
      ).toBe(false);
    }
  });
}
test('service names, prices, descriptions and booking labels meet the new scale', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/services');
  const values = await page.evaluate(() => {
    const metrics = (selector: string) => {
      const style = getComputedStyle(document.querySelector(selector)!);
      return {
        size: parseFloat(style.fontSize),
        weight: Number(style.fontWeight),
        family: style.fontFamily,
      };
    };
    return {
      title: metrics('.service-row h3'),
      price: metrics('.service-price strong'),
      duration: metrics('.service-info .caption'),
      button: metrics('.service-price .button'),
    };
  });
  expect(values.title.size).toBeGreaterThanOrEqual(18);
  expect(values.title.weight).toBeGreaterThanOrEqual(600);
  expect(values.price.size).toBeGreaterThanOrEqual(20);
  expect(values.price.weight).toBe(700);
  expect(values.duration.size).toBeGreaterThanOrEqual(14);
  expect(values.button.size).toBeGreaterThanOrEqual(16);
  await page.goto('/book?service=signature-haircut');
  await page.getByRole('button', { name: 'Choose date & time', exact: true }).click();
  await page.locator('.dates .date-chip:not(:disabled)').nth(2).click();
  await page.locator('.slot:not(:disabled)').first().click();
  await page.getByRole('button', { name: 'Your details', exact: true }).click();
  expect(
    await page.getByLabel('Full name').evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});
test('200% text scaling and zoom-equivalent reflow preserve content', async ({ page }) => {
  for (const width of [320, 640, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.locator('h1').waitFor();
      await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      expect(overflow, `${route} at ${width}px / 200% text`).toBe(false);
      const clips = await page
        .locator('h1,h2,h3,.button,.service-price strong,.notice,.field')
        .evaluateAll((elements) =>
          elements
            .filter((el) => {
              const style = getComputedStyle(el);
              return (
                el.getClientRects().length &&
                ['hidden', 'clip'].includes(style.overflowY) &&
                el.scrollHeight > el.clientHeight + 2
              );
            })
            .map((el) => el.textContent?.trim().slice(0, 80)),
        );
      expect(clips, `${route}: clipped essential text`).toEqual([]);
    }
  }
});
