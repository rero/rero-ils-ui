# [RERO ILS UI][1]

![Travis (.org)](https://img.shields.io/travis/rero/rero-ils-ui)
[![Coverall.io](https://img.shields.io/coveralls/rero/rero-ils.svg)](https://coveralls.io/r/rero/rero-ils)
[![GitHub Release](https://img.shields.io/github/release/tag/rero/rero-ils.svg?style=flat)](https://github.com/rero/rero-ils/releases/latest)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
[![Gitter](https://img.shields.io/gitter/room/rero/rero-ils)](https://gitter.im/rero/rero-ils)

Public search: \
[![Translation status](https://hosted.weblate.org/widgets/rero_plus/-/rero-ils-public-search/svg-badge.svg)](https://hosted.weblate.org/engage/rero_plus/?utm_source=widget)

Professional interface (admin): \
[![Translation status](https://hosted.weblate.org/widgets/rero_plus/-/rero-ils-admin/svg-badge.svg)](https://hosted.weblate.org/engage/rero_plus/?utm_source=widget)

*Copyright (C) 2020 RERO*
*Copyright (C) 2020 UCLouvain*

[1]: https://github.com/rero/rero-ils-ui

## Introduction

**Rero-ils-ui** is a part of [RERO21 project](https://rero21.ch/about/).

It's a Web UI (User Interface) of [rero-ils](https://ils.test.rero.ch/) for libraries management.

This interface aims to be simple and clear. It's made with [Angular CLI](https://github.com/angular/angular-cli).

It's composed of 3 applications:

1. admin: UI for librarians
2. public-search: search bar for non-logged users. Used in RERO-ils homepage
3. search-bar: logged user search bar (integrated in RERO-ils banner)

# Requirements

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

# Production mode

To run all applications in production, just do:

```bash
npm run build
```

It generates all needed files in **dist** directory.

# Running unit tests

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

As we use [Transifex for rero-ils-ui](https://www.transifex.com/rero/rero-ils-ui/) you need to extract new string.

Transifex is now integrated into git workflow the following way:

When a PR is merged into dev branch, Transifex pulls the new or updated strings.
When a language is 100% reviewed, Transifex creates a branch and a PR (one per language) to merge translations to dev branch.

Don't use tx pull or push command, as the synchronization is done automatically, but extract the strings before each PR, as described below:

Choose the command regarding the application you work on:
* Use extract command first to put the strings in source file.
* Then use update command to add the strings in the translations files. This allows the strings to be displayed in any language even if not yet translated.

Commands:

  * `npm run admin_extract_messages`: will extract all strings in **admin** project and put them in **en\_US.json** file (source file)
  * `npm run admin_update_catalog`: will extract all string in source file and put them into **de/en/fr/it** json files for translation
  * `npm run public-search_extract_messages`: same as admin, but for **public-search** project
  * `npm run public-search_update_catalog`: same as admin, but for **public-search** project
  * `npm run extract_messages`: launches **admin\_extract\_messages** and **public-search\_extract\_messages** commands
  * `npm run update_catalog`: launches **public-search\_update\_catalog** and **admin\_update\_catalog** commands
