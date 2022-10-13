/*
 * RERO ILS UI
 * Copyright (C) 2021-2022 RERO
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
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS, PermissionsService, PERMISSION_OPERATOR } from '@rero/shared';
import { PermissionGuard } from '../guard/permission.guard';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountTransferComponent } from './components/account/account-transfer/account-transfer.component';
import { OrderReceiptViewComponent } from './components/receipt/receipt-form/order-receipt-view.component';
import { CanOrderReceiptGuard } from './routes/guards/can-order-receipt.guard';

const routes: Routes = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts/transfer', component: AccountTransferComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ACAC_TRANSFER ] } },
  { path: 'accounts', component: AccountListComponent, canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.ACAC_ACCESS, PERMISSIONS.ACAC_SEARCH ], operator: PERMISSION_OPERATOR.AND } },
  { path: 'acq_orders/:pid/receive', component: OrderReceiptViewComponent, canActivate: [ CanOrderReceiptGuard ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    PermissionsService
  ]
})
export class AcquisitionRoutingModule { }
