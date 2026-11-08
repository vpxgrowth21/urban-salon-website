import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const origin = process.env.BASE_URL || 'http://localhost:3007';
const output = 'artifacts/previews';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1020 },
    deviceScaleFactor: 1,
  });
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.hero-image img').evaluate((img) => img.decode());
  await page.screenshot({ path: `${output}/home-desktop.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${output}/home-mobile.png` });
  await page.goto(`${origin}/book?service=signature-haircut`);
  await page.getByRole('button', { name: 'Choose date & time', exact: true }).click();
  await page.locator('.dates .date-chip:not(:disabled)').nth(2).click();
  await page.screenshot({ path: `${output}/booking-mobile.png`, fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1020 });
  await page.goto(`${origin}/demo/admin`);
  await page.getByRole('button', { name: /Sample Guest A/ }).waitFor();
  await page.screenshot({ path: `${output}/owner-dashboard.png`, fullPage: true });
  console.log(`Preview images saved to ${output}`);
} finally {
  await browser.close();
}
