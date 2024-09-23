/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { MenuItem } from "primeng/api";
import { MENU_IDS } from "./menu-ids";

export const MENU_USER: MenuItem[] = [
  {
    label: 'Help',
    translateLabel: 'Help',
    icon: 'fa fa-info',
    id: MENU_IDS.USER.HELP,
    url: '/help',
  },
  {
    label: '$symbolName',
    translateLabel: '$symbolName',
    id: MENU_IDS.USER.MENU,
    icon: 'fa fa-user',
    items: [
      {
        label: 'Language',
        translateLabel: 'Language',
        id: MENU_IDS.USER.LANGUAGE,
        icon: 'fa fa-language',
        items: [],
      },
      {
        label: 'Public interface',
        translateLabel: 'Public interface',
        id: MENU_IDS.USER.PUBLIC_INTERFACE,
        icon: 'fa fa-users',
        uri: '/',
      },
      {
        label: 'Logout',
        translateLabel: 'Logout',
        id: MENU_IDS.USER.LOGOUT,
        icon: 'fa fa-sign-out',
        uri: '/signout',
      }
    ]
  }
]
