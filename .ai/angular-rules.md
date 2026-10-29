# Angular Rules

Framework version: Angular 22

## TypeScript style rules

- Always use dot notation (`obj.prop`) over bracket notation (`obj['prop']`).
- Avoid `Record<string, any>` — use a proper typed interface or type alias instead.
- Prefer object destructuring when accessing and using a property, instead of repeating `obj.prop`.

```typescript
// BAD
function transform(transaction: TransactionRecord): TransactionStatus {
  if (isScanItemMetadata(transaction.metadata)) {
    /* ... */
  }
}

// GOOD
function transform(transaction: TransactionRecord): TransactionStatus {
  const { metadata } = transaction;
  if (isScanItemMetadata(metadata)) {
    /* ... */
  }
}
```

## Core rules

- Components, directives and pipes are standalone by default since Angular 19 — omit `standalone: true`.
- Do not introduce NgModules.
- Prefer Angular Signals for local state.
- Avoid RxJS when Signals are sufficient.
- Use explicit TypeScript types.
- Use `inject()` instead of constructor-based dependency injection.

## Component design

- Components must remain small and focused on UI.
- Business logic should not live inside components.
- Move reusable logic to services or pure functions.

## Change detection

- OnPush is the default change detection strategy since Angular 22. Do not
  set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly on
  `@Component`.
- Do not use `$safeNavigationMigration()` in templates: `?.` returns
  `undefined` since Angular 22, so type the inputs to accept it.

## Dependency injection

- Use `inject()` function — avoid constructor injection.
- Avoid unnecessary services.
- Prefer simple utility functions when Angular DI is not needed.
- Use `@Service()` instead of `@Injectable({ providedIn: 'root' })` for new
  root-provided services (available since Angular 22), and
  `@Service({ autoProvided: false })` instead of a bare `@Injectable()` for
  services registered in a `providers` array.

## Template syntax

- Use the control flow syntax: `@if`, `@for`, `@switch`.
- Do not introduce `*ngIf`, `*ngFor`, `*ngSwitch` directives.
- Translate with the pipe, `{{ 'Key' | translate }}` or
  `[label]="'Key' | translate"`. Never use the element content as key
  (`<span translate>Key</span>`) nor a bare `translate` attribute:
  ngx-translate 18 warns for each element and removes it in version 19.
- Mark an `ngModel` that only drives a control of the component itself (e.g.
  inside a Formly field type) with `[ngModelOptions]="{ standalone: true }"`:
  Angular 22 warns when an `ngModel` sits in a parent form it cannot register
  with.

## Inputs and outputs

- Use the `input()` and `output()` APIs, not the `@Input()` and `@Output()`
  decorators.
- Use `model()` for two-way binding.

## State management

State management rules:

1. Local component state → Angular Signals
2. Application state → NgRx Signal Store

Use:

- @ngrx/signals
- signalStore
- withState
- withMethods
- withComputed
- signalStoreFeature

Do not introduce:

- NgRx Store reducers/effects
- BehaviorSubject stores
- Custom RxJS state services

## Import paths

Never use raw workspace-relative paths (`projects/...`) in import statements.
Always use the tsconfig path aliases defined in `tsconfig.json`.

Available aliases:

| Alias                  | Resolves to                          |
| ---------------------- | ------------------------------------ |
| `@rero/shared`         | `dist/shared` (built shared library) |
| `@app/admin/*`         | `projects/admin/src/app/*`           |
| `@app/public-search/*` | `projects/public-search/src/app/*`   |

```typescript
// BAD — fails when another project compiles this file
import { MyService } from '@app/admin/service/my.service';
import { MyComponent } from '@app/public-search/my/my.component';
// GOOD
import { EsRecord } from '@rero/shared';
import { MyService } from 'projects/admin/src/app/service/my.service';
import { MyComponent } from 'projects/public-search/src/app/my/my.component';
import { EsRecord } from 'projects/shared/src/public-api';
```

Raw `projects/` paths fail at build time when one app bundles code from another project
(e.g. `public-holdings-items` transitively compiling `public-search` sources).

When adding a new cross-project alias, declare it in the root `tsconfig.json` under `compilerOptions.paths`.

## Code quality

- Avoid the use of `any`.
- Prefer explicit types.
- Keep functions small and testable.

## Import order

Prettier sorts the imports (`@ianvs/prettier-plugin-sort-imports`), on save in
VS Code or with `pnpm run format`: third-party imports first, then a blank
line, then the relative imports. Do not sort them by hand.

## Code comments

All code comments must be written in English.
