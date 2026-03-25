import { createInputsForField, joinPaths } from './utils.js';
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

      Object.entries(this.fields).forEach(([attribute, field]) => {
        if (field.type === 'array') {
          const matchingAttributes = Array.from(this.attributes).filter(attr =>
            attr.name.startsWith(`${attribute}.`)
          );

          matchingAttributes.forEach(attr => {
            const parts = attr.name.split('.');
            const fieldName = parts[parts.length - 1];

            const subField = field.schema?.[fieldName];
            if (!subField) return;

            createInputsForField(form, attr.name, attr.value, subField.type);
          });

          return;
        }

        if (this.hasAttribute(attribute)) {
          const attr = this.getAttribute(attribute)!;
          createInputsForField(form, attribute, attr, field.type);
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

  private validateField(fieldPath: string, field: Field): boolean {
    if (field.required === true) {
      return this.isAttributeSet(fieldPath);
    }

    if (Array.isArray(field.required)) {
      const [dependant, value] = field.required;

      if (
        (value === true || this.getAttribute(dependant) === value) &&
        this.isAttributeSet(dependant)
      ) {
        return this.isAttributeSet(fieldPath);
      }
    }

    return true;
  }

  public checkArrayIsValid(attribute: string, field: Field): boolean {
    const matchingAttributes = Array.from(this.attributes).filter(attr =>
      attr.name.startsWith(`${attribute}.`)
    );

    const indexes = matchingAttributes.map(attr => {
      const match = attr.name.match(new RegExp(`^${attribute}\\.(\\d+)\\.`));
      return match ? parseInt(match[1], 10) : null;
    });

    const uniqueIndexes = Array.from(new Set(indexes));

    // If array is required and no items exist fail validation
    if (field.required === true && uniqueIndexes.length === 0) {
      return false;
    }

    // If no items exist but array is optional, validation passes
    if (uniqueIndexes.length === 0) {
      return true;
    }

    return uniqueIndexes.every(index =>
      Object.entries(field.schema!).every(([key, subField]) => {
        const fullPath = `${attribute}.${index}.${key}`;
        return this.validateField(fullPath, subField);
      })
    );
  }

  public checkValidity(): boolean {
    return Object.entries(this.fields).every(
      ([attribute, { type, schema, required }]) => {
        if (type === 'array') {
          return this.checkArrayIsValid(attribute, {
            type,
            schema,
            required,
          });
        }

        return this.validateField(attribute, { type, required, schema });
      }
    );
  }

  public static get observedAttributes() {
    return ['base', 'token'];
  }
}
