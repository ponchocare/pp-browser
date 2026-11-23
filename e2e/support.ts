import { expect, type Page } from '@playwright/test';

export type Fields = [string, string][];

export type Submission = {
  endpoint: string;
  contentType: string | null;
  fields: Fields;
};

/**
 * Sorts the fields so that the comparison does not depend on their order,
 * while still detecting missing, extra or duplicated fields.
 */
export function sortFields(fields: Fields): Fields {
  return [...fields].sort(
    ([a, x], [b, y]) => a.localeCompare(b) || x.localeCompare(y)
  );
}

/**
 * Opens the example linked as `href` from the examples index, submits its
 * form and returns what the (fake) PonchoPay server received.
 */
export async function submitExample(
  page: Page,
  baseURL: string | undefined,
  href: string
): Promise<Submission> {
  // Nothing should leave the local server
  await page.route(
    url => new URL(url).origin !== baseURL,
    route => route.abort()
  );

  await page.goto('/');
  await page.locator(`a[href="${href}"]`).click();
  await expect(page).toHaveURL(new URL(href, `${baseURL}/`).href);

  const component = page.locator('pp-payment, pp-subscription');
  await expect(component).toHaveCount(1);
  const button = component.locator('button');
  await expect(button).toBeVisible();

  const [response] = await Promise.all([
    page.waitForResponse(res => res.request().method() === 'POST'),
    button.click(),
  ]);

  expect(response.status()).toBe(200);
  await expect(component.locator('[part="error"]')).toHaveCount(0);

  return response.json();
}

/**
 * Asserts that the submission matches the expected one, field by field.
 */
export function expectSubmission(actual: Submission, expected: Submission) {
  expect({ ...actual, fields: sortFields(actual.fields) }).toEqual({
    ...expected,
    fields: sortFields(expected.fields),
  });
}
