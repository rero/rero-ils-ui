# Prompt Templates

These prompt templates help guide the LLM when performing common tasks in this repository.

---

## Migrate Angular component to standalone

Goal: migrate this component to standalone.

Constraints:

- Angular 21
- standalone: true
- do not introduce NgModules
- replace constructor injection with inject()
- replace *ngIf/*ngFor with @if/@for
- keep change detection strategy OnPush
- do not change business logic

---

## Refactor Angular component

Goal: simplify this component.

Constraints:

- Angular 21
- standalone components only
- do not introduce NgModules
- replace constructor injection with inject()
- move business logic outside components when possible
- prefer Angular Signals over RxJS for local state
- use new input()/output() API
- keep change detection strategy OnPush

---

## Fix Angular test

Goal: update this test to match the current component.

Constraints:

- keep Karma + Jasmine
- do not introduce Vitest
- keep TestBed when Angular integration is required
- use jasmine.createSpy() for mocks

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

- use Karma + Jasmine
- prefer pure function testing
- avoid TestBed unless Angular integration is required
- keep the test minimal and readable
