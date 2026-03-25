export type Maybe<T> = T | undefined;

/**
 * Clears the start of the string from any matching character
 */
function trimStart(haystack: string, needle: string): string {
  const regex = new RegExp(`^[${needle}]+`);
  return haystack.replace(regex, '');
}

/**
 * Clears the end of the string from any matching character
 */
function trimEnd(haystack: string, needle: string): string {
  const regex = new RegExp(`[${needle}]+$`);
  return haystack.replace(regex, '');
}

/**
 * Joins two paths with a single forward slash in the middle
 */
export function joinPaths(left: string, right: string): string {
  return `${trimEnd(left, '/')}/${trimStart(right, '/')}`;
}

/**
 * Prepares the property name for the API's format
 */
export function formatName(name: string): string {
  const [root, ...path] = name.split('.');
  let properties = '';
  if (path.length > 0) {
    properties = `[${path.join('][')}]`;
  }

  return `${root}${properties}`;
}

/**
 * Splits a haystack by the needle. If the haystack is an empty string, it will return an empty array
 */
export function split(haystack: string, needle: string): string[] {
  if (haystack.length === 0) {
    return [];
  }

  return haystack.split(needle);
}

/**
 * Creates hidden input elements for a field and appends them to the form
 */
export function createInputsForField(
  form: HTMLFormElement,
  attributeName: string,
  attributeValue: string,
  fieldType: 'single' | 'multiple' | 'array'
): void {
  let name = formatName(attributeName);
  let values = attributeValue.length > 0 ? [attributeValue] : [];

  if (fieldType === 'multiple') {
    name = `${name}[]`;
    values = split(attributeValue, ',');
  }

  values.forEach(value => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
}
