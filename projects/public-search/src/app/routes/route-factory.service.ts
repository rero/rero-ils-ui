/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteCollectionService } from './route-collection.service';

@Injectable({
  providedIn: 'root'
})
export class RouteFactoryService {

  private router: Router = inject(Router);
  private routeCollectionService: RouteCollectionService = inject(RouteCollectionService);

  /**
   * Initialize route by resource name
   * @param resource - string, name of resource
   * @param view - string, code of the current view
   * @throws Error if resource doesn't exists
   */
  createRouteByResourceNameAndView(resource: string, view: string) {
    const service = this.routeCollectionService.getRouteByResourceName(resource);
    if (service) {
      const routeConfig = service.create(view);
      if (routeConfig) {
        this.router.config.push(routeConfig);
      }
    }
  }
}
