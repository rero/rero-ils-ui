# Project Context

## Stack

- Angular 21
- TypeScript strict mode
- Zone.js (zoneless migration planned but not yet done)
- NgRx Signal Store for application state
- Signals preferred over RxJS for new code
- Karma + Jasmine for testing (Vitest migration planned)
- Node 20+

## Migration status

This project is in active migration from Angular 19 to Angular 21 patterns:

- NgModules still present — migration to standalone components in progress
- Zone.js still active — zoneless migration not yet started
- Karma/Jasmine still used — Vitest migration planned for a later phase
- New code should follow Angular 21 patterns (standalone, signals, inject())

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

## Testing philosophy

- Use Karma + Jasmine for tests (current standard).
- Use TestBed when Angular integration is required.
- Vitest migration will happen in a later phase — do not introduce it now.

## State management

State management uses **NgRx Signal Store** for new stores.

Rules:

- New application state must use NgRx Signal Store.
- Component-local state should use Angular Signals.
- Do not introduce new BehaviorSubject-based stores.
- Existing NgRx reducers/effects can remain until refactored.
