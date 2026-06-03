# Testing Rules

Testing framework: Vitest

## Allowed testing APIs

Use the Vitest testing API:

- describe()
- it()
- expect()
- beforeEach()
- afterEach()

Spies and mocks:

- vi.fn()
- vi.spyOn()

## Do not use

The following tools must not be introduced:

- Karma
- Jasmine
- jasmine.createSpy
- jasmine.clock

## Angular testing

Prefer tests that do not require Angular.

Priority order:

1. Pure function tests
2. Service tests without TestBed
3. Angular integration tests using TestBed

Use TestBed only when Angular features are required:

- dependency injection
- component rendering
- directives/pipes

## Component tests

When testing components:

- import standalone components directly
- avoid large testing modules
- mock dependencies with simple objects when possible

Example pattern:

describe('MyComponent', () => {

it('should compute value', () => {
const result = computeSomething(2)
expect(result).toBe(4)
})

})

## Test performance

Tests must:

- run with Vitest
- support watch mode
- remain fast and isolated

## Zoneless testing

The application runs without Zone.js. `zone-testing.js` is **not** loaded in the Vitest environment.

Using `fakeAsync` or `tick` from `@angular/core/testing` will throw at runtime:

```
Error: zone-testing.js is needed for the fakeAsync() test helper but could not be found.
```

Do not use:

- `fakeAsync` / `tick` / `flush` from `@angular/core/testing`
- Any Zone.js test helper

Prefer:

- Synchronous assertions (synchronous `of(...)` observables complete synchronously — no tick needed)
- `async/await` with `await vi.advanceTimersByTimeAsync(0)` for effects (see NgRx section below)

## Migration patterns (Jasmine → Vitest)

| Before | After |
|---|---|
| `waitForAsync(() => {` | `async () => {` |
| `fakeAsync(() => {` | `async () => {` |
| `tick(N)` | `await new Promise(r => setTimeout(r, N))` |
| `tick()` | `await Promise.resolve()` |
| `.compileComponents()` | remove (no-op in Angular 14+) |
| `fail('msg')` | `throw new Error('msg')` |
| `jasmine.createSpy` | `vi.fn()` |
| `spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` |

- Spy types: use `any` instead of `MockedObject<T>` for partial mocks
- Remove `.mockName('...')` from `vi.fn()` chains (causes TS errors)

## setTimeout in tests

`setTimeout(() => { expect(...) }, N)` **without await** leaks into subsequent tests.

Always use:

```ts
await new Promise(resolve => setTimeout(resolve, N));
expect(...);
```

## Router navigation in tests

`router.navigate()` returns a Promise — always `await` it for title/state to update.
`await Promise.resolve()` is NOT sufficient.

## NgRx Signal Store tests

Every `signalStore()` and `signalStoreFeature()` file must have a co-located `.spec.ts`.

Coverage target: **~100%** of public state, methods, and computed signals.

### What to cover

- **Initial state**: assert every state slice has the expected default value
- **Methods**: one test per code path (success, error, edge cases)
- **Computed signals**: test each derived value reflects state changes
- **Helper functions** (e.g. `setPending`, `setError`): test as pure functions without TestBed

### Test store pattern for features

To test a `signalStoreFeature`, wrap it in a local `signalStore`:

```ts
const TestStore = signalStore(
  withMyFeature(),
  withMethods((store) => ({
    applyX: () => patchState(store, setX()),
  }))
);
```

### Mocking dependencies

- Always add the store class itself to `providers` in `TestBed.configureTestingModule` — this is required whether or not the store is `providedIn: 'root'`, because component-scoped stores are never auto-provided:

```ts
TestBed.configureTestingModule({
  providers: [
    MyStore,                                      // ← required
    { provide: MyService, useValue: mockService },
  ],
});
```

- Mock injected services with `vi.fn()` objects
- For `rxMethod` / async methods, use `vi.useFakeTimers()` + `await vi.advanceTimersByTimeAsync(0)`

### Async rxMethod tests

```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('...', async () => {
  store.loadSomething(args);
  await vi.advanceTimersByTimeAsync(0);
  expect(store.data()).toHaveLength(n);
});
```

## Mock teardown

Use `vi.resetAllMocks()` (not `vi.clearAllMocks()`) in `afterEach` to reset mock implementations between tests:

- `vi.clearAllMocks()` only resets call history — `mockReturnValue` persists into the next test
- `vi.resetAllMocks()` also resets implementations — safe default for `afterEach`

Re-apply needed mock implementations in `beforeEach` after resetting.
