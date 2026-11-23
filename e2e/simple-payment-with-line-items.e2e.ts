import { test } from '@playwright/test';
import { expectSubmission, submitExample } from './support';

test('simple-payment-with-line-items.html submits the expected data', async ({
  page,
  baseURL,
}) => {
  const received = await submitExample(
    page,
    baseURL,
    'simple-payment-with-line-items.html'
  );

  expectSubmission(received, {
    endpoint: '/api/integration/generic/initiate',
    contentType: 'application/x-www-form-urlencoded',
    fields: [
      ['amount', '240'],
      ['metadata', 'order:11651'],
      ['urn', '🏠'],
      ['email', 'tommy@server.com'],
      ['note', 'Example payment'],
      ['line_items[0][quantity]', '1'],
      ['line_items[0][amount]', '200'],
      ['line_items[0][description]', 'First item'],
      ['line_items[1][quantity]', '1'],
      ['line_items[1][amount]', '40'],
      ['line_items[1][description]', 'Second item'],
      ['token', '🤫'],
    ],
  });
});
