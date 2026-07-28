# [RERO ILS UI][1]

[![Github actions
status](https://github.com/rero/rero-ils-ui/actions/workflows/main.yml/badge.svg)](https://github.com/rero/rero-ils-ui/actions/workflows/main.yml)
[![image](https://img.shields.io/coveralls/rero/rero-ils-ui.svg)](https://coveralls.io/r/rero/rero-ils-ui)
[![Release
Number](https://img.shields.io/github/tag/rero/rero-ils-ui.svg)](https://github.com/rero/rero-ils-ui/releases/latest)
[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0.html)
[![Gitter
room](https://img.shields.io/gitter/room/rero/reroils.svg)](https://app.gitter.im/#/room/#rero_reroils:gitter.im)

Public search: \
[![Translation status](https://hosted.weblate.org/widgets/rero_plus/-/rero-ils-public-search/svg-badge.svg)](https://hosted.weblate.org/engage/rero_plus/?utm_source=widget)

Professional interface (admin): \
[![Translation status](https://hosted.weblate.org/widgets/rero_plus/-/rero-ils-admin/svg-badge.svg)](https://hosted.weblate.org/engage/rero_plus/?utm_source=widget)

Shared: \
[![Translation status](https://hosted.weblate.org/widgets/rero_plus/-/rero-ils-shared/svg-badge.svg)](https://hosted.weblate.org/engage/rero_plus/?utm_source=widget)

*Copyright (C) 2020-2026 RERO*
*Copyright (C) 2020-2024 UCLouvain*

[1]: https://github.com/rero/rero-ils-ui

## Introduction

**Rero-ils-ui** is a part of [RERO ILS](https://www.rero.ch/en/products/ils).

It's a Web UI (User Interface) of [rero-ils](https://ils.test.rero.ch/) for libraries management.

This interface aims to be simple and clear. It's made with [Angular](https://angular.dev) 21.

## Requirements

  * [Node.js 24](https://nodejs.org/)
  * [Angular 21](https://angular.dev)
  * [pnpm 11](https://pnpm.io/) (managed via [Corepack](https://nodejs.org/api/corepack.html), see `packageManager` in `package.json`)
  * [rero-ils](https://github.com/rero/rero-ils/blob/master/INSTALL.rst) installed and [running](https://github.com/rero/rero-ils/blob/master/INSTALL.rst#running)

Optionally, for development purposes, you can install an IDE such as Visual Studio Code, WebStorm, etc.

## Quick start

After [having launched RERO-ILS server](https://github.com/rero/rero-ils/blob/master/INSTALL.rst#running):

```bash
# Install Node.js 24 (nvm is recommended: https://github.com/nvm-sh/nvm)
$ nvm install 24

# Enable Corepack (ships with Node.js, manages the pnpm version pinned in package.json)
$ corepack enable

# Get RERO-ILS-UI
$ git clone https://github.com/rero/rero-ils-ui.git
$ cd rero-ils-ui

# Project dependencies (also cleans an existing node_modules)
$ pnpm ci

# Build the shared library in watch mode (required, other projects depend on it)
# Keep this running in a separate terminal so changes rebuild automatically
$ pnpm exec ng build shared --watch

# Launch a local server using a proxy for https://localhost:5000 (rero-ils server)
$ pnpm run start-admin-proxy
```

## Development server

Run the `rero-ils` dev server on `https://localhost:5000` and run one of the `pnpm run start-*-proxy` scripts (see `.ai/dev-commands.md`) for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Production mode

To build all applications in production, just do:

```bash
pnpm run build
```

It generates all needed files in the **dist** directory.

## Running unit tests

All projects use [Vitest](https://vitest.dev) (`@angular/build:unit-test`).

Run all tests:

```bash
pnpm test
```

Run tests for a specific project:

```bash
pnpm exec ng test [project_name]
```

where **project\_name** is one of:

  * admin
  * public-search
  * public-patron-profile
  * public-holdings-items
  * search-bar
  * shared

## Further help

To get more help on the Angular CLI use `pnpm exec ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Translations

Commands:

  * `pnpm run admin_extract_messages`: will extract all strings in **admin** project and put them in **en\_US.json** file (source file)
  * `pnpm run admin_update_catalog`: will extract all string in source file and put them into **de/en/fr/it** json files for translation
  * `pnpm run public-search_extract_messages`: same as admin, but for **public-search** project
  * `pnpm run public-search_update_catalog`: same as admin, but for **public-search** project
  * `pnpm run extract_messages`: launches extract-messages commands for all projects
  * `pnpm run update_catalog`: launches update-catalog commands for all projects
