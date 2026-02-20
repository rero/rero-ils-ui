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

*Copyright (C) 2020 RERO*
*Copyright (C) 2020 UCLouvain*

[1]: https://github.com/rero/rero-ils-ui

## Introduction

**Rero-ils-ui** is a part of [RERO21 project](https://rero21.ch/about/).

It's a Web UI (User Interface) of [rero-ils](https://ils.test.rero.ch/) for libraries management.

This interface aims to be simple and clear. It's made with [Angular CLI](https://github.com/angular/angular-cli).

## Requirements

We strongly recommend the use of [nvm](https://github.com/nvm-sh/nvm).

And then:

  * npm
  * angular-cli
  * [rero-ils](https://github.com/rero/rero-ils/blob/master/INSTALL.rst) installed and [running](https://github.com/rero/rero-ils/blob/master/INSTALL.rst#running)

Optionnaly, for development purposes, you can install an IDE such as Visual Studio Code, Atom, WebStorm, etc.

## Quick start

After [having launched RERO-ILS server](https://github.com/rero/rero-ils/blob/master/INSTALL.rst#running):

```bash
# Install nvm
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
# reload shell environment to activate nvm
$ source ~/.bashrc
# Install npm
$ nvm install lts/erbium

# Get RERO-ILS-UI and use specific npm
$ git clone https://github.com/rero/rero-ils-ui.git/
$ cd rero-ils-ui
$ nvm use lts/erbium
# Install angular-cli
$ npm i -g @angular/cli@8.3.28
# Project npm dependencies
$ npm i
# Build shared library
$ ng build shared --watch
# Launch a local server using a proxy for https://localhost:5000 (rero-ils server)
$ npm run start-admin-proxy
```

### How to update Node version with nvm

In case you're updating Node version with nvm:

```bash
# First check you node version
node --version # here, 10.16.3
nvm install lts/erbium --reinstall-packages-from=10.16.3
nvm uninstall 10.16.3
```

## Development server

Run the `rero-ils` dev server on `https://localhost:5000` and run `npm run start-admin-proxy` or `npm run start-public-search-proxy` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Production mode

To run all applications in production, just do:

```bash
npm run build
```

It generates all needed files in **dist** directory.

## Running unit tests

Run `./run-tests.sh` to execute linting and the unit tests via [Karma](https://karma-runner.github.io).

This will do **headless browser** tests (no Graphical User Interface).

To **check test in live**, do: `ng test [project_name]`

where **project\_name** is one of:

  * admin
  * public-search
  * search-bar

### Run only one test

For example with **projects/admin/src/app/menu/menu.component.spec.ts** file:

```bash
ng test --main projects/admin/src/app/menu/menu.component.spec.ts
```

### Tip: Chromium users

For Chromium users, it would be necessary to set **CHROME\_BIN** variable:

```
CHROME_BIN=`which chromium` ./run-tests.sh
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Translations

Commands:

  * `npm run admin_extract_messages`: will extract all strings in **admin** project and put them in **en\_US.json** file (source file)
  * `npm run admin_update_catalog`: will extract all string in source file and put them into **de/en/fr/it** json files for translation
  * `npm run public-search_extract_messages`: same as admin, but for **public-search** project
  * `npm run public-search_update_catalog`: same as admin, but for **public-search** project
  * `npm run extract_messages`: launches **admin\_extract\_messages** and **public-search\_extract\_messages** commands
  * `npm run update_catalog`: launches **public-search\_update\_catalog** and **admin\_update\_catalog** commands
