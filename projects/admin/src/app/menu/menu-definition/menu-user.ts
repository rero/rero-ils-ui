/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { IMenuParent } from "./menu-interface";

export const MENU_USER: IMenuParent[] = [
  {
    name: '$symbolName',
    attributes: {
      id: 'my-account-menu',
      class: 'dropdown-menu dropdown-menu-right'
    },
    extras: { iconClass: 'fa fa-user'},
    children: [
      {
        name: 'Public interface',
        uri: '/',
        attributes: { id: 'libraries-menu' },
        extras: { iconClass: 'fa fa-users' },
      },
      {
        name: 'Logout',
        uri: '/signout',
        attributes: { id: 'logout-menu' },
        extras: { iconClass: 'fa fa-sign-out' },
      }
    ]
  }
]
