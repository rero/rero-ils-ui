# Development Commands

These are the official commands for working with this repository.
LLM tools should prefer these commands instead of inventing new ones.

## Install dependencies

pnpm install

## Development servers

Start the admin app:

pnpm run start-admin-proxy

Start the public search app:

pnpm run start-public-search-proxy

Start the patron profile app:

pnpm run start-public-patron-profile-proxy

Start the holdings/items app:

pnpm run start-public-holdings-items-proxy

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

Run tests for a specific project:

pnpm exec ng test shared
pnpm exec ng test admin
pnpm exec ng test public-search

## Lint

Run ESLint:

pnpm run lint

## Translations

Extract messages (all projects):

pnpm run extract_messages

Update translation catalogs (all projects):

pnpm run update_catalog

Extract messages for a specific project:

pnpm run shared_extract_messages
pnpm run admin_extract_messages
pnpm run public-search_extract_messages
