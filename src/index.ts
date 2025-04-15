import { PpPayment } from './PpPayment.js';
import { PpSubscription } from './PpSubscription.js';

if (!window.customElements.get('pp-payment')) {
  window.customElements.define('pp-payment', PpPayment);
}

if (!window.customElements.get('pp-subscription')) {
  window.customElements.define('pp-subscription', PpSubscription);
}
