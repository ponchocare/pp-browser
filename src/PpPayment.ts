import {
  buildButton,
  buildForm,
  buildHiddenInput,
  buildSlot,
  buildStyle,
} from './utils';

const PONCHO_PAY = 'https://pay.ponchopay.com/api/integration/generic/initiate';
const ATTRIBUTES = ['token', 'metadata', 'urn', 'amount', 'email', 'note'];
const STYLES = [
  'width: 100%',
  'background-color: #02C2A0',
  'white-space: nowrap',
  'text-decoration-line: none',
  'border-radius: .25rem',
  'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'text-align: center',
  'font-size: 1.25rem',
  'line-height: 1.75rem',
  'color: white',
  'margin-top: .5rem',
  'margin-bottom: .75rem',
  'padding: .75rem 1rem',
  'display: flex',
  'flex-wrap: nowrap',
  'align-items: center',
  'justify-content: space-evenly',
  'cursor: pointer',
  'text-transform: none',
  'box-sizing: border-box',
  'border-width: 0',
  'border-style: solid',
  'border-color: currentColor',
];

export class PpPayment extends HTMLElement {
  private sr: ShadowRoot;

  public constructor() {
    super();

    this.sr = this.attachShadow({ mode: 'open' });
    this.redrawContents();
  }

  private redrawContents(): void {
    this.sr.replaceChildren();
    this.sr.appendChild(
      buildForm(
        PONCHO_PAY,
        ...ATTRIBUTES.filter(
          name => (this.getAttribute(name) ?? '') !== ''
        ).map(name => buildHiddenInput(name, this.getAttribute(name)!)),
        buildStyle(
          `button { ${STYLES.join(';')} ${this.getAttribute(
            'style'
          )} } button:active { transform: translate(1px,1px); }`
        ),
        buildButton(buildSlot('Pay with PonchoPay'))
      )
    );
  }

  public set token(value: string) {
    this.setAttribute('token', value);
  }

  public get token(): string {
    return this.getAttribute('token') ?? '';
  }

  public set metadata(value: string) {
    this.setAttribute('metadata', value);
  }

  public get metadata(): string {
    return this.getAttribute('metadata') ?? '';
  }

  public set urn(value: string) {
    this.setAttribute('urn', value);
  }

  public get urn(): string {
    return this.getAttribute('urn') ?? '';
  }

  public set amount(value: string | number) {
    this.setAttribute('amount', String(value));
  }

  public get amount(): string {
    return this.getAttribute('amount') ?? '';
  }

  public set email(value: string) {
    this.setAttribute('email', value);
  }

  public get email(): string {
    return this.getAttribute('email') ?? '';
  }

  public set note(value: string) {
    this.setAttribute('note', value);
  }

  public get note(): string {
    return this.getAttribute('note') ?? '';
  }

  public attributeChangedCallback(): void {
    this.redrawContents();
  }

  public static get observedAttributes() {
    return ATTRIBUTES;
  }
}
