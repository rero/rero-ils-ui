# Prompt Templates

These prompt templates help guide the LLM when performing common tasks in this repository.

---

## Refactor Angular component

Goal: simplify this component.

Constraints:

- Angular 22, standalone and OnPush by default (no explicit property)
- do not introduce NgModules
- replace constructor injection with inject()
- move business logic outside components when possible
- prefer Angular Signals over RxJS for local state
- use the input()/output() APIs
- do not change the behaviour

---

## Improve typing

Goal: improve TypeScript typing.

Constraints:

- do not introduce `any`
- prefer explicit types

---

## Write unit test

Goal: write a unit test for the provided code.

Constraints:

- use Vitest (`vi.fn()`, `vi.spyOn()`) — see `.ai/testing-rules.md`
- prefer pure function testing
- avoid TestBed unless Angular integration is required
- keep the test minimal and readable
