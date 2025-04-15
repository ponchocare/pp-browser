import { describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import { createElement, getAction, getInputValue, submit } from './helpers';

import '../src/index';

const base = 'https://some.base/url';
const amount = '1234';
const metadata = 'order-123xyz';
const urn = 'IUpGPArQ';
const email = 'help@ponchopay.com';
const token = 'ytfBNCiHCbU/WdEZ1yEB60DsMpgD7VgR0SSqgJhj0mY=';
const fields = { base, token, amount, metadata, urn, email };

describe('PpPayment', () => {
  it('sends the form when all the required attributes are provided', () => {
    const element = createElement('payment', fields);

    expect(element.checkValidity()).toBe(true);
    submit(element);
    expect(element.shadowRoot?.querySelector('div')).toBeNull();
  });

  it.each([
    { attr: 'note', value: 'Order note' },
    { attr: 'expiry', value: new Date().toISOString() },
    { attr: 'constraints.minimum_card_amount', value: 34 },
  ])(
    'sends the form with the optional $attr attribute provided',
    ({ attr, value }) => {
      const element = createElement('payment', {
        ...fields,
        [attr]: value,
      });

      expect(element.checkValidity()).toBe(true);
      submit(element);
      expect(element.shadowRoot?.querySelector('div')).toBeNull();
    }
  );

  it.each([['token'], ['amount'], ['metadata'], ['urn'], ['email']])(
    'prevents the form submission if the %s attribute is missing or empty',
    attr => {
      const element = createElement('payment', fields);

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

  it('shows the default button label', () => {
    const element = createElement('payment');

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot?.assignedNodes()).toHaveLength(0);
    expect(slot?.textContent).toBe('Pay with PonchoPay');
  });

  it('shows a custom button label', () => {
    const label = 'Wish me luck!';

    const element = createElement('payment', {}, label);

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot?.assignedNodes()).toHaveLength(1);
    expect(slot?.assignedNodes()[0].textContent).toBe(label);
  });

  it('updates the form action when the base attribute changes', () => {
    const element = createElement('payment');
    expect(getAction(element)).toBe(
      'https://pay.ponchopay.com/api/integration/generic/initiate'
    );

    element.setAttribute('base', 'http://some.server/');
    expect(getAction(element)).toBe(
      'http://some.server/api/integration/generic/initiate'
    );
  });

  it.each([
    { attr: 'token', name: 'token' },
    { attr: 'amount', name: 'amount' },
    { attr: 'metadata', name: 'metadata' },
    { attr: 'urn', name: 'urn' },
    { attr: 'email', name: 'email' },
    { attr: 'note', name: 'note' },
    { attr: 'expiry', name: 'expiry' },
    {
      attr: 'constraints.minimum_card_amount',
      name: 'constraints[minimum_card_amount]',
    },
  ])(
    'updates the $name value when the $attr attribute changes',
    ({ attr, name }) => {
      const originalValue = randomUUID();
      const element = createElement('payment', {
        [attr]: originalValue,
      });
      expect(getInputValue(element, name)).toBe(originalValue);

      const newValue = randomUUID();
      element.setAttribute(attr, newValue);

      expect(getInputValue(element, name)).not.toBe(originalValue);
      expect(getInputValue(element, name)).toBe(newValue);
    }
  );
});
