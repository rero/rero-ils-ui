# Project Context

## Stack

- Angular 22
- Standalone components (no NgModule left)
- Zoneless (`provideZonelessChangeDetection()`) — no Zone.js
- NgRx Signal Store for application state
- Signals preferred over RxJS
- TypeScript 6 with `strict: false` (`strictTemplates` is on); do not enable
  `strict` as a side effect
- Vitest for testing (all projects but `search-bar`, via
  `@angular/build:unit-test`, in jsdom)
- Optimus UI 2 (components and theme), ngx-translate 18, Formly 11
- `@rero/ng-core` 22, with its `@rero/ng-core/editor` secondary entry point
- Node 24 (matches `.github/workflows/`)
- pnpm 12, pinned by the `packageManager` field of `package.json`

## Architecture

Multi-project Angular workspace:

- `projects/shared/` — shared library used by all apps (`@rero/shared`, built
  into `dist/shared`)
- `projects/admin/` — professional interface (back office)
- `projects/public-search/` — public catalog search
- `projects/public-patron-profile/` — patron profile app
- `projects/public-holdings-items/` — holdings/items display app
- `projects/search-bar/` — embeddable search bar

Except `admin`, the apps are embedded in the Jinja templates of the rero-ils
backend (see `.ai/css-strategy.md`).

## Workspace tsconfig path aliases

Cross-project imports must use the aliases defined in the root `tsconfig.json`, never raw `projects/...` paths.

| Alias                  | Target project                     |
| ---------------------- | ---------------------------------- |
| `@rero/shared`         | shared library (`dist/shared`)     |
| `@app/admin/*`         | `projects/admin/src/app/*`         |
| `@app/public-search/*` | `projects/public-search/src/app/*` |

To add an alias for a new project, add it under `compilerOptions.paths` in `tsconfig.json`
(and in `projects/admin/vitest.config.ts` for the tests of admin).

## Architecture principles

- Business logic should be isolated from Angular when possible.
- Prefer pure functions for reusable logic.
- Angular components should remain thin and focused on UI.

## Folder conventions

Each app is organized by feature under `src/app/` (e.g. `acquisition/`,
`circulation/`, `record/` in admin). Components, services, stores and
helpers are colocated with their feature.

## Formly and the editor

Formly and the ng-core editor weigh heavily in a bundle: they bring their
field types and many Optimus UI components.

- `admin` registers Formly in `app.config.ts`.
- `public-holdings-items` registers it in `app.config.ts` too, for the
  request form (pickup location) of the document detail view. The app is a
  web component without routes, so Formly cannot be loaded lazily there.
- `public-patron-profile` registers it only on its form pages, in the lazy
  `patron-profile-editor-routes.ts` of public-search.
- `public-search` and `search-bar` display no form and must not import
  `@rero/ng-core/editor` nor `@ngx-formly/core`.
- A spec that renders a Formly form registers Formly itself, so it does not
  prove the app does: check the app configuration too (see
  `public-holdings-items/src/app/app.config.spec.ts`).

## State management

State management uses **NgRx Signal Store**.

Rules:

- Application state must use NgRx Signal Store.
- Component-local state should use Angular Signals.
- Do not use NgRx reducers/effects/store module.
- Do not introduce BehaviorSubject-based stores.

## Testing philosophy

- Use Vitest for tests — see `.ai/testing-rules.md` for details.
- Use TestBed when Angular integration is required.
