import { PpForm } from './PpForm.js';
import {
  dependant,
  mandatory,
  multiple,
  optional,
  single,
} from './validation.js';

const fields = {
  amount: mandatory(single()),
  metadata: mandatory(single()),
  urn: mandatory(single()),
  email: mandatory(single()),
  note: optional(single()),
  'repetition.granularity': mandatory(single()),
  'repetition.period': mandatory(single()),
  'repetition.weekdays': dependant(
    'repetition.granularity',
    'weekly',
    multiple()
  ),
  'repetition.day': dependant('repetition.granularity', 'monthly', single()),
  'ending.condition': optional(single()),
  'ending.occurrences': dependant('ending.condition', 'occurrences', single()),
  'ending.date': dependant('ending.condition', 'date', single()),
  'additional_one_time_payment.amount': optional(single()),
  'additional_one_time_payment.metadata': dependant(
    'additional_one_time_payment.amount',
    true,
    single()
  ),
  'additional_one_time_payment.note': optional(single()),
  'additional_one_time_payment.expiry': optional(single()),
  'additional_one_time_payment.constraints.minimum_card_amount': optional(
    single()
  ),
};

export class PpSubscription extends PpForm {
  public constructor() {
    super(
      '/api/integration/generic/subscription/redirect',
      'Subscribe with PonchoPay',
      fields
    );
  }

  public static get observedAttributes() {
    return [...PpForm.observedAttributes, ...Object.keys(fields)];
  }
}
