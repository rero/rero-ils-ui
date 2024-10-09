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
import { EntitiesRoute } from '@app/admin/routes/entities-route';
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
import { StatisticsCfgRoute } from './statistics-cfg-route';
import { TemplatesRoute } from './templates-route';
import { VendorsRoute } from './vendors-route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private routeCollectionService: RouteCollectionService = inject(RouteCollectionService);
  private router: Router = inject(Router);

  /**
   * Initialize routes
   */
  initializeRoutes() {
    this.routeCollectionService
      .addRoute(new CirculationPoliciesRoute())
      .addRoute(new DocumentsRoute())
      .addRoute(new HoldingsRoute())
      .addRoute(new ItemsRoute())
      .addRoute(new IssuesRoute())
      .addRoute(new ItemTypesRoute())
      .addRoute(new LibrariesRoute())
      .addRoute(new LocationsRoute())
      .addRoute(new OrganisationsRoute())
      .addRoute(new PatronsRoute())
      .addRoute(new PatronTypesRoute())
      .addRoute(new VendorsRoute())
      .addRoute(new TemplatesRoute())
      .addRoute(new CollectionsRoute())
      .addRoute(new IllRequestsRoute())
      .addRoute(new LocalFieldsRoute())
      .addRoute(new LoansRoute())
      .addRoute(new PatronTransactionEventsRoute())
      .addRoute(new EntitiesRoute())
      .addRoute(new EntitiesRemoteRoute())
      .addRoute(new EntitiesLocalRoute())
      .addRoute(new StatisticsCfgRoute())
      // Route from acquisition modules
      .addRoute(new AcqBudgetsRoute())
      .addRoute(new AcqAccountsRoute())
      .addRoute(new AcqOrderLinesRoute())
      .addRoute(new AcqOrdersRoute())
      .addRoute(new ReceiptsRoute())
      .addRoute(new ReceiptLinesRoute())
      // should be at the last
      .addRoute(new ImportDocumentsRoute())
    ;
    this.routeCollectionService.getRoutes().map((route: any) => {
      this.router.config.push(route);
    });
    this.router.config.push(...[
      {path: 'errors/:status_code', component: ErrorPageComponent},
      {path: '**', component: ErrorPageComponent}
    ]);
  }
}
