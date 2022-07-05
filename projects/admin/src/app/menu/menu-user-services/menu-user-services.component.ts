/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, OnInit } from '@angular/core';
import { MenuItemInterface } from '@rero/ng-core';
import { MenuUserServicesService } from '../service/menu-user-services.service';

@Component({
  selector: 'admin-menu-user-services',
  templateUrl: './menu-user-services.component.html'
})
export class MenuUserServicesComponent implements OnInit {

  /** User menu */
  private _menu: MenuItemInterface;

  /**
   * User menu service
   */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _menuUserServicesService - MenuUserService
   */
  constructor(private _menuUserServicesService: MenuUserServicesService) { }

  /** Init */
  ngOnInit(): void {
    if (!(this._menuUserServicesService.menu)) {
      this._menuUserServicesService.generate();
    }
    this._menu = this._menuUserServicesService.menu;
  }
}
