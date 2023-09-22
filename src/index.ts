import { PpPayment } from './PpPayment.js';

if (!window.customElements.get('pp-payment')) {
  window.customElements.define('pp-payment', PpPayment);
}
