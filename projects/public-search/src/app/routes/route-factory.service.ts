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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteCollectionService } from './route-collection.service';

@Injectable({
  providedIn: 'root'
})
export class RouteFactoryService {

  /**
   * Constructor
   * @param _router - Router
   * @param _routeCollectionService - RouteCollectionService
   */
  constructor(
    private _router: Router,
    private _routeCollectionService: RouteCollectionService
  ) {}

  /**
   * Initialize route by resource name
   * @param resource - string, name of resource
   * @param view - string, code of the current view
   * @throws Error if resource doesn't exists
   */
  createRouteByRecourceNameAndView(resource: string, view: string) {
    const service = this._routeCollectionService.getRouteByResourceName(resource);
    const routeConfig = service.create(view);
    if (routeConfig) {
      this._router.config.push(routeConfig);
    }
  }
}
