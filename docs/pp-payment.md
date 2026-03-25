# pp-payment

This web component simplifies the payment initialisation directly from the browser.

## How to

Make sure you have imported the library in the HTML document. Then, add the element like this:

```html
<pp-payment {attributes}>{label}</pp-payment>
```

## Usage

Attributes:

| Attribute                       | Mandatory | Description                                                                          |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| token                           | Yes       | Authentication token securely computed in your servers from the integration key      |
| metadata                        | Yes       | Any string you want to keep attached to the payment                                  |
| urn                             | Yes       | The location Unique Reference Number                                                 |
| amount                          | Yes       | The payable amount in pences                                                         |
| email                           | Yes       | The user email                                                                       |
| note                            | No        | Any note to be attached to the payment                                               |
| expiry                          | No        | The date you want the payment to expire (Check `DateValue` details)                  |
| constraints.minimum_card_amount | No        | Minimum amount that must be processed with a card payment                            |
| line_items.{index}.{field}      | No        | An array of line items describing the products you are paying for. Check `LineItems` |

DateValue:

A date value must be an ISO8601 string.

LineItems:

Line items must be provided using dot notation with the pattern `line_items.{index}.{field}`, where:

- `{index}` is the zero-based index of the line item (0, 1, 2, ...)
- `{field}` is one of: `quantity`, `amount`, or `description`

Each line item must have all three required fields:

- `quantity` (string, required): The quantity of the item
- `amount` (string, required): The amount in pences for this line item
- `description` (string, required): A description of the item

Example:

```html
<pp-payment
  token="..."
  amount="4274"
  metadata="order-123"
  urn="EY1068326"
  email="customer@example.com"
  line_items.0.quantity="1"
  line_items.0.amount="4000"
  line_items.0.description="First item"
  line_items.1.quantity="1"
  line_items.1.amount="274"
  line_items.1.description="Second item"
>
  Pay Now
</pp-payment>
```

**Note:** The sum of all line item amounts must equal the total `amount` attribute value. In the example above, 4000 + 274 = 4274 pences.

### Validation

Please, note that if a mandatory field is not provided, the component will refuse to initiate the payment and, instead,
it will show the error message `Some attributes are incorrect. Please, review them.`. If you don't want this message
to be visible, take a look at the customisation section to hide it (please, bear in mind that hiding the message
will not make the component work if the data is invalid).

## Customisation

The component can be customised with the following CSS styles:

```css
pp-payment::part(button) {
  /* styles for the button */
}

pp-payment::part(error) {
  /* styles for the error message */
}
```

In addition to these styles, the button label can also be customised. For this, supply any label you want as the component's
children. Please, bear in mind that, if you don't want any custom label, then absolutely nothing must be provided. Even a
whitespace will make the label to disappear.
