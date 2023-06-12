/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuFactory, MenuItem, MenuItemInterface } from '@rero/ng-core';
import { PermissionsService, PERMISSION_OPERATOR, UserService } from '@rero/shared';
import { IMenu, IMenuKeyValue, IMenuParent } from '../menu-definition/menu-interface';

@Injectable({
  providedIn: 'root'
})
export class MenuFactoryService {

  /** Available variables for menu definitions.
   *    All these variables will be replaced by corresponding values at menu generation.
   *    Each entry must have:
   *      - the variable name to replace as key attribute
   *      - a function returning the replacement value.
   */
  private REPLACEMENT_VARIABLES = {
    $currentLibrary: () => this._userService.user.currentLibrary,
    $currentOrganisation: () => this._userService.user.currentOrganisation,
    $symbolName: () => this._userService.user.symbolName,
    $currentBudget: () => this._userService.user.currentBudget,
    $currentDayRange: () => {
      const today = new Date()
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${this._resetDate(today)}--${this._resetDate(tomorrow)}`;
    }
  };

  /**
   * Constructor
   * @param _permissionsService - PermissionsService
   * @param _userService - UserService
   * @param _translateService - TranslateService
   */
  constructor(
    private _permissionsService: PermissionsService,
    private _userService: UserService,
    private _translateService: TranslateService
  ) {}

  /**
   * Create a full menu with children
   * @param menuName - Menu name
   * @param menus - Menu definition
   * @returns MenuItemInterface full menu
   */
  create(menuName: string, menus: IMenuParent[]): MenuItemInterface {
    const factory = new MenuFactory();
    const rootMenu = factory.createItem(menuName);
    menus.map((menu: IMenuParent) => {
      const menuChild = this._createMenu(menu);
      if (menuChild) {
        rootMenu.addChild(menuChild);
      }
    });
    return rootMenu;
  }

  /**
   * Create a node menu
   * @param menu IMenu
   * @returns MenuItemInterface
   */
  private _createMenu(menu: IMenu): MenuItemInterface | undefined {
    // Check if the menu must be generated/included depending on permissions related to this menu
    let canCreate = true;
    if (menu.access) {
      canCreate = this._permissionsService.canAccess(
        menu.access.permissions,
        menu.access.operator
          ? menu.access.operator
          : PERMISSION_OPERATOR.OR
      )
    }
    if (!canCreate) {
      return;
    }

    // If current menu has children, ask creation of these menus by recursion.
    //   As a child menu could be deactivated by permission (see above), keep only menu with some items.
    //   If no children menu, no router_link and no URI define for this menu entry, then no need to create it into the menu tree.
    let children: MenuItemInterface[] = [];
    if (!menu.router_link && menu.children?.length > 0) {
      children = menu.children
        .map((child: IMenu) => this._createMenu(child))
        .filter((child) => child);
    }
    if (!menu.router_link && !menu.uri && children.length === 0) {
      return;
    }

    // Build the menu entry.
    let name = null;
    if (menu.name.startsWith('$')) {
      if (!this._hasVariableAvailable(menu.name)) {
        throw new EvalError(`Name exception: This variable "${menu.name}" is not available.`);
      }
      name = String(this.REPLACEMENT_VARIABLES[menu.name]());
    } else {
      name = !('translate' in menu) || menu.translate
        ? this._translateService.instant(menu.name)
        : menu.name;
    }
    const menuItem = new MenuItem(name);
    if (menu.attributes) {
      this._processAttributes(menuItem, menu.attributes);
    }
    if (menu.extras) {
      this._processExtras(menuItem, menu.extras);
    }
    if (menu.router_link) {
      this._processRouterLink(menuItem, menu.router_link);
      if (menu.query_params) {
        this._processQueryParams(menuItem, menu.query_params)
      }
    }
    if (menu.uri) {
      menuItem.setUri(menu.uri);
    }
    // Add children menu entry to this menu if needed.
    children.map((child: MenuItemInterface) => menuItem.addChild(child));

    return menuItem;
  }

  /**
   * Process attributes object
   * @param menuRef MenuItemInterface
   * @param attributes Object attributes (key: value)
   */
  private _processAttributes(menuRef: MenuItemInterface, attributes: IMenuKeyValue): void {
    const keys = Object.keys(attributes);
    keys.map((key: string) => menuRef.setAttribute(key, attributes[key]));
  }

  /**
   * Process extras object
   * @param menuRef MenuItemInterface
   * @param extras Object extras (key: value)
   */
  private _processExtras(menuRef: MenuItemInterface, extras: IMenuKeyValue): void {
    const keys = Object.keys(extras);
    keys.map((key: string) => menuRef.setExtra(key, extras[key]));
  }

  /**
   * Process router links (array of string)
   * @param menuRef MenuItemInterface
   * @param routerLink Array of path
   */
  private _processRouterLink(menuRef: MenuItemInterface, routerLink: string[]): void {
    const routerL = routerLink.map((link: string) => {
      if (link.startsWith('$')) {
        if (!this._hasVariableAvailable(link)) {
          throw new EvalError(`Router link exception: This variable "${link}" is not available.`);
        }
        link = String(this.REPLACEMENT_VARIABLES[link]());
      }
      return link;
    });
    menuRef.setRouterLink(routerL);
  }

  /**
   * Process query params
   * @param menuRef MenuItemInterface
   * @param queryParams Object query params (key: value)
   */
  private _processQueryParams(menuRef: MenuItemInterface, queryParams: IMenuKeyValue): void {
    Object.keys(queryParams)
      .filter((key: string) => queryParams[key].startsWith('$'))  // special replacement only for $variable
      .map((key: string) => {
        if (!this._hasVariableAvailable(queryParams[key])) {
          throw new EvalError(`Query params exception: This variable "${queryParams[key]}" is not available.`);
        }
        queryParams[key] = String(this.REPLACEMENT_VARIABLES[queryParams[key]]());
      });
    menuRef.setQueryParams(queryParams);
  }

  /**
   * Has variable available
   * @param name - variable name
   * @returns True if the variable is available
   */
  private _hasVariableAvailable(name: string): boolean {
    return name in this.REPLACEMENT_VARIABLES;
  }

  /**
   * Reset a date at midnight for the same day. (2022-12-15T13:45:00.123 --> 1671062400000)
   * @param date: the date to transform
   * @returns The epoch of the transformed date in milliseconds.
   */
  private _resetDate(date: Date): number {
    const timestamp = date.getTime();
    const millis_from_midnight = timestamp % 86400000;  // 86400000 millis in a day
    return timestamp - millis_from_midnight
  }
}
