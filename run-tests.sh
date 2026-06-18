#!/usr/bin/env bash
# SPDX-FileCopyrightText: Fondation RERO+
# SPDX-License-Identifier: AGPL-3.0-or-later

RED='\033[0;31m'
GREEN='\033[0;0;32m'
NC='\033[0m' # No Color

display_error_message () {
	echo -e "${RED}$1${NC}" 1>&2
}

display_success_message () {
    echo -e "${GREEN}$1${NC}" 1>&2
}

set -e

display_success_message "Linting the projects..."
ng lint

display_success_message "Build shared library"
npm run build-shared

display_success_message "Run the tests"
ng test --no-watch --no-progress

display_success_message "Run packing"
npm run pack
