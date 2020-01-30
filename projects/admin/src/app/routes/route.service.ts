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
import { RouteCollectionService } from '@rero/ng-core';
import { DocumentsRoute } from './documents-route';
import { RouteToolService } from './route-tool.service';
import { LibrariesRoute } from './libraries-route';
import { PatronsRoute } from './patrons-route';
import { PersonsRoute } from './persons-route';
import { ItemTypesRoute } from './item-types-route';
import { ItemsRoute } from './items-route';
import { LocationsRoute } from './locations-route';
import { PatronTypesRoute } from './patron-types-route';
import { CirculationPoliciesRoute } from './circulation-policies-route';
import { VendorsRoute } from './vendors-route';
import { AcquisitionOrdersRoute } from './acquisition-orders-route';
import { AcquisitionOrderLinesRoute } from './acquisition-order-lines-route';
import { OrganisationsRoute } from './organisations-route';
import { AcquisitionAccountsRoute } from './acquisition-accounts-route';
import { BudgetsRoute } from './budgets-route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  /**
   * Constructor
   * @param routeCollectionService - RouteCollectionService
   * @param router - Router
   * @param routeToolService - RouteToolService
   */
  constructor(
    private _routeCollectionService: RouteCollectionService,
    private _router: Router,
    private _routeToolService: RouteToolService
  ) { }

  /**
   * Initialize routes
   */
  initializeRoutes() {
    this._routeCollectionService
      .addRoute(new AcquisitionAccountsRoute(this._routeToolService))
      .addRoute(new AcquisitionOrderLinesRoute(this._routeToolService))
      .addRoute(new AcquisitionOrdersRoute(this._routeToolService))
      .addRoute(new BudgetsRoute(this._routeToolService))
      .addRoute(new CirculationPoliciesRoute(this._routeToolService))
      .addRoute(new DocumentsRoute(this._routeToolService))
      .addRoute(new ItemTypesRoute(this._routeToolService))
      .addRoute(new ItemsRoute(this._routeToolService))
      .addRoute(new LibrariesRoute(this._routeToolService))
      .addRoute(new LocationsRoute(this._routeToolService))
      .addRoute(new OrganisationsRoute(this._routeToolService))
      .addRoute(new PatronTypesRoute(this._routeToolService))
      .addRoute(new PatronsRoute(this._routeToolService))
      .addRoute(new PersonsRoute(this._routeToolService))
      .addRoute(new VendorsRoute(this._routeToolService))
    ;

    this._routeCollectionService.getRoutes().map((route: any) => {
      this._router.config.push(route);
    });
  }
}
