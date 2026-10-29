# Development Commands

These are the official commands for working with this repository.
LLM tools should prefer these commands instead of inventing new ones.

## Install dependencies

pnpm install

## Development servers

Each app is served over HTTPS, with its API calls proxied to the rero-ils
backend on `https://localhost:5000`. Build the shared library first
(`pnpm exec ng build shared --watch` in a separate terminal).

| Command                                      | App                   | URL                      |
| -------------------------------------------- | --------------------- | ------------------------ |
| `pnpm run start-admin-proxy`                 | admin                 | `https://localhost:4200` |
| `pnpm run start-public-holdings-items-proxy` | public-holdings-items | `https://localhost:4201` |
| `pnpm run start-public-search-proxy`         | public-search         | `https://localhost:4202` |
| `pnpm run start-search-bar-proxy`            | search-bar            | `https://localhost:4203` |
| `pnpm run start-public-patron-profile-proxy` | public-patron-profile | `https://localhost:4204` |

## Build

Build the shared library first, then apps:

pnpm run build

Build only the shared library:

pnpm run build-shared

Build a specific app:

pnpm exec ng build admin --configuration production
pnpm exec ng build public-search --configuration production
pnpm exec ng build public-patron-profile --configuration production
pnpm exec ng build public-holdings-items --configuration production
pnpm exec ng build search-bar --configuration production

## Tests

Run all tests:

pnpm test

Run tests for a specific project (`search-bar` has none):

pnpm exec ng test shared
pnpm exec ng test admin
pnpm exec ng test public-search
pnpm exec ng test public-patron-profile
pnpm exec ng test public-holdings-items

## Lint

Run ESLint:

pnpm run lint

## Format

Run Prettier (imports sorted by `@ianvs/prettier-plugin-sort-imports`):

pnpm run format

Check the formatting, as the CI does:

pnpm run format:check

## Full quality check

Run the formatting check, the lint, the builds and the tests, as the CI does:

./run-tests.sh

## Translations

Extract messages (all projects):

pnpm run extract_messages

Update translation catalogs (all projects):

pnpm run update_catalog

Extract messages or update the catalogs of a specific project:

pnpm run shared_extract_messages
pnpm run admin_extract_messages
pnpm run public-search_extract_messages
pnpm run shared_update_catalog
pnpm run admin_update_catalog
pnpm run public-search_update_catalog

## Pack

Build all the apps in production mode and pack them as
`rero-rero-ils-ui-X.X.X.tgz` at the repository root, to install them in the
rero-ils backend (`./scripts/bootstrap -t <tgz>` in the `rero-ils`
repository):

pnpm run pack

## Unpublished ng-core

To use a local ng-core build, pack it (`pnpm run pack` in `../ng-core`) and
add an override to `pnpm-workspace.yaml`, then `pnpm install`:

```yaml
overrides:
  '@rero/ng-core': 'file:../ng-core/rero-ng-core-X.X.X.tgz'
```

Never commit this override nor the lockfile it changes: the CI builds ng-core
from the ref in `.ng-core-ref` instead.
