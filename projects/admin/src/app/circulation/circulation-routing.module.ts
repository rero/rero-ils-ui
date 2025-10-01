/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { _ } from "@ngx-translate/core";
import { PERMISSIONS } from '@rero/shared';
import { PermissionGuard } from '../guard/permission.guard';
import { CheckinComponent } from './checkin/checkin.component';
import { CirculationMainComponent } from './circulation-main.component';
import { keepHistoryGuard } from './guard/keep-history.guard';
import { MainRequestComponent } from './main-request/main-request.component';
import { HistoryComponent } from './patron/history/history.component';
import { IllRequestComponent } from './patron/ill-request/ill-request.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import { PatronTransactionsComponent } from './patron/patron-transactions/patron-transactions.component';
import { PendingComponent } from './patron/pending/pending.component';
import { PickupComponent } from './patron/pickup/pickup.component';
import { ProfileComponent } from './patron/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: CirculationMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'checkout',
        pathMatch: 'full',
      },
      {
        path: 'checkout',
        component: CheckinComponent,
        title: _('Checkout/check-in'),
        canActivate: [ PermissionGuard ],
        data: {
          permissions: [ PERMISSIONS.CIRC_ADMIN ]
        }
      },
      {
        path: 'requests',
        component: MainRequestComponent,
        title: _('Requests'),
        canActivate: [ PermissionGuard ],
        data: {
          permissions: [ PERMISSIONS.CIRC_ADMIN ]
        }
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
            title: _('On loan'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'pickup',
            component: PickupComponent,
            title: _('To pick up'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'pending',
            component: PendingComponent,
            title: _('Pending'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'ill',
            component: IllRequestComponent,
            title: _('Interlibrary loan'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'profile',
            component: ProfileComponent,
            title: _('Profile'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'fees',
            component: PatronTransactionsComponent,
            title: _('Fees'),
            canActivate: [ PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          },
          {
            path: 'history',
            component: HistoryComponent,
            title: _('History'),
            canActivate: [ keepHistoryGuard, PermissionGuard ],
            data: {
              permissions: [ PERMISSIONS.CIRC_ADMIN ]
            }
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CirculationRoutingModule { }
