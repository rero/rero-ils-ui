/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AcquisitionRoutingModule } from './acquisition-routing.module';
import { AccountDetailViewComponent } from './components/account/account-detail-view/account-detail-view.component';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountBriefViewComponent } from './components/account/account-brief-view/account-brief-view.component';
import { AccountTransferComponent } from './components/account/account-transfer/account-transfer.component';
import { BudgetsBriefViewComponent } from './components/budget/budget-brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from './components/budget/budget-detail-view/budget-detail-view.component';
import { OrderBriefViewComponent } from './components/order/order-brief-view/order-brief-view.component';
import { OrderDetailViewComponent } from './components/order/order-detail-view/order-detail-view.component';
import { OrderLineComponent } from './components/order/order-detail-view/order-line/order-line.component';
import { OrderLinesComponent } from './components/order/order-detail-view/order-lines/order-lines.component';
import { NegativeAmountPipe } from './pipes/negative-amount.pipe';

@NgModule({
  declarations: [
    AccountListComponent,
    AccountBriefViewComponent,
    AccountTransferComponent,
    AccountDetailViewComponent,
    BudgetsBriefViewComponent,
    BudgetDetailViewComponent,
    OrderBriefViewComponent,
    OrderDetailViewComponent,
    OrderLinesComponent,
    OrderLineComponent,
    NegativeAmountPipe
  ],
  imports: [
    PopoverModule.forRoot(),
    CommonModule,
    AcquisitionRoutingModule,
    ReactiveFormsModule,
    RecordModule,
    SharedModule
  ]
})
export class AcquisitionModule { }
