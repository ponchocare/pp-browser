# pp-browser

Tools to integrate PonchoPay on the browser

## Usage

There are 2 ways to use this package:

### HTML import

You can import the compiled file directly from our servers:

```html
<script
  src="https://pay.ponchopay.com/api/integration/generic/asset/pp-browser.<version>.min.js"
></script>
```

After this HTML declaration, you will be able to use the web components.

### NPM installation

You can install the module from `npm` (or the package manager of your preference):

```bash
npm i @ponchopay/pp-browser
```

After this command, you can import the web componet like this:

```js
import '@ponchopay/pp-browser';
```

## Using the web components

This library injects 2 new HTML elements:
- [pp-payment](https://github.com/ponchocare/pp-browser/blob/master/docs/pp-payment.md): This web component simplifies the payment initialisation directly from the browser.
- [pp-subscription](https://github.com/ponchocare/pp-browser/blob/master/docs/pp-subscription.md): This web component simplifies the subscription initialisation directly from the browser.

## Considerations

Unfortunately, these web components require the `HTMLElement` class to exist which means that it is not suitable for Server Side Rendering (SSR) applications.
There are, however, some techniques that can be used to mitigate this.

### SvelteKit

When using SvelteKit, the components' import can be pushed to the `onMount` event:

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('@ponchopay/pp-browser');
	});
</script>

<pp-payment>It worked!</pp-payment>
```

Alternatively, the route can be made non-ssr by exporting [`export const ssr = false;`](https://kit.svelte.dev/docs/page-options#ssr) in the `+page.js` file.

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

### Testing the project

To test the project for bugs, run

```bash
npm run test
```

### Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in the project.

## Local Demo with `vite`

```bash
npm run start
```

This command will initiate a development server and open the `example/index.html` page automatically.
Feel free to browse this page to find examples on how to use the components.
