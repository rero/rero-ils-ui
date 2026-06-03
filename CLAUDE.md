# Claude Code Instructions

This repository uses Angular 21 and is in active migration from Angular 19 patterns.

Follow the rules defined in:

- .ai/project-context.md
- .ai/angular-rules.md
- .ai/angular-patterns.md
- .ai/testing-rules.md
- .ai/dev-commands.md

## Migration status

This project is migrating incrementally — do not assume it is fully on Angular 21 patterns yet:

- NgModules are still present — do not remove them unless explicitly asked
- Zone.js is still active — do not apply zoneless patterns
- `shared` uses Vitest (`@angular/build:unit-test`) — use Vitest API (`vi.fn()`, `vi.spyOn()`) for new specs in shared
- Other projects (`admin`, `public-search`, etc.) still use Karma + Jasmine — do not introduce Vitest there yet

## Important constraints for new code

- New components must be standalone (`standalone: true`)
- Use `inject()` instead of constructor injection
- Use `@if` / `@for` in templates instead of `*ngIf` / `*ngFor`
- Use `input()` / `output()` APIs for new components
- Prefer Angular Signals over RxJS for local state
- Use `OnPush` change detection
- Avoid `any` — prefer explicit TypeScript types

## Testing

- `shared`: Vitest via `@angular/build:unit-test` — run with `ng test shared`
- Other projects: Karma + Jasmine (not yet migrated)

## Development commands

See `.ai/dev-commands.md` for all available commands.
