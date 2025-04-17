# pp-subscription

This web component simplifies the subscription initialisation directly from the browser.

## How to

Make sure you have imported the library in the HTML document. Then, add the element like this:

```html
<pp-subscription {attributes}>{label}</pp-subscription>
```

## Usage

Attributes:

| Attribute                                                   | Mandatory | Description                                                                          |
| ----------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| token                                                       | Yes       | Authentication token securely computed in your servers from the integration key      |
| urn                                                         | Yes       | The location Unique Reference Number                                                 |
| amount                                                      | Yes       | The payable amount in pence for each generated payment                              |
| metadata                                                    | Yes       | Any string you want to keep attached to the subscription                             |
| email                                                       | Yes       | The user email                                                                       |
| note                                                        | No        | Any note to be attached to the subscription                                          |
| repetition.granularity                                      | Yes       | The time span range. It can be `day`, `week`, `month`, or `year`                     |
| repetition.period                                           | Yes       | The amount of granularity before the next payment is generated                       |
| repetition.weekdays                                         | Maybe     | If granularity is `week`, this must contain a comma-separated list of the week days  |
| repetition.day                                              | Maybe     | If granularity is `month`, this must contain the day of the month                    |
| ending.condition                                            | No        | The termination condition. It can be `never`, `occurrences`, or `date`               |
| ending.occurrences                                          | Maybe     | If condition is `occurrences`, this must contain the number of payments to terminate |
| ending.date                                                 | Maybe     | If condition is `date`, this must contain the date (Check `DateValue` details)       |
| additional_one_time_payment.amount                          | No        | The payable amount in pences                                                         |
| additional_one_time_payment.metadata                        | Maybe     | If amount is set, any string you want to keep attached to the payment                |
| additional_one_time_payment.note                            | No        | Any note to be attached to the payment                                               |
| additional_one_time_payment.expiry                          | No        | The date you want the payment to expire (Check `DateValue` details)                  |
| additional_one_time_payment.constraints.minimum_card_amount | No        | Minimum amount that must be processed with a card payment                            |

DateValue:

A date value must be an ISO8601 string.

### Validation

Please, note that if a mandatory field is not provided, the component will refuse to initiate the subscription and, instead,
it will show the error message `Some attributes are incorrect. Please, review them.`. If you don't want this message
to be visible, please, take a look at the customisation section to hide it (please, bear in mind that hidding the message
will not make the component to work if the data is invalid).

## Customisation

The component can be customised with the following CSS styles:
```css
pp-subscription::part(button) {
  /* styles for the button */
}

pp-subscription::part(error) {
  /* styles for the error message */
}
```

In addition to these styles, the button label can also be customised. For this, supply any label you want as the component's
children. Please, bear in mind that, if you don't want any custom label, then absolutely nothing must be provided. Even a
whitespace will make the label to disappear.
