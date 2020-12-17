/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteFactoryService, routeToken } from '@rero/ng-core';
import { AcquisitionAccountsRoute } from './routes/acquisition-accounts-route';
import { AcquisitionOrderLinesRoute } from './routes/acquisition-order-lines-route';
import { AcquisitionOrdersRoute } from './routes/acquisition-orders-route';
import { BudgetsRoute } from './routes/budgets-route';
import { CirculationPoliciesRoute } from './routes/circulation-policies-route';
import { CollectionsRoute } from './routes/collections-route';
import { CorporateBodiesRoute } from './routes/corporate-bodies-route';
import { DocumentsRoute } from './routes/documents-route';
import { ErrorRoute } from './routes/error-route';
import { HoldingsRoute } from './routes/holdings-route';
import { IllRequestsRoute } from './routes/ill-requests-route';
import { ImportDocumentsRoute } from './routes/import-documents-route';
import { InitialRoute } from './routes/initial-route';
import { IssuesRoute } from './routes/issues-route';
import { ItemTypesRoute } from './routes/item-types-route';
import { ItemsRoute } from './routes/items-route';
import { LibrariesRoute } from './routes/libraries-route';
import { LocalFieldsRoute } from './routes/local-fields-route';
import { LocationsRoute } from './routes/locations-route';
import { OrganisationsRoute } from './routes/organisations-route';
import { PatronTypesRoute } from './routes/patron-types-route';
import { PatronsRoute } from './routes/patrons-route';
import { PersonsRoute } from './routes/persons-route';
import { RouteToolService } from './routes/route-tool.service';
import { TemplatesRoute } from './routes/templates-route';
import { VendorsRoute } from './routes/vendors-route';

@NgModule({
  imports: [RouterModule.forRoot([])],
  exports: [RouterModule],
  providers: [
    { provide: routeToken, useClass: InitialRoute, multi: true },
    { provide: routeToken, useClass: ErrorRoute, multi: true },
    { provide: routeToken, useClass: AcquisitionAccountsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: AcquisitionOrderLinesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: AcquisitionOrdersRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: BudgetsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: CirculationPoliciesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: CollectionsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: CorporateBodiesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: DocumentsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: HoldingsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: IllRequestsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: ImportDocumentsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: IssuesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: ItemTypesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: ItemsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: LibrariesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: LocalFieldsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: LocationsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: OrganisationsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: PatronTypesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: PatronsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: PersonsRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: TemplatesRoute, multi: true, deps: [RouteToolService] },
    { provide: routeToken, useClass: VendorsRoute, multi: true, deps: [RouteToolService] },
  ]
})
export class AppRoutingModule {
  /**
   * Constructor
   * @param _router - Router
   * @param routerFactoryService - RouteFactoryService
   */
  constructor(
    private _router: Router,
    private routerFactoryService: RouteFactoryService
  ) {
    _router.resetConfig(routerFactoryService.createRoutes());
  }
}
