# Project Context

## Stack

- Angular 21
- TypeScript strict mode
- Zoneless (`provideZonelessChangeDetection()`) — no Zone.js
- NgRx Signal Store for application state
- Signals preferred over RxJS for new code
- Vitest for testing (all projects, via `@angular/build:unit-test`)
- pnpm for package management
- Node 20+

## Architecture

Multi-project Angular workspace:

- `projects/shared/` — shared library used by all apps
- `projects/admin/` — back-office application
- `projects/public-search/` — public catalog search
- `projects/public-patron-profile/` — patron profile app
- `projects/public-holdings-items/` — holdings/items display app
- `projects/search-bar/` — embeddable search bar

## Workspace tsconfig path aliases

Cross-project imports must use the aliases defined in the root `tsconfig.json`, never raw `projects/...` paths.

| Alias | Target project |
|---|---|
| `@rero/shared` | shared library (`dist/shared`) |
| `@app/admin/*` | `projects/admin/src/app/*` |
| `@app/public-search/*` | `projects/public-search/src/app/*` |

To add an alias for a new project, add it under `compilerOptions.paths` in `tsconfig.json`.

## Architecture principles

- Business logic should be isolated from Angular when possible.
- Prefer pure functions for reusable logic.
- Angular components should remain thin and focused on UI.

## Folder conventions

src/app/
components/
services/
stores/
utils/

- components: UI components
- services: Angular services and API access
- stores: signal-based state management
- utils: framework-independent helpers

## Git commit conventions

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- Format: `type(scope): description`
- **Title**: 50 characters maximum
- **Body lines**: 72 characters maximum
- **Body bullet points**: use `*` (asterisk), not `-` (dash)
- Common types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`

## Testing philosophy

- Use Vitest for tests — see `.ai/testing-rules.md` for details.
- Use TestBed when Angular integration is required.

## State management

State management uses **NgRx Signal Store** for new stores.

Rules:

- New application state must use NgRx Signal Store.
- Component-local state should use Angular Signals.
- Do not introduce new BehaviorSubject-based stores.
- Existing NgRx reducers/effects can remain until refactored.
