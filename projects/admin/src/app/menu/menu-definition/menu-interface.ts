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

export interface IMenuParent extends IMenu {
  children: IMenu[]
}

export interface IMenu {
  name: string;
  uri?: string,
  router_link?: string[],
  query_params?: IMenuKeyValue,
  attributes?: IMenuKeyValue,
  extras?: IMenuKeyValue,
  children?: IMenu[],
  access?: {
    permissions: string[],
    operator?: string;
  },
  translate?: boolean
}

export interface IMenuKeyValue {
  [key: string]: string;
}
