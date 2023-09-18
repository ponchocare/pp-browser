// <pp-payment
//   id="pp"
//   token="N6a1LXQSJsF/WIV5mUK8fi+vL9jn5qt469TqmlfPU4Cc9zjOLsYQYjQ/GmhiVyRx"
//   metadata="id"
//   urn="2609216"
//   amount="1234"
//   email="info@ponchopay.com"
// ></pp-payment>

import { Locator } from '@playwright/test';

const DEFAULTS = {
  token: 'N6a1LXQSJsF/WIV5mUK8fi+vL9jn5qt469TqmlfPU4Cc9zjOLsYQYjQ/GmhiVyRx',
  metadata: 'id',
  urn: '2609216',
  amount: '1234',
  email: 'info@ponchopay.com',
};

export class Component {
  private locator: Locator;

  public constructor(locator: Locator) {
    this.locator = locator;
  }

  public async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  public async getFormAction(): Promise<string> {
    return (await this.locator.locator('form').getAttribute('action')) ?? '';
  }

  public async areDefaultsPresent(): Promise<boolean> {
    for (const [name, value] of Object.entries(DEFAULTS)) {
      const found = await this.locator
        .locator(`input[name="${name}"]`)
        .inputValue();
      if (found !== value) {
        return false;
      }
    }

    return true;
  }

  public async hasNote(): Promise<boolean> {
    return (await this.locator.locator(`input[name="note"]`).count()) > 0;
  }

  public async getNote(): Promise<string | undefined> {
    return await this.locator.locator(`input[name="note"]`).inputValue();
  }
}
