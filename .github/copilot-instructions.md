# Copilot Repository Instructions

This repository uses Angular 22: standalone components, zoneless change
detection, NgRx Signal Store, Vitest and pnpm.

Copilot must follow the rules defined in:

- .ai/project-context.md
- .ai/angular-rules.md
- .ai/angular-patterns.md
- .ai/css-strategy.md
- .ai/testing-rules.md
- .ai/dev-commands.md

## Important constraints for new code

- Components are standalone and OnPush by default: do not set these
  properties, and do not introduce NgModules
- Use `inject()`, `input()`, `output()` and signals
- The app is zoneless: do not rely on Zone.js, `fakeAsync` or `tick`
- Avoid `any`
- Tests use Vitest (`vi.fn()`, `vi.spyOn()`), never Karma nor Jasmine

## Development commands

When suggesting commands, use the commands defined in `.ai/dev-commands.md`
(pnpm).
