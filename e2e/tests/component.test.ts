import { expect, test } from '@playwright/test';
import { Component } from '../support/component';

const { describe } = test;
const it = test;

const BASE = 'https://pay.ponchopay.com';

describe('pp-payment', () => {
  it('prepares a form with all the necessary elements', async ({ page }) => {
    await page.goto('/');

    const action = `${BASE}/api/integration/generic/initiate`;
    const component = new Component(page.locator('#pp'));

    expect(await component.getFormAction()).toBe(action);
    expect(await component.isVisible()).toBeTruthy();
    expect(await component.areDefaultsPresent()).toBeTruthy();
    expect(await component.hasNote()).toBeFalsy();
  });

  it('prepares a form with all the necessary elements for another server', async ({
    page,
  }) => {
    const base = 'http://other.server';
    await page.goto(`/?base=${base}`);

    const action = `${base}/api/integration/generic/initiate`;
    const component = new Component(page.locator('#pp'));

    expect(await component.getFormAction()).toBe(action);
    expect(await component.isVisible()).toBeTruthy();
    expect(await component.areDefaultsPresent()).toBeTruthy();
    expect(await component.hasNote()).toBeFalsy();
  });

  it('prepares a form with all the necessary elements and a note', async ({
    page,
  }) => {
    await page.goto('/?note=this is a payment note');

    const action = `${BASE}/api/integration/generic/initiate`;
    const component = new Component(page.locator('#pp'));

    expect(await component.getFormAction()).toBe(action);
    expect(await component.isVisible()).toBeTruthy();
    expect(await component.areDefaultsPresent()).toBeTruthy();
    expect(await component.hasNote()).toBeTruthy();
    expect(await component.getNote()).toBe('this is a payment note');
  });

  it('prepares a form with all the necessary elements and an expiry date', async ({
    page,
  }) => {
    const ts = new Date();

    await page.goto(`/?expiry=${ts.toISOString()}`);

    const action = `${BASE}/api/integration/generic/initiate`;
    const component = new Component(page.locator('#pp'));

    expect(await component.getFormAction()).toBe(action);
    expect(await component.isVisible()).toBeTruthy();
    expect(await component.areDefaultsPresent()).toBeTruthy();
    expect(await component.hasExpiry()).toBeTruthy();
    expect(await component.getExpiry()).toBe(ts.toISOString());
  });
});
