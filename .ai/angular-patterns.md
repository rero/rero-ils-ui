# Angular Patterns

## Component

Components, directives and pipes are standalone, and components OnPush, by
default: do not set `standalone` nor `changeDetection`.

```typescript
@Component({
  selector: 'admin-my-component',
  imports: [TranslatePipe],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  private readonly router = inject(Router);

  readonly item = input.required<Item>();
  readonly limit = input<number>(10);
  readonly selected = output<Item>();

  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);

  increment(): void {
    this.count.update((value) => value + 1);
  }
}
```

## RxJS interop

Use `toSignal()` and `takeUntilDestroyed()` for RxJS interop.

```typescript
export class MyComponent {
  private readonly service = inject(MyService);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = toSignal(this.service.getData());

  constructor() {
    this.service.stream$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
```

## NgRx Signal Store

Application state should be implemented using NgRx Signal Store. The state
signals are read-only: update them with `patchState()`.

```typescript
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withMethods((store) => ({
    increment(): void {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
  })),
);
```

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

Use the control flow syntax — not structural directives.

```html
@if (item()) {
<div>{{ item().title }}</div>
} @else {
<span>No item</span>
} @for (item of items(); track item.id) {
<li>{{ item.label }}</li>
}
```

## Double-click guard on submit/save buttons

Three patterns depending on the context.

### Pattern A — Mutating HTTP calls (POST/PUT/PATCH/DELETE)

`HttpPendingService` (ng-core) exposes `isPending()`: a counter incremented/decremented automatically by `httpPendingInterceptor` for every mutating request.

**Registration** (once in `app.config.ts`):

```typescript
import { httpPendingInterceptor } from '@rero/ng-core';

provideHttpClient(withInterceptors([httpPendingInterceptor]), withInterceptorsFromDi());
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

These components emit an `output()` or close a `DynamicDialog` directly — no HTTP request involved. Use a one-shot `isSending` signal that is never reset (the dialog closes before it would matter).

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
