import { PpForm } from './PpForm.js';
import { array, mandatory, optional, single } from './validation.js';

const fields = {
  amount: mandatory(single()),
  metadata: mandatory(single()),
  urn: mandatory(single()),
  email: mandatory(single()),
  note: optional(single()),
  expiry: optional(single()),
  'constraints.minimum_card_amount': optional(single()),
  line_items: optional(
    array({
      quantity: mandatory(single()),
      amount: mandatory(single()),
      description: mandatory(single()),
    })
  ),
};

export class PpPayment extends PpForm {
  public constructor() {
    super('/api/integration/generic/initiate', 'Pay with PonchoPay', fields);
  }

  public static get observedAttributes() {
    return [...PpForm.observedAttributes, ...Object.keys(fields)];
  }
}
