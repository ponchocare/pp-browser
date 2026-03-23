import { formatName, joinPaths, split } from './utils.js';
import { Field, mandatory, single } from './validation.js';

const DEFAULT_BASE = 'https://pay.ponchopay.com/';

export abstract class PpForm extends HTMLElement {
  private readonly path: string;
  private readonly label: string;
  private readonly fields: Record<string, Field>;

  protected constructor(
    path: string,
    label: string,
    fields: Record<string, Field>
  ) {
    super();
    this.path = path;
    this.label = label;
    this.fields = { ...fields, token: mandatory(single()) };
    this.attachShadow({ mode: 'open' });
  }

  private getAttributeWithFallback(name: string, fallback: string): string {
    return this.getAttribute(name) ?? fallback;
  }

  private isAttributeSet(name: string): boolean {
    return this.getAttributeWithFallback(name, '').length > 0;
  }

  private syncAttributes(): void {
    const form = this.shadowRoot!.querySelector('form');
    if (form) {
      const base = this.getAttributeWithFallback('base', DEFAULT_BASE);

      form.action = joinPaths(base, this.path);
      form.replaceChildren();

      const knownFields = new Set(Object.keys(this.fields));

      Array.from(this.attributes).forEach(attr => {
        const attrName = attr.name;
        const attrValue = attr.value;

        // Check if this is a known field
        if (knownFields.has(attrName)) {
          const { collection } = this.fields[attrName];

          let name = formatName(attrName);
          let values = attrValue.length > 0 ? [attrValue] : [];
          if (collection) {
            name = `${name}[]`;
            values = split(attrValue, ',');
          }

          values.forEach(value => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });
        }
        // Handle dot notation attributes
        else if (attrName.includes('.')) {
          const parts = attrName.split('.');

          const formattedBase = formatName(parts[0]);
          const nestedKeys = parts.slice(1);

          // Convert to bracket notation: foo.0.bar -> foo[0][bar]
          const fieldName = `${formattedBase}[${nestedKeys.join('][')}]`;
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = fieldName;
          input.value = attrValue;
          form.appendChild(input);
        }
      });

      const slot = document.createElement('slot');
      slot.innerHTML = this.label;

      const button = document.createElement('button');
      button.setAttribute('part', 'button');
      button.type = 'submit';
      button.appendChild(slot);
      form.appendChild(button);
    }
  }

  private showErrorMessage(): void {
    const form = this.shadowRoot!.querySelector('form');
    if (form) {
      form.querySelector('div')?.remove();

      const div = document.createElement('div');
      div.setAttribute('part', 'error');
      div.className = 'error';
      div.innerHTML = 'Some attributes are incorrect. Please, review them.';
      form.appendChild(div);
    }
  }

  public connectedCallback(): void {
    const base = this.getAttributeWithFallback('base', DEFAULT_BASE);

    const style = document.createElement('style');
    style.textContent = `
      form {
        display: contents;
     }

      button {
        width: 100%;
        background-color: #02C2A0;
        white-space: nowrap;
        text-decoration-line: none;
        border-radius: .25rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        text-align: center;
        font-size: 1.25rem;
        line-height: 1.75rem;
        color: white;
        margin-top: .5rem;
        margin-bottom: .75rem;
        padding: .75rem 1rem;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-evenly;
        cursor: pointer;
        text-transform: none;
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
      }

      div.error {
        color: #EB3B50;
        font-size: 0.875rem;
      }`;

    const form = document.createElement('form');
    form.action = joinPaths(base, this.path);
    form.method = 'post';
    form.onsubmit = event => {
      if (!this.checkValidity()) {
        event.preventDefault();
        this.showErrorMessage();
      }
    };
    this.shadowRoot!.append(style, form);

    this.syncAttributes();
  }

  public disconnectedCallback(): void {
    this.shadowRoot!.replaceChildren();
  }

  public attributeChangedCallback(): void {
    this.syncAttributes();
  }

  public submit(): void {
    this.shadowRoot!.querySelector('form')?.requestSubmit();
  }

  public checkValidity(): boolean {
    return Object.entries(this.fields).every(([attribute, { required }]) => {
      if (required === true) {
        return this.isAttributeSet(attribute);
      }

      if (Array.isArray(required)) {
        const [dependant, value] = required;

        if (
          (value === true || this.getAttribute(dependant) === value) &&
          this.isAttributeSet(dependant)
        ) {
          return this.isAttributeSet(attribute);
        }
      }

      return true;
    });
  }

  public static get observedAttributes() {
    return ['base', 'token'];
  }
}
