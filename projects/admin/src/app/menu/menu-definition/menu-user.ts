// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MenuItem } from "primeng/api";
import { MENU_IDS } from "./menu-ids";

export const MENU_USER: MenuItem[] = [
  {
    label: 'Help',
    translateLabel: 'Help',
    icon: 'fa fa-info',
    id: MENU_IDS.USER.HELP,
    url: '/help',
    target: '_blank'
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
        url: '/',
      },
      {
        label: 'Logout',
        translateLabel: 'Logout',
        id: MENU_IDS.USER.LOGOUT,
        icon: 'fa fa-sign-out',
        url: '/signout',
      }
    ]
  }
]
