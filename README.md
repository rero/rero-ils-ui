# Introduction

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

# Quick start

After [having launched RERO-ILS server](https://github.com/rero/rero-ils/blob/master/INSTALL.rst#running):

```bash
# Install nvm
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
# reload shell environment to activate nvm
$ source ~/.bashrc
# Install npm
$ nvm install lts/dubnium

# Get RERO-ILS-UI and use specific npm
$ git clone https://github.com/rero/rero-ils-ui.git/
$ cd rero-ils-ui
$ nvm use lts/dubnium
# Install angular-cli
$ npm i -g angular-cli
# Project npm dependencies
$ npm i
# Launch a local server using a proxy for https://localhost:5000 (rero-ils server)
$ npm run start-admin-proxy
```

# Development server

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

## Run only one test

For example with **projects/admin/src/app/menu/menu.component.spec.ts** file:

```bash
ng test --main projects/admin/src/app/menu/menu.component.spec.ts
```

## Tip: Chromium users

For Chromium users, it would be necessary to set **CHROME\_BIN** variable:

```
CHROME_BIN=`which chromium` ./run-tests.sh
```

# Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Translations

As we use [Transifex for rero-ils-ui](https://www.transifex.com/rero/rero-ils-ui/) you need to extract new string.

Choose the command regarding the application you work on. Either use extract or update command.

Commands:

  * `npm run admin_extract_messages`: will extract all strings in **admin** project and put it in **en\_US.json** file
  * `npm run admin_update_catalog`: will extract for update all string in **admin** project and put them into **de/en/fr/it** json files!
  * `npm run public-search_extract_messages`: same as admin, but for **public-search** project
  * `npm run public-search_update_catalog`: same as admin, but for **public-search** project
  * `npm run extract_messages`: launch **admin\_extract\_messages** and **public-search\_extract\_messages** commands
  * `npm run update_catalog`: launch **public-search\_update\_catalog** and **admin\_update\_catalog** commands
