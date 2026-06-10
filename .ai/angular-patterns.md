# Angular Patterns

## Standalone component pattern

Components, directives and pipes are standalone by default since Angular 19. Do not add `standalone: true` explicitly — it is redundant.

Example:

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslatePipe]
})
export class MyComponent {
  private myService = inject(MyService);
}

## Dependency injection

Use `inject()` instead of constructor parameters.

Example:

export class MyComponent {
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
}

## Inputs and outputs

Use the new signal-based input/output API for new components.

Example:

export class MyComponent {
  item = input.required<Item>();
  limit = input<number>(10);
  selected = output<Item>();
}

## Signals for local state

Use signals for component-local reactive state.

Example:

export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update(v => v + 1);
  }
}

## RxJS interop

Use toSignal() and takeUntilDestroyed() for RxJS interop.

Example:

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  data = toSignal(this.service.getData());

  ngOnInit() {
    this.service.stream$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(...);
  }
}

## NgRx Signal Store

Application state should be implemented using NgRx Signal Store.

Example pattern:

import { signalStore, withState, withMethods } from '@ngrx/signals';

export const CounterStore = signalStore(
  { providedIn: 'root' },

  withState({
    count: 0
  }),

  withMethods((store) => ({
    increment() {
      store.count.update(v => v + 1)
    }
  }))
)

Usage in component:

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  store = inject(CounterStore);
}

## Defensive cloning of input signals

When a component maintains a writable local copy of an `input()` signal (via `linkedSignal`),
use `cloneDeep` from `lodash-es` to avoid mutating the parent object through shared references.

```typescript
import { cloneDeep } from 'lodash-es';

export class MyComponent {
  item = input<Item | undefined>();

  // TODO: replace cloneDeep with structuredClone when lodash-es is removed
  editableItem = linkedSignal(() => {
    const item = this.item();
    return item ? cloneDeep(item) : item;
  });
}
```

> **Refactoring note**: once `lodash-es` is no longer a project dependency,
> replace `cloneDeep` with the native `structuredClone`.

## Template control flow

Use new control flow syntax — not structural directives.

Example:

@if (item()) {
  <div>{{ item().title }}</div>
} @else {
  <span>No item</span>
}

@for (item of items(); track item.id) {
  <li>{{ item.label }}</li>
}

## Double-click guard on submit/save buttons

Three patterns depending on the context.

### Pattern A — Mutating HTTP calls (POST/PUT/PATCH/DELETE)

`HttpPendingService` (ng-core) exposes `isPending()`: a counter incremented/decremented automatically by `httpPendingInterceptor` for every mutating request.

**Registration** (once in `app.config.ts`):
```typescript
import { httpPendingInterceptor } from '@rero/ng-core';
provideHttpClient(withInterceptors([httpPendingInterceptor]), withInterceptorsFromDi())
```

**In the component**:
```typescript
readonly isSaving = signal(false);
readonly httpPending = inject(HttpPendingService);

submit(): void {
  if (this.isSaving()) { return; }
  this.isSaving.set(true);
  // ...
  this.recordService.update(...)
    .pipe(finalize(() => this.isSaving.set(false)))
    .subscribe({ ... });
}
```

**In the template**:
```html
<p-button type="submit" [disabled]="form.invalid || isSaving() || httpPending.isPending()" />
```

> `isSaving` is the primary guard: Angular's `HttpClient` schedules request dispatch asynchronously (via scheduler), so `httpPendingInterceptor` has not yet incremented its counter when a rapid second click fires in the same JS tick. The local signal is set synchronously at the top of `submit()`, immediately blocking any second call. `httpPending.isPending()` serves as a secondary guard against concurrent mutations from other sources.

### Pattern B — Synchronous dialog close (no HTTP)

These components emit an `@Output()` or close a `DynamicDialog` directly — no HTTP request involved. Use a one-shot `isSending` signal that is never reset (the dialog closes before it would matter).

```typescript
readonly isSending = signal(false);

onSubmit(): void {
  if (this.isSending()) { return; }
  this.isSending.set(true);
  this.dialogRef.close(this.form.value);
}
```

```html
<p-button [disabled]="form.invalid || isSending()" (onClick)="onSubmit()" />
```

### Pattern C — Scan/search input guard

For components that process barcode scans or async searches, prevent a second scan from triggering while the first is still being processed.

**With a local `searchInputDisabled` signal** (e.g. `loan.component`):
```typescript
searchValueUpdated(barcode: string): void {
  if (!barcode || this.searchInputDisabled()) { return null; }
  this.searchInputDisabled.set(true);
  // ... async processing, reset with _resetSearchInput()
}
```

**With `HttpPendingService`** (e.g. `user-id-editor`):
```typescript
searchValueUpdated(query: string | null): void {
  if (this.httpPending.isPending()) { return; }
  // ... GET request
}
```

```html
<ng-core-search-input [disabled]="httpPending.isPending()" ... />
```
