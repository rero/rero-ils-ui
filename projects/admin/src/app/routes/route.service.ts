/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
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
import { EntitiesRoute } from '@app/admin/routes/entities-route';
import { TranslateService } from '@ngx-translate/core';
import { RouteCollectionService } from '@rero/ng-core';
import { AccountsRoute as AcqAccountsRoute } from '../acquisition/routes/accounts-route';
import { BudgetsRoute as AcqBudgetsRoute } from '../acquisition/routes/budgets-route';
import { OrderLinesRoute as AcqOrderLinesRoute } from '../acquisition/routes/order-lines-route';
import { OrdersRoute as AcqOrdersRoute } from '../acquisition/routes/orders-route';
import { ReceiptLinesRoute } from '../acquisition/routes/receipt-lines-route';
import { ReceiptsRoute } from '../acquisition/routes/receipts-route';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { CirculationPoliciesRoute } from './circulation-policies-route';
import { CollectionsRoute } from './collections-route';
import { DocumentsRoute } from './documents-route';
import { EntitiesLocalRoute } from './entities-local-route';
import { EntitiesRemoteRoute } from './entities-remote-route';
import { HoldingsRoute } from './holdings-route';
import { IllRequestsRoute } from './ill-requests-route';
import { ImportDocumentsRoute } from './import-documents-route';
import { IssuesRoute } from './issues-route';
import { ItemTypesRoute } from './item-types-route';
import { ItemsRoute } from './items-route';
import { LibrariesRoute } from './libraries-route';
import { LoansRoute } from './loans-route';
import { LocalFieldsRoute } from './local-fields-route';
import { LocationsRoute } from './locations-route';
import { OrganisationsRoute } from './organisations-route';
import { PatronTransactionEventsRoute } from './patron-transaction-events-route';
import { PatronTypesRoute } from './patron-types-route';
import { PatronsRoute } from './patrons-route';
import { RouteToolService } from './route-tool.service';
import { StatisticsCfgRoute } from './statistics-cfg-route';
import { TemplatesRoute } from './templates-route';
import { VendorsRoute } from './vendors-route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  /**
   * Constructor
   * @param _routeCollectionService - RouteCollectionService
   * @param _router - Router
   * @param _routeToolService - RouteToolService
   * @param _translateService - TranslateService used by children.
   */
  constructor(
    private _routeCollectionService: RouteCollectionService,
    private _router: Router,
    private _routeToolService: RouteToolService,
    private _translateService: TranslateService
  ) { }

  /**
   * Initialize routes
   */
  initializeRoutes() {
    this._routeCollectionService
      .addRoute(new CirculationPoliciesRoute(this._routeToolService))
      .addRoute(new DocumentsRoute(this._routeToolService))
      .addRoute(new HoldingsRoute(this._routeToolService))
      .addRoute(new ItemsRoute(this._routeToolService))
      .addRoute(new IssuesRoute(this._routeToolService))
      .addRoute(new ItemTypesRoute(this._routeToolService))
      .addRoute(new LibrariesRoute(this._routeToolService))
      .addRoute(new LocationsRoute(this._routeToolService))
      .addRoute(new OrganisationsRoute(this._routeToolService))
      .addRoute(new PatronsRoute(this._routeToolService))
      .addRoute(new PatronTypesRoute(this._routeToolService))
      .addRoute(new VendorsRoute(this._routeToolService))
      .addRoute(new TemplatesRoute(this._routeToolService))
      .addRoute(new CollectionsRoute(this._routeToolService))
      .addRoute(new IllRequestsRoute(this._routeToolService))
      .addRoute(new LocalFieldsRoute(this._routeToolService))
      .addRoute(new LoansRoute(this._routeToolService))
      .addRoute(new PatronTransactionEventsRoute(this._routeToolService))
      .addRoute(new EntitiesRoute(this._routeToolService))
      .addRoute(new EntitiesRemoteRoute(this._routeToolService))
      .addRoute(new EntitiesLocalRoute(this._routeToolService))
      .addRoute(new StatisticsCfgRoute(this._routeToolService))
      // Route from acquisition modules
      .addRoute(new AcqBudgetsRoute(this._routeToolService))
      .addRoute(new AcqAccountsRoute(this._routeToolService))
      .addRoute(new AcqOrderLinesRoute(this._routeToolService))
      .addRoute(new AcqOrdersRoute(this._routeToolService))
      .addRoute(new ReceiptsRoute(this._routeToolService))
      .addRoute(new ReceiptLinesRoute(this._routeToolService))
      // should be at the last
      .addRoute(new ImportDocumentsRoute(this._routeToolService, this._translateService))
    ;
    this._routeCollectionService.getRoutes().map((route: any) => {
      this._router.config.push(route);
    });
    this._router.config.push(...[
      {path: 'errors/:status_code', component: ErrorPageComponent},
      {path: '**', component: ErrorPageComponent}
    ]);
  }
}
