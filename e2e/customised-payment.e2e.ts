import { test } from '@playwright/test';
import { expectSubmission, submitExample } from './support';

test('customised-payment.html submits the expected data', async ({
  page,
  baseURL,
}) => {
  const received = await submitExample(
    page,
    baseURL,
    'customised-payment.html'
  );

  expectSubmission(received, {
    endpoint: '/api/integration/generic/initiate',
    contentType: 'application/x-www-form-urlencoded',
    fields: [
      ['amount', '4274'],
      ['metadata', 'order:67651'],
      ['urn', '🏠'],
      ['email', 'tommy@server.com'],
      ['note', 'Example payment'],
      ['token', '🤫'],
    ],
  });
});
