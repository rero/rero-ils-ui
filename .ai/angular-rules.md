# Angular Rules

Framework version: Angular 21

## Migration rules

This project is migrating incrementally to Angular 21 patterns:

- New components are standalone by default (Angular 19+) — do not add `standalone: true` explicitly.
- Existing NgModules are not removed unless explicitly refactored.
- New code must not introduce new NgModules.

## Core rules

- Components, directives and pipes are standalone by default since Angular 19 — omit `standalone: true`.
- Prefer Angular Signals for local state in new components.
- Avoid RxJS when Signals are sufficient for new code.
- Use strict TypeScript typing.
- Use `inject()` instead of constructor-based dependency injection.

## Component design

- Components must remain small and focused on UI.
- Business logic should not live inside components.
- Move reusable logic to services or pure functions.

## Change detection

- Use OnPush change detection by default.

Example:

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

## Dependency injection

- Use `inject()` function — avoid constructor injection for new code.
- Avoid unnecessary services.
- Prefer simple utility functions when Angular DI is not needed.

## Template syntax

- Use new control flow syntax: `@if`, `@for`, `@switch`.
- Do not introduce new `*ngIf`, `*ngFor`, `*ngSwitch` directives.

## Inputs and outputs

- Use the new `input()` and `output()` APIs for new components.
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

- New NgRx Store reducers/effects
- New BehaviorSubject stores
- New custom RxJS state services

## Import paths

Never use raw workspace-relative paths (`projects/...`) in import statements.
Always use the tsconfig path aliases defined in `tsconfig.json`.

Available aliases:

| Alias | Resolves to |
|---|---|
| `@rero/shared` | `dist/shared` (built shared library) |
| `@app/admin/*` | `projects/admin/src/app/*` |
| `@app/public-search/*` | `projects/public-search/src/app/*` |

```typescript
// BAD — causes TS2307 and bundler resolution errors
import { EsRecord } from 'projects/shared/src/public-api';
import { MyService } from 'projects/admin/src/app/service/my.service';
import { MyComponent } from 'projects/public-search/src/app/my/my.component';

// GOOD
import { EsRecord } from '@rero/shared';
import { MyService } from '@app/admin/service/my.service';
import { MyComponent } from '@app/public-search/my/my.component';
```

Raw `projects/` paths fail at build time when one app bundles code from another project
(e.g. `public-holdings-items` transitively compiling `public-search` sources).

When adding a new cross-project alias, declare it in the root `tsconfig.json` under `compilerOptions.paths`.

## Code quality

- Avoid the use of `any`.
- Prefer explicit types.
- Keep functions small and testable.

## Import order

Always keep imports sorted alphabetically by module path when adding new imports. No grouping required — sort all imports as a single flat list.

Example:

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Button } from 'primeng/button';
import { take } from 'rxjs/operators';
import { LibraryFormService } from './library-form.service';
import { LibraryStore } from './library.store';
```
