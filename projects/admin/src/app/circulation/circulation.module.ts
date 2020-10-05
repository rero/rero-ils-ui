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


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { RecordModule } from '@rero/ng-core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedPipesModule } from '../shared/shared-pipes.module';
import { CheckinComponent } from './checkin/checkin.component';
import { CirculationRoutingModule } from './circulation-routing.module';
import { ItemComponent } from './item/item.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { MainRequestComponent } from './main-request/main-request.component';
import { CardComponent } from './patron/card/card.component';
import { HistoryItemComponent } from './patron/history/history-item/history-item.component';
import { HistoryComponent } from './patron/history/history.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import {
  PatronTransactionEventFormComponent
} from './patron/patron-transactions/patron-transaction-event-form/patron-transaction-event-form.component';
import { PatronTransactionEventComponent } from './patron/patron-transactions/patron-transaction-event/patron-transaction-event.component';
import {
  DefaultTransactionComponent
} from './patron/patron-transactions/patron-transaction/default-transaction/default-transaction.component';
import {
  OverdueTransactionComponent
} from './patron/patron-transactions/patron-transaction/overdue-transaction/overdue-transaction.component';
import { PatronTransactionComponent } from './patron/patron-transactions/patron-transaction/patron-transaction.component';
import { PatronTransactionsComponent } from './patron/patron-transactions/patron-transactions.component';
import { PickupItemComponent } from './patron/pickup/pickup-item/pickup-item.component';
import { PickupComponent } from './patron/pickup/pickup.component';
import { ProfileComponent } from './patron/profile/profile.component';
import { PendingItemComponent } from './patron/pending/pending-item/pending-item.component';
import { PendingComponent } from './patron/pending/pending.component';
import { RequestedItemsListComponent } from './requested-items-list/requested-items-list.component';


@NgModule({
  declarations: [
    MainComponent,
    MainRequestComponent,
    RequestedItemsListComponent,
    CardComponent,
    ItemsListComponent,
    LoanComponent,
    CheckinComponent,
    ItemComponent,
    ProfileComponent,
    PendingComponent,
    PendingItemComponent,
    PickupComponent,
    PickupItemComponent,
    PatronTransactionsComponent,
    PatronTransactionComponent,
    PatronTransactionEventComponent,
    PatronTransactionEventFormComponent,
    OverdueTransactionComponent,
    DefaultTransactionComponent,
    PatronTransactionEventFormComponent,
    HistoryComponent,
    HistoryItemComponent
  ],
  imports: [
    CommonModule,
    CirculationRoutingModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    RecordModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    SharedPipesModule
  ],
  entryComponents: [
    PatronTransactionEventFormComponent
  ]
})
export class CirculationModule { }
