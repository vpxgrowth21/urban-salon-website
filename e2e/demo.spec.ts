import { test, expect } from '@playwright/test';
const fixedTime = new Date('2026-11-08T03:30:00Z');
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(fixedTime);
});
test('customer request → owner approval → status → cancellation', async ({ page, context }) => {
  const errors: string[] = [];
  const outbound: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (
      !r.url().startsWith(process.env.BASE_URL || 'http://localhost:3000') &&
      !r.url().startsWith('data:')
    )
      outbound.push(r.url());
  });
  await page.goto('/services');
  await page.getByRole('textbox', { name: 'Search services' }).fill('Hair Spa');
  await expect(page.getByRole('heading', { name: 'Hair Spa', exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Choose options/ }).click();
  await expect(page).toHaveURL(/book\?service=hair-spa/);
  await expect(
    page.getByRole('button', { name: 'Choose date & time', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: /Short.*₹800/ }).click();
  await page.getByRole('checkbox', { name: /Extra scalp massage/ }).check();
  await page.getByRole('button', { name: 'Choose date & time', exact: true }).click();
  await page.getByLabel('Or choose another date').fill('2026-11-11');
  await page.getByRole('button', { name: '4:00 PM — requestable', exact: true }).click();
  await page.getByRole('button', { name: 'Your details', exact: true }).click();
  await page.getByRole('button', { name: 'Request Appointment — No Advance Payment' }).click();
  await expect(page.getByText('Please enter your full name.')).toBeVisible();
  await page.getByLabel('Full name').fill('Demo Journey Guest');
  await page.getByLabel('Mobile number').fill('12345');
  await page.getByRole('button', { name: 'Request Appointment — No Advance Payment' }).click();
  await expect(page.getByText('Enter a valid 10-digit Indian mobile number.')).toBeVisible();
  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request Appointment — No Advance Payment' }).click();
  await expect(page.getByRole('heading', { name: 'Appointment Request Received!' })).toBeVisible();
  await expect(page.getByText('Pending approval', { exact: true })).toBeVisible();
  await expect(page.locator('.request-meta')).toContainText('Extra scalp massage');
  await expect(
    page.getByText('Demo only — this request has not been sent to the salon.'),
  ).toBeVisible();
  const statusUrl = page.url();
  const owner = await context.newPage();
  await owner.goto('/demo/admin');
  await owner.getByRole('button', { name: /Demo Journey Guest.*Pending approval/ }).click();
  await owner.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(owner.getByRole('status')).toHaveText('Approved in the demo. No notification sent.');
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel demo request', exact: true }).click();
  await page.getByRole('button', { name: 'Yes, cancel request' }).click();
  await expect(page.getByText('Cancelled', { exact: true })).toBeVisible();
  await owner.close();
  await page.goto(statusUrl);
  await expect(page.getByText('Cancelled', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(outbound).toEqual([]);
});
test('discovery, gallery keyboard controls, enquiries, and editable prices', async ({ page }) => {
  await page.goto('/services');
  await page.getByRole('button', { name: /^Facials/ }).click();
  await expect(page.getByRole('heading', { name: 'Hydrating Facial', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search services' }).fill('not a service');
  await expect(page.getByRole('heading', { name: 'No rituals found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('link', { name: 'Hydrating Facial', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hydrating Facial', exact: true })).toBeVisible();
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Hair', exact: true }).click();
  await page.getByRole('button', { name: 'Open Texture with a little personality' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog')).toContainText('Everyday hair inspiration');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.goto('/bridal#enquire');
  await page.getByLabel('Full name').fill('Demo Bride');
  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByLabel('Event date').fill('2026-11-20');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request a Bridal Consultation' }).click();
  await expect(page.getByText('Demo enquiry received.')).toBeVisible();
  await page.goto('/demo/admin');
  await page.getByRole('button', { name: 'Enquiries', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Demo Bride', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Services & Prices', exact: true }).click();
  await page
    .getByRole('spinbutton', { name: 'Price for Signature Haircut', exact: true })
    .fill('650');
  await page
    .locator('.editor-row')
    .filter({ has: page.getByRole('heading', { name: 'Signature Haircut', exact: true }) })
    .getByRole('button', { name: 'Save', exact: true })
    .click();
  await page.goto('/services/signature-haircut');
  await expect(page.locator('.detail-price')).toContainText('₹650');
});
test('owner proposes another time and customer accepts after revalidation', async ({ page }) => {
  await page.goto('/demo/admin');
  await page.getByRole('button', { name: /Sample Guest A/ }).click();
  await page.getByRole('button', { name: 'Propose a new time', exact: true }).click();
  await page.getByLabel('Proposed date').fill('2026-11-11');
  await page.getByLabel('Proposed time').fill('16:00');
  await page.getByRole('button', { name: 'Save proposal' }).click();
  await page.getByRole('link', { name: 'View customer demo status' }).click();
  await expect(page).toHaveURL(/\/booking\//);
  await expect(page.locator('.success-card .status')).toHaveText('New time proposed');
  await page.getByRole('button', { name: 'Accept proposed time' }).click();
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
});
for (const width of [320, 360, 375, 390, 412, 430, 768, 1024, 1440, 1920]) {
  test(`responsive customer pages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/services',
      '/book?service=signature-haircut',
      '/bridal',
      '/gallery',
      '/demo/admin',
    ]) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `${route} should fit ${width}px`).toBe(false);
      if (route === '/' && [390, 1440].includes(width)) {
        await page.locator('.home-gallery').scrollIntoViewIfNeeded();
        await page
          .locator('.home-gallery img')
          .evaluateAll((images) =>
            Promise.all(
              images.map((img) => (img as HTMLImageElement).decode().catch(() => undefined)),
            ),
          );
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
      }
    }
  });
}
test('mobile menu, touch flow and landscape layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Book an Appointment' })
    .click();
  await page.getByRole('textbox', { name: 'Search booking services' }).fill('Threading');
  await page
    .locator('.service-row')
    .filter({ has: page.getByRole('heading', { name: 'Eyebrow Threading', exact: true }) })
    .getByRole('button', { name: 'Add +' })
    .click();
  await page.getByRole('button', { name: 'Choose date & time', exact: true }).click();
  await page.getByLabel('Or choose another date').fill('2026-11-11');
  await page.getByRole('button', { name: '4:00 PM — requestable', exact: true }).click();
  await page.getByRole('button', { name: 'Your details', exact: true }).click();
  await page.getByLabel('Full name').fill('Demo Mobile');
  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request Appointment — No Advance Payment' }).click();
  await expect(page.getByRole('heading', { name: 'Appointment Request Received!' })).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(
    false,
  );
});
test('all public routes and not-found render with demo noindex', async ({ page }) => {
  for (const route of [
    '/about',
    '/contact',
    '/offers',
    '/privacy',
    '/terms',
    '/booking-policy',
    '/booking/invalid',
    '/services/hair-spa',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto('/nonexistent');
  await expect(page.getByRole('heading', { name: /Let’s find your way back/ })).toBeVisible();
});

test('owner decline, expiry, hours, service visibility and reset controls', async ({ page }) => {
  await page.goto('/demo/admin');
  await page.getByRole('button', { name: 'Simulator', exact: true }).click();
  await page.getByRole('button', { name: 'Simulate a conflict' }).click();
  await expect(page.getByRole('status')).toContainText('conflicts');
  await page.getByRole('button', { name: 'Expire a mock hold' }).click();
  await expect(page.getByRole('status')).toContainText('Mock hold expired');
  await page.getByRole('button', { name: 'Requests', exact: true }).click();
  await page.getByRole('button', { name: /Sample Guest A/ }).click();
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect(page.locator('.request-detail .status')).toHaveText('Declined');
  await page.getByRole('button', { name: 'Business hours', exact: true }).click();
  await page.getByLabel('Closing hour (24h)').fill('17');
  await page.getByRole('button', { name: 'Save illustrative hours' }).click();
  await expect(page.getByRole('status')).toContainText('updated');
  await page.getByRole('button', { name: 'Services & Prices', exact: true }).click();
  const row = page
    .locator('.editor-row')
    .filter({ has: page.getByRole('heading', { name: 'Signature Haircut', exact: true }) });
  await row.getByRole('checkbox').uncheck();
  await row.getByRole('button', { name: 'Save', exact: true }).click();
  await page.goto('/services');
  await page.getByRole('textbox', { name: 'Search services' }).fill('Signature Haircut');
  await expect(page.getByRole('heading', { name: 'No rituals found' })).toBeVisible();
  await page.goto('/demo/admin');
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('button', { name: 'Reset all demo data' }).click();
  await expect(page.getByRole('status')).toHaveText('Demo data restored.');
  await page.goto('/services');
  await page.getByRole('textbox', { name: 'Search services' }).fill('Signature Haircut');
  await expect(page.getByRole('heading', { name: 'Signature Haircut', exact: true })).toBeVisible();
});
