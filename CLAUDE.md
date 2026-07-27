<!--
SPDX-FileCopyrightText: Fondation RERO+
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Claude Code Instructions

This repository uses Angular 21, zoneless change detection, and pnpm.

Follow the rules defined in:

- .ai/project-context.md
- .ai/angular-rules.md
- .ai/angular-patterns.md
- .ai/testing-rules.md
- .ai/dev-commands.md

## Important constraints for new code

- Components are standalone by default (Angular 19+) — do not add `standalone: true` explicitly
- Do not introduce NgModules
- Use `inject()` instead of constructor injection
- Use `@if` / `@for` in templates instead of `*ngIf` / `*ngFor`
- Use `input()` / `output()` APIs for new components
- Prefer Angular Signals over RxJS for local state
- Use `OnPush` change detection
- The app runs zoneless (`provideZonelessChangeDetection()`) — do not rely on Zone.js or `fakeAsync`/`tick`
- Avoid `any` — prefer explicit TypeScript types

## Testing

All projects use Vitest (`@angular/build:unit-test`) — run with `pnpm exec ng test <project>`.
Use the Vitest API (`vi.fn()`, `vi.spyOn()`) — see `.ai/testing-rules.md` for details.

## Development commands

See `.ai/dev-commands.md` for all available commands (uses pnpm).
