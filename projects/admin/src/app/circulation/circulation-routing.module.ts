/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { PERMISSIONS } from '@rero/shared';
import { PermissionGuard } from '../guard/permission.guard';
import { CheckinComponent } from './checkin/checkin.component';
import { MainRequestComponent } from './main-request/main-request.component';
import { HistoryComponent } from './patron/history/history.component';
import { IllRequestComponent } from './patron/ill-request/ill-request.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import { PatronTransactionsComponent } from './patron/patron-transactions/patron-transactions.component';
import { PendingComponent } from './patron/pending/pending.component';
import { PickupComponent } from './patron/pickup/pickup.component';
import { ProfileComponent } from './patron/profile/profile.component';
import { keepHistoryGuard } from './guard/keep-history.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'checkout',
    pathMatch: 'full'
  },
  {
    path: 'patron/:barcode',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'loan',
        pathMatch: 'full'
      },
      {
        path: 'loan',
        component: LoanComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'pickup',
        component: PickupComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'pending',
        component: PendingComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'ill',
        component: IllRequestComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'fees',
        component: PatronTransactionsComponent,
        canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      },
      {
        path: 'history',
        component: HistoryComponent,
        canActivate: [ keepHistoryGuard, PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
      }
    ]
  }, {
      path: 'checkout',
      component: CheckinComponent,
      canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
    }, {
    path: 'requests',
    component: MainRequestComponent,
    canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.CIRC_ADMIN ] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CirculationRoutingModule { }
