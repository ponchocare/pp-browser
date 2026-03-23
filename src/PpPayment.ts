import { PpForm } from './PpForm.js';
import { mandatory, optional, single } from './validation.js';

const fields = {
  amount: mandatory(single()),
  metadata: mandatory(single()),
  urn: mandatory(single()),
  email: mandatory(single()),
  note: optional(single()),
  expiry: optional(single()),
  'constraints.minimum_card_amount': optional(single()),
};

export class PpPayment extends PpForm {
  public constructor() {
    super('/api/integration/generic/initiate', 'Pay with PonchoPay', fields);
  }

  public static get observedAttributes() {
    return [...PpForm.observedAttributes, ...Object.keys(fields)];
  }
}
