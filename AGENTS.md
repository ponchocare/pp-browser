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
- CI is `.github/workflows/ci.yml`. It runs on PRs, on manual dispatch, and when `deploy.yml` calls it. It doesn't run on pushes to `main`. It runs `npm ci`, lint, unit tests, e2e tests and build, in that order. There are no git hooks, so run `npm run lint` (or `npm run format`) before pushing.
- Releases are `.github/workflows/deploy.yml`, which you start manually on `main`. It calls `ci.yml` (through `workflow_call`), then works out the version, builds, and creates a GitHub release, plus a tag with the same name as the version, on the deployed commit, with auto-generated notes. It then opens a PR in `ponchocare/ponchopay` (secret `PONCHOPAY_TOKEN`) that adds `build/pp-browser.min.js` as `src/be/integration/assets/pp-browser.<version>.min.js` and updates `src/routes/(public)/+page.svelte` to point at it. `npm publish` is the last step, because an npm version can never be republished. It uses npm trusted publishing (OIDC, `id-token: write` on the `release` job), so there's no npm token secret. If only the publish fails, the tag, release and ponchopay PR already exist. Either publish that tag by hand, or delete the release and tag (`gh release delete <version> --cleanup-tag`) and close the PR, so the next deploy reuses the number. Never delete the tag of a version that is on npm: the next deploy would pick that number again, and the publish would fail.
- Versioning: git tags are the source of truth. The next version is the newest plain `X.Y.Z` tag with its patch number increased by 1. Nothing is committed back to `main` (a ruleset requires PRs), so the real version is only set in `package.json` on the runner. In git, `package.json` and `package-lock.json` keep the placeholder `0.0.0-development`. Don't change it or bump it by hand. To skip versions, push a bare `X.Y.Z` tag on `main`, or start the deploy with the `version` input (`gh workflow run deploy.yml -f version=1.4.0`). That input must be higher than the newest tag.

## Conventions and gotchas
- Relative imports in `src/` must use `.js` extensions (`./utils.js`), because output is consumed as native ESM. Tests import without extensions.
- Prettier settings: single quotes, `arrowParens: "avoid"`. Prettier 2 and ESLint 8 (legacy config), so don't use flat-config or Prettier 3 syntax.
- E2E files must be named `*.e2e.ts`. That keeps them out of Vitest and is what Playwright matches.
- E2E architecture: `e2e/vite.config.ts` serves `example/` on port 8001. It rewrites every `base="..."` attribute in the HTML to `/`, and a fake middleware echoes POSTs to the PonchoPay endpoints back as JSON. `e2e/support.ts` aborts all non-local requests, opens each example from `example/index.html` by link, clicks submit and compares the fields (order-insensitive). Adding an example page means linking it from `example/index.html` and adding a matching `*.e2e.ts` with the exact expected fields. If an endpoint is new, add it to `ENDPOINTS` in `e2e/vite.config.ts`.
- Locally, Playwright reuses an already-running server on 8001. If you see stale output, stop that server (or rerun `tsc --outDir example/dist`).
- The components need `HTMLElement` at import time, so they don't work under SSR (see the README).
