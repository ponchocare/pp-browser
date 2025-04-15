import type { PpForm } from '../src/PpForm';
import { Maybe } from '../src/utils';

type Lucky<T> = Maybe<T> | null;

export function createElement(
  component: 'payment' | 'subscription',
  attributes: Record<string, string> = {},
  children: string = ''
): PpForm {
  const attrs = Object.entries(attributes)
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');

  document.body.innerHTML = `<pp-${component} ${attrs}>${children}</pp-${component}>`;
  return document.querySelector(`pp-${component}`) as PpForm;
}

export function getAction(element: PpForm): Lucky<string> {
  const sr = element.shadowRoot;
  const form = sr?.querySelector('form');

  return form?.getAttribute('action');
}

export function getInputValue(element: PpForm, name: string): Lucky<string> {
  const sr = element.shadowRoot;
  const input = sr?.querySelector<HTMLInputElement>(
    `input[type="hidden"][name="${name}"]`
  );

  return input?.value;
}

export function getInputValues(element: PpForm, name: string): Lucky<string[]> {
  const sr = element.shadowRoot;
  const inputs = sr?.querySelectorAll<HTMLInputElement>(
    `input[type="hidden"][name="${name}"]`
  );

  return Array.from(inputs ?? []).map(input => input.value);
}

export function submit(element: PpForm): void {
  const sr = element.shadowRoot;
  const form = sr?.querySelector('form');
  const button = sr?.querySelector('button');

  form?.addEventListener('submit', event => event.preventDefault());
  button?.click();
}
