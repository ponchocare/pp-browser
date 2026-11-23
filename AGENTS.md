# AGENTS.md

Vanilla web components library (no Lit/framework) published as `@ponchopay/pp-browser`. Defines `<pp-payment>` and `<pp-subscription>`, which render a shadow-DOM `<form>` with hidden inputs that POSTs to PonchoPay.

## Layout
- `src/PpForm.ts`: shared abstract base. Subclasses (`PpPayment`, `PpSubscription`) only declare the endpoint path, button label and field schema (`src/validation.ts`). `token` is added to every component automatically.
- `src/index.ts` registers the custom elements (guarded against double registration). Public subpath exports live in `package.json` `exports` and point at `dist/src/*`.
- `docs/*.md` is the user-facing attribute reference. Update it when you change fields or attributes.
- `example/*.html` are demo pages. They load `dist/src/index.js` relative to `example/`, so they need `tsc --outDir example/dist` first (`npm start` and the e2e server both do this).

## Commands
- `npm run lint` runs ESLint (`@open-wc` config, embedded in `package.json`) and a Prettier check. `npm run format` fixes both.
- `npm run test:unit` runs Vitest with jsdom on `test/*.spec.ts`. For one file, use `npx vitest run test/utils.spec.ts`.
- `npm run test:e2e` runs Playwright with Chromium only. The first time, run `npx playwright install chromium`. For one test, use `npx playwright test e2e/simple-payment.e2e.ts`.
- `npm run build` runs `tsc` to `dist/`, then Rollup bundles a minified IIFE to `build/pp-browser.min.js`. That bundle is the CDN asset.
- Typecheck: `npx tsc --noEmit`. Note that `tsconfig.json` only includes `src/`, so test and e2e files are not typechecked by `tsc`.
- There is no CI in the repo. The husky v4 pre-commit hook runs lint-staged (`eslint --fix` and `prettier --write` on `*.ts`).

## Conventions and gotchas
- Relative imports in `src/` must use `.js` extensions (`./utils.js`), because output is consumed as native ESM. Tests import without extensions.
- Prettier settings: single quotes, `arrowParens: "avoid"`. Prettier 2 and ESLint 8 (legacy config), so don't use flat-config or Prettier 3 syntax.
- E2E files must be named `*.e2e.ts`. That keeps them out of Vitest and is what Playwright matches.
- E2E architecture: `e2e/vite.config.ts` serves `example/` on port 8001. It rewrites every `base="..."` attribute in the HTML to `/`, and a fake middleware echoes POSTs to the PonchoPay endpoints back as JSON. `e2e/support.ts` aborts all non-local requests, opens each example from `example/index.html` by link, clicks submit and compares the fields (order-insensitive). Adding an example page means linking it from `example/index.html` and adding a matching `*.e2e.ts` with the exact expected fields. If an endpoint is new, add it to `ENDPOINTS` in `e2e/vite.config.ts`.
- Locally, Playwright reuses an already-running server on 8001. If you see stale output, stop that server (or rerun `tsc --outDir example/dist`).
- The components need `HTMLElement` at import time, so they don't work under SSR (see the README).
