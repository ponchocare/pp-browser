import { test } from '@playwright/test';
import { expectSubmission, submitExample } from './support';

test('simple-subscription.html submits the expected data', async ({
  page,
  baseURL,
}) => {
  const received = await submitExample(
    page,
    baseURL,
    'simple-subscription.html'
  );

  expectSubmission(received, {
    endpoint: '/api/integration/generic/subscription/redirect',
    contentType: 'application/x-www-form-urlencoded',
    fields: [
      ['amount', '2500'],
      ['metadata', 'subscription:78991'],
      ['urn', '🏠'],
      ['email', 'tommy@server.com'],
      ['note', 'Example subscription'],
      ['repetition[granularity]', 'week'],
      ['repetition[period]', '1'],
      ['repetition[weekdays][]', 'friday'],
      ['additional_one_time_payment[amount]', '899'],
      ['additional_one_time_payment[metadata]', 'payment:78991'],
      ['additional_one_time_payment[note]', 'Example additional payment'],
      ['token', '🤫'],
    ],
  });
});
