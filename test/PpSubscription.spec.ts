import { describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import {
  createElement,
  getAction,
  getInputValue,
  getInputValues,
  submit,
} from './helpers';

import '../src/index';

const base = 'https://some.base/url';
const amount = '1234';
const metadata = 'order-123xyz';
const urn = 'IUpGPArQ';
const email = 'help@ponchopay.com';
const token = 'ytfBNCiHCbU/WdEZ1yEB60DsMpgD7VgR0SSqgJhj0mY=';
const fields = {
  base,
  token,
  amount,
  metadata,
  urn,
  email,
  'repetition.granularity': 'daily',
  'repetition.period': '2',
};

describe('PpSubscription', () => {
  it('sends the form when all the required attributes are provided', () => {
    const element = createElement('subscription', fields);

    expect(element.checkValidity()).toBe(true);
    submit(element);
    expect(element.shadowRoot?.querySelector('div')).toBeNull();
  });

  it.each([
    { attr: 'note', value: 'Order note' },
    { attr: 'ending.condition', value: 'never' },
  ])(
    'sends the form with the optional $attr attribute provided',
    ({ attr, value }) => {
      const element = createElement('subscription', {
        ...fields,
        [attr]: value,
      });

      expect(element.checkValidity()).toBe(true);
      submit(element);
      expect(element.shadowRoot?.querySelector('div')).toBeNull();
    }
  );

  it.each([
    ['token'],
    ['amount'],
    ['metadata'],
    ['urn'],
    ['email'],
    ['repetition.granularity'],
    ['repetition.period'],
  ])(
    'prevents the form submission if the %s attribute is missing or empty',
    attr => {
      const element = createElement('subscription', fields);

      element.setAttribute(attr, '');
      expect(element.checkValidity()).toBe(false);
      submit(element);
      expect(element.shadowRoot?.querySelector('div')).not.toBeNull();

      element.removeAttribute(attr);
      expect(element.checkValidity()).toBe(false);
      submit(element);
      expect(element.shadowRoot?.querySelector('div')).not.toBeNull();
    }
  );

  it.each([
    ['repetition.granularity', 'weekly', 'repetition.weekdays'],
    ['repetition.granularity', 'monthly', 'repetition.day'],
    ['ending.condition', 'occurrences', 'ending.occurrences'],
    ['ending.condition', 'date', 'ending.date'],
    [
      'additional_one_time_payment.amount',
      '789',
      'additional_one_time_payment.metadata',
    ],
    [
      'additional_one_time_payment.amount',
      '789',
      'additional_one_time_payment.note',
    ],
  ])(
    'prevents the form submission if the %s attribute is provided with %s value but %s is not provided',
    (attr, value) => {
      const element = createElement('subscription', fields);

      element.setAttribute(attr, value);
      expect(element.checkValidity()).toBe(false);
      submit(element);
      expect(element.shadowRoot?.querySelector('div')).not.toBeNull();
    }
  );

  it('shows the default button label', () => {
    const element = createElement('subscription');
    const slot = element.shadowRoot?.querySelector('slot');

    expect(slot?.assignedNodes()).toHaveLength(0);
    expect(slot?.textContent).toBe('Subscribe with PonchoPay');
  });

  it('shows a custom button label', () => {
    const label = 'Wish me luck!';

    const element = createElement('subscription', {}, label);
    const slot = element.shadowRoot?.querySelector('slot');

    expect(slot?.assignedNodes()).toHaveLength(1);
    expect(slot?.assignedNodes()[0].textContent).toBe(label);
  });

  it('updates the form action when the base attribute changes', () => {
    const element = createElement('subscription');
    expect(getAction(element)).toBe(
      'https://pay.ponchopay.com/api/integration/generic/subscription/redirect'
    );

    element.setAttribute('base', 'http://some.server/');
    expect(getAction(element)).toBe(
      'http://some.server/api/integration/generic/subscription/redirect'
    );
  });

  it.each([
    { attr: 'token', name: 'token' },
    { attr: 'amount', name: 'amount' },
    { attr: 'metadata', name: 'metadata' },
    { attr: 'urn', name: 'urn' },
    { attr: 'email', name: 'email' },
    { attr: 'note', name: 'note' },
    { attr: 'repetition.granularity', name: 'repetition[granularity]' },
    { attr: 'repetition.period', name: 'repetition[period]' },
    { attr: 'repetition.day', name: 'repetition[day]' },
    { attr: 'ending.condition', name: 'ending[condition]' },
    { attr: 'ending.occurrences', name: 'ending[occurrences]' },
    { attr: 'ending.date', name: 'ending[date]' },
    { attr: 'ending.condition', name: 'ending[condition]' },
    {
      attr: 'additional_one_time_payment.amount',
      name: 'additional_one_time_payment[amount]',
    },
    {
      attr: 'additional_one_time_payment.metadata',
      name: 'additional_one_time_payment[metadata]',
    },
    {
      attr: 'additional_one_time_payment.note',
      name: 'additional_one_time_payment[note]',
    },
    {
      attr: 'additional_one_time_payment.expiry',
      name: 'additional_one_time_payment[expiry]',
    },
    {
      attr: 'additional_one_time_payment.constraints.minimum_card_amount',
      name: 'additional_one_time_payment[constraints][minimum_card_amount]',
    },
  ])(
    'updates the $name value when the $attr attribute changes',
    ({ attr, name }) => {
      const originalValue = randomUUID();
      const element = createElement('subscription', { [attr]: originalValue });
      expect(getInputValue(element, name)).toBe(originalValue);

      const newValue = randomUUID();
      element.setAttribute(attr, newValue);

      expect(getInputValue(element, name)).not.toBe(originalValue);
      expect(getInputValue(element, name)).toBe(newValue);
    }
  );

  it(`updates the 'repetition[weekdays][]' values when the 'repetition.weekdays' attribute changes`, () => {
    const element = createElement('subscription');

    element.setAttribute('repetition.weekdays', '');
    expect(getInputValues(element, 'repetition[weekdays][]')).toHaveLength(0);

    element.setAttribute('repetition.weekdays', 'monday');
    expect(getInputValues(element, 'repetition[weekdays][]')).toHaveLength(1);
    expect(getInputValues(element, 'repetition[weekdays][]')).toEqual([
      'monday',
    ]);

    element.setAttribute('repetition.weekdays', 'monday,tuesday,friday');
    expect(getInputValues(element, 'repetition[weekdays][]')).toHaveLength(3);
    expect(getInputValues(element, 'repetition[weekdays][]')).toEqual([
      'monday',
      'tuesday',
      'friday',
    ]);
  });
});
