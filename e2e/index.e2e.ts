import { expect, test } from '@playwright/test';

/**
 * Every example must have its own `<name>.e2e.ts` file; update this list
 * (and add the matching test) whenever an example is added or removed.
 */
test('the examples index links to the tested pages', async ({ page }) => {
  await page.goto('/');

  const hrefs = await page
    .locator('a')
    .evaluateAll(links => links.map(link => link.getAttribute('href')));

  expect(hrefs).toEqual([
    'simple-payment.html',
    'simple-payment-with-line-items.html',
    'customised-payment.html',
    'simple-subscription.html',
    'customised-subscription.html',
  ]);
});
