# -*- coding: utf-8 -*-
#
# RERO ILS UI
# Copyright (C) 2019 RERO
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

# COLORS for messages
NC='\033[0m'                 # Default color
INFO_COLOR='\033[1;33m'      # Yellow
SUCCESS_COLOR='\033[0;32m'   # Green

# MESSAGES
msg() {
  echo -e "${1}" 1>&2
}
# Display a colored message
# More info: https://misc.flogisoft.com/bash/tip_colors_and_formatting
# $1: choosen color
# $2: title
# $3: the message
colored_msg() {
  msg "${1}[${2}]: ${3}${NC}"
}

info_msg() {
  colored_msg "${INFO_COLOR}" "INFO" "${1}"
}

success_msg() {
  colored_msg "${SUCCESS_COLOR}" "SUCCESS" "${1}"
}

info_msg "This will update version in package.json, create a commit with tag and push it."
read -p "You are about to release the project, are you sure (y/n)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # Update version in package.json from 0.0.n to 0.0.n+1 (patch), create commit with message and push the tags
  npm version patch -m "release: v%s

* Releases v%s and publishes it on NPM.

Co-Authored-by: [Your Full Name] <[your-email]>" --git-tag-version
  git commit --amend
  git push --tags rero master
  success_msg "Successfully released the project"
else
  info_msg "Cancelled"
  exit 1
fi
