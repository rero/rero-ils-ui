# Development Commands

These are the official commands for working with this repository.
LLM tools should prefer these commands instead of inventing new ones.

## Install dependencies

npm install

## Development servers

Start the admin app:

npm run start-admin-proxy

Start the public search app:

npm run start-public-search-proxy

Start the patron profile app:

npm run start-public-patron-profile-proxy

Start the holdings/items app:

npm run start-public-holdings-items-proxy

## Build

Build the shared library first, then apps:

npm run build

Build only the shared library:

npm run build-shared

Build a specific app:

ng build admin --configuration production
ng build public-search --configuration production
ng build public-patron-profile --configuration production
ng build public-holdings-items --configuration production
ng build search-bar --configuration production

## Tests

Run all tests:

npm test

Run tests for a specific project:

ng test shared
ng test admin
ng test public-search

## Lint

Run ESLint:

npm run lint

## Translations

Extract messages (all projects):

npm run extract_messages

Update translation catalogs (all projects):

npm run update_catalog

Extract messages for a specific project:

npm run shared_extract_messages
npm run admin_extract_messages
npm run public-search_extract_messages
