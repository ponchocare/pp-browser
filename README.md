# pp-browser

Tools to integrate PonchoPay on the browser

## Usage

There are 2 ways to use this package:

### HTML import

You can import the compiled file directly from our servers:

```html
<script
  type="module"
  src="https://pay.ponchopay.com/api/integration/generic/asset/pp-browser.<version>.min.js"
></script>
```

After this HTML declaration, you will be able to use the web component.

### NPM installation

You can install the module from `npm`:

```bash
npm i @ponchopay/pp-browser
```

After this command, you can import the web componet like this:

```js
import '@ponchopay/pp-browser';
```

## Using the web component

The web component can be used by declaring it in HTML like this:

```html
<pp-payment {properties}>{text}</pp-payment>
```

The following the list of accepted properties (please, refer to the [official documentation](https://ponchocare.notion.site/PonchoPay-API-integration-04bc3f5220ff4028b0078793bfc03abc) for their meaning):

| Name     | Mandatory |
| -------- | --------- |
| token    | Yes       |
| metadata | Yes       |
| urn      | Yes       |
| amount   | Yes       |
| email    | Yes       |
| note     | No        |

The component's text is optional being "Pay with PonchoPay" the default text. Feel free to change it as you see fit.

## Considerations

Unfortunately, this web component required `HTMLElement` class to exist which means that it is not suitable for Server Side Rendering applications.
There are, however, some techniques that can be used to mitigate this.

### SvelteKit

When using SvelteKit, the component import can be pushed to the `onMount` event:

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('@ponchopay/pp-browser');
	});
</script>

<pp-payment>It worked!</pp-payment>
```

Alternatively, the route can be made non-ssr by exporting [`export const ssr = false;`](https://kit.svelte.dev/docs/page-options#ssr) in the loader file.

## Development

### Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

### Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in the project.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
