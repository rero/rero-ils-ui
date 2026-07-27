# Prompt Templates

These prompt templates help guide the LLM when performing common tasks in this repository.

---

## Refactor Angular component

Goal: simplify this component.

Constraints:

- Angular 21, standalone components only
- do not introduce NgModules
- replace constructor injection with inject()
- move business logic outside components when possible
- prefer Angular Signals over RxJS for local state
- use new input()/output() API
- keep change detection strategy OnPush

---

## Improve typing

Goal: improve TypeScript typing.

Constraints:

- do not introduce `any`
- prefer explicit types
- keep code compatible with strict TypeScript mode

---

## Write unit test

Goal: write a unit test for the provided code.

Constraints:

- use Vitest (`vi.fn()`, `vi.spyOn()`) — see `.ai/testing-rules.md`
- prefer pure function testing
- avoid TestBed unless Angular integration is required
- keep the test minimal and readable
