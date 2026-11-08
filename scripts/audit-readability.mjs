import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const phase = process.argv[2] || 'before';
const output = `artifacts/readability/${phase}`;
const origin = process.env.BASE_URL || 'http://localhost:3007';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  const page = await browser.newPage();
  for (const [name, route, width, height] of [
    ['home-desktop', '/', 1440, 1020],
    ['home-mobile', '/', 390, 844],
    ['services-desktop', '/services', 1440, 1020],
    ['services-mobile', '/services', 390, 844],
    ['booking-mobile', '/book?service=signature-haircut', 390, 844],
    ['owner-desktop', '/demo/admin', 1440, 1020],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(origin + route);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (name === 'booking-mobile') {
      await page
        .getByRole('button', { name: /^(Choose date & time|Continue to date & time)$/i })
        .click();
      await page.locator('.dates .date-chip:not(:disabled)').nth(2).click();
      await page.locator('.slot:not(:disabled)').first().click();
      await page
        .getByRole('button', { name: /^(Your details|Continue to your details)$/i })
        .click();
    }
    if (name === 'owner-desktop')
      await page.getByRole('button', { name: /Sample Guest A/ }).waitFor();
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo(0, 0);
    });
    if (name.startsWith('home')) {
      await page.locator('.home-gallery').scrollIntoViewIfNeeded();
      await page
        .locator('.home-gallery img')
        .evaluateAll((images) => Promise.all(images.map((img) => img.decode().catch(() => {}))));
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => window.scrollY === 0);
    await page.screenshot({ path: `${output}/${name}.png` });
    if (name.startsWith('home') || name === 'booking-mobile')
      await page.screenshot({ path: `${output}/${name}-full.png`, fullPage: true });
    const metrics = await page.evaluate(() => {
      const luminance = (rgb) =>
        rgb
          .slice(0, 3)
          .map((c) => c / 255)
          .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
          .reduce((n, c, i) => n + c * [0.2126, 0.7152, 0.0722][i], 0);
      const parse = (color) => color.match(/[\d.]+/g)?.map(Number) || [255, 255, 255];
      return [
        '.desktop-nav a',
        '.hero h1',
        '.hero-copy > p',
        '.button',
        '.eyebrow',
        '.category-tile span',
        '.service-row h3',
        '.service-price strong',
        '.service-info .caption',
        '.price-notice',
        '.faqs summary',
        '.faqs details p',
        '.footer-bottom',
        '.field',
        '.field input',
        '.steps button',
        '.summary-total strong',
        '.slot',
        '.slot small',
        '.status',
        '.request-card p',
        '.request-card .caption',
        '.photo-label',
      ].flatMap((selector) => {
        const el = document.querySelector(selector);
        if (!el) return [];
        const style = getComputedStyle(el);
        if (!el.getClientRects().length) return [];
        let bg = [255, 255, 255],
          node = el;
        while (node) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c.length === 3 || c[3] === 1) {
            bg = c;
            break;
          }
          node = node.parentElement;
        }
        const foreground = parse(style.color),
          a = luminance(foreground),
          b = luminance(bg);
        return [
          {
            selector,
            text: el.textContent.trim().slice(0, 110),
            size: style.fontSize,
            weight: style.fontWeight,
            family: style.fontFamily,
            letterSpacing: style.letterSpacing,
            lineHeight: style.lineHeight,
            color: style.color,
            background: node ? getComputedStyle(node).backgroundColor : 'white',
            contrast: Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2)),
            imageDependent: selector === '.photo-label',
          },
        ];
      });
    });
    report.push({
      name,
      width,
      height,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      metrics,
    });
  }
  await writeFile(`${output}/metrics.json`, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      report.map((x) => ({
        name: x.name,
        overflow: x.overflow,
        metrics: x.metrics.map(({ selector, size, weight, contrast }) => ({
          selector,
          size,
          weight,
          contrast,
        })),
      })),
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
