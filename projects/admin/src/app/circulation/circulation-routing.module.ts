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
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin/checkin.component';
import { MainRequestComponent } from './main-request/main-request.component';
import { HistoryComponent } from './patron/history/history.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import { PatronTransactionsComponent } from './patron/patron-transactions/patron-transactions.component';
import { PendingComponent } from './patron/pending/pending.component';
import { PickupComponent } from './patron/pickup/pickup.component';
import { ProfileComponent } from './patron/profile/profile.component';

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
        component: LoanComponent
      },
      {
        path: 'pickup',
        component: PickupComponent
      },
      {
        path: 'pending',
        component: PendingComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'fees',
        component: PatronTransactionsComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      }
    ]
  }, {
      path: 'checkout',
      component: CheckinComponent
    }, {
    path: 'requests',
    component: MainRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CirculationRoutingModule {
}
