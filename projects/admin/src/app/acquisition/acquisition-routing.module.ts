/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 * Copyright (C) 2021-2022 UCLouvain
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
import { RouterModule, ROUTES, Routes } from '@angular/router';
import { PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { PermissionGuard } from '../guard/permission.guard';
import { RouteToolService } from '../routes/route-tool.service';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountTransferComponent } from './components/account/account-transfer/account-transfer.component';
import { AcquisitionMainComponent } from './components/acquisition-main/acquisition-main.component';
import { AccountsRoute } from './routes/accounts-route';
import { BudgetsRoute } from './routes/budgets-route';
import { OrderLinesRoute } from './routes/order-lines-route';
import { OrdersRoute } from './routes/orders-route';
import { ReceiptsRoute } from './routes/receipts-route';
import { VendorsRoute } from './routes/vendors-route';

const routes: Routes = [
  {
    path: '',
    component: AcquisitionMainComponent,
    children: [
      { path: '', redirectTo: 'accounts', pathMatch: 'full' },
      {
        path: 'accounts/transfer',
        component: AccountTransferComponent,
        canActivate: [PermissionGuard],
        data: { permissions: [PERMISSIONS.ACAC_TRANSFER] },
      },
      {
        path: 'accounts',
        component: AccountListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: [PERMISSIONS.ACAC_ACCESS, PERMISSIONS.ACAC_SEARCH], operator: PERMISSION_OPERATOR.AND },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: () => {
        const routes: Routes = [
          new AccountsRoute().getConfiguration(),
          new BudgetsRoute().getConfiguration(),
          new OrderLinesRoute().getConfiguration(),
          new OrdersRoute().getConfiguration(),
          new ReceiptsRoute().getConfiguration(),
          new VendorsRoute().getConfiguration()
        ];
        return routes;
      },
      deps: [
        RouteToolService
      ],
      multi: true
    }
  ]
})
export class AcquisitionRoutingModule {}
