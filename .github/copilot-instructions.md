# Copilot Repository Instructions

This repository uses Angular 21 and is in active migration from Angular 19 patterns.

Copilot must follow the rules defined in:

- .ai/project-context.md
- .ai/angular-rules.md
- .ai/testing-rules.md
- .ai/dev-commands.md

## Migration status

This project is migrating incrementally — do not assume it is fully on Angular 21 patterns yet:

- NgModules are still present — do not remove them unless explicitly asked
- Zone.js is still active — do not apply zoneless patterns
- Karma + Jasmine are still used — do not introduce Vitest

## Important constraints for new code

- New components must be standalone
- Do not introduce new NgModules
- Prefer Angular Signals for local state
- Avoid RxJS when Signals are sufficient
- Use strict TypeScript types
- Avoid `any`

## Testing

Use Karma + Jasmine. Do not introduce Vitest.

## Development commands

When suggesting commands, use the commands defined in:

.ai/dev-commands.md

## Additional architecture patterns

.ai/angular-patterns.md
