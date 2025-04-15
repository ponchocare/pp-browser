/**
 * Collection: Whether the attribute is expected to have comma-separated values ot nor.
 * - false: Single
 * - true: Multiple
 *
 * Required: Whether the attribute is required to submit the form or not.
 * - false: Optional
 * - true: Mandatory
 * - [string, string | true]: Mandatory if the attribute in the first index is set. If the second
 *                            is a string, it also needs to match that value. Optional otherwise.
 */
export type Field = {
  collection: boolean;
  required: boolean | [string, string | true];
};

/**
 * Marks the attribute as representing a single value.
 * Note: By default it makes the attribute optional. Use the other functions to change this.
 */
export function single(): Field {
  return { required: false, collection: false };
}

/**
 * Marks the attribute as representing multiple values.
 * Note: By default it makes the attribute optional. Use the other functions to change this.
 */
export function multiple(): Field {
  return { required: false, collection: true };
}

/**
 * Marks the attribute as mandatory.
 */
export function mandatory(attribute: Field): Field {
  return { ...attribute, required: true };
}

/**
 * Marks the attribute as optional.
 */
export function optional(attribute: Field): Field {
  return { ...attribute, required: false };
}

/**
 * Marks the attribute's requirement as dependant on another attribute's existance.
 */
export function dependant(
  name: string,
  value: string | true,
  attribute: Field
): Field {
  return { ...attribute, required: [name, value] };
}
