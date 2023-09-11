function buildElement<TTag extends keyof HTMLElementTagNameMap>(
  tag: TTag,
  props?: Partial<HTMLElementTagNameMap[TTag]>,
  children?: HTMLElement[] | string
): HTMLElementTagNameMap[TTag] {
  const element = document.createElement(tag);
  Object.entries(props ?? {}).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  if (typeof children === 'string') {
    element.innerText = children;
  } else if (Array.isArray(children)) {
    children.forEach(element.appendChild.bind(element));
  }
  return element;
}

export function buildHiddenInput(
  name: string,
  value: string
): HTMLInputElement {
  return buildElement('input', { type: 'hidden', name, value });
}

export function buildForm(
  action: string,
  ...elements: HTMLElement[]
): HTMLFormElement {
  return buildElement('form', { action, method: 'post' }, elements);
}

export function buildSlot(fallback: HTMLElement[] | string): HTMLSlotElement {
  return buildElement('slot', {}, fallback);
}

export function buildButton(children: HTMLElement): HTMLButtonElement {
  return buildElement('button', { type: 'submit' }, [children]);
}

export function buildStyle(styles: string): HTMLStyleElement {
  return buildElement('style', {}, styles);
}
