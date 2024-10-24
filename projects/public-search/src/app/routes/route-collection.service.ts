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

import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { ResourceRouteInterface } from './resource-route-interface';

// Pattern to find all route(s) service into the dependency injection
export const resourceRouteToken = new InjectionToken<ResourceRouteInterface[]>
  ('ResourceRouteInterface');

@Injectable({
  providedIn: 'root'
})
export class RouteCollectionService {

  private injector: Injector = inject(Injector);

  /** Available resources route config */
  private resourcesAvailable = {};

  /**
   * Get Route Service implemented with ResourceRouteInterface
   */
  load() {
    const routes = this.injector.get(resourceRouteToken);
    routes.map((route: ResourceRouteInterface) => {
      route.getResources().map((resource: string) => {
        this.resourcesAvailable[resource] = route;
      });
    });
  }

  /**
   * Get route by resource name
   * @param name - string, name of resource
   * @return ResourceRouteInterface
   * @throws Error if route service doesn't exist
   */
  getRouteByResourceName(name: string) {
    try {
      return this.resourcesAvailable[name];
    } catch (e) {
      throw new Error(
        `RouteCollectionService: The resource "${name}" does not exist.`
      );
    }
  }
}
