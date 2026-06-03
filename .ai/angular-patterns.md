# Angular Patterns

## Standalone component pattern

New components must be standalone with OnPush change detection.

Example:

@Component({
  standalone: true,
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
  standalone: true,
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
