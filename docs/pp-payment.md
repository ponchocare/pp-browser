# pp-payment

This web component simplifies the payment initialisation directly from the browser.

## How to

Make sure you have imported the library in the HTML document. Then, add the element like this:

```html
<pp-payment {attributes}>{label}</pp-payment>
```

## Usage

Attributes:

| Attribute                       | Mandatory | Description                                                                     |
| ------------------------------- | --------- | ------------------------------------------------------------------------------- |
| token                           | Yes       | Authentication token securely computed in your servers from the integration key |
| metadata                        | Yes       | Any string you want to keep attached to the payment                             |
| urn                             | Yes       | The location Unique Reference Number                                            |
| amount                          | Yes       | The payable amount in pences                                                    |
| email                           | Yes       | The user email                                                                  |
| note                            | No        | Any note to be attached to the payment                                          |
| expiry                          | No        | The date you want the payment to expire (Check `DateValue` details)             |
| constraints.minimum_card_amount | No        | Minimum amount that must be processed with a card payment                       |

DateValue:

A date value must be an ISO8601 string.

### Validation

Please, note that if a mandatory field is not provided, the component will refuse to initiate the payment and, instead,
it will show the error message `Some attributes are incorrect. Please, review them.`. If you don't want this message
to be visible, take a look at the customisation section to hide it (please, bear in mind that hiding the message
will not make the component to work if the data is invalid).

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
